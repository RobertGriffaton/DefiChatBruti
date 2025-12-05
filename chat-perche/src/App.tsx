import { useState, useRef, useEffect, useMemo } from 'react';
import { streamBotAnswerWithContext, streamBotAnswerOpenAI, buildVerifyLinks, uid, type ReactionKey, type CharlatanStyle } from './brain';
type Msg = {
  id: string;
  text: string;
  isBot: boolean;
  createdAt: number;
  replyToId?: string;
  reactions?: Partial<Record<ReactionKey, number>>;
  deleted?: boolean;
  edited?: boolean;
  links?: { label: string; url: string }[];
};

const REACTIONS: ReactionKey[] = ['👍', '😂', '🔥', '❤️', '😮'];

const STORAGE_KEY = 'defichat_messages_v1';

function App() {
  const [messages, setMessages] = useState<Msg[]>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw) as Msg[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Reply
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [style, setStyle] = useState<CharlatanStyle>('CYNIC');
  const [llmMode, setLlmMode] = useState<'LOCAL' | 'OPENAI'>('LOCAL');

  // Streaming control
  const abortRef = useRef<AbortController | null>(null);

  // Autoscroll / new messages pill
  const listRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [newCount, setNewCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const byId = useMemo(() => {
    const m = new Map<string, Msg>();
    messages.forEach((x) => m.set(x.id, x));
    return m;
  }, [messages]);

  const replyTarget = replyToId ? byId.get(replyToId) : undefined;

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
    setNewCount(0);
    setIsAtBottom(true);
  };

  useEffect(() => {
    // keep your old behavior: scroll when new msg OR typing state, but only if user is at bottom
    if (isAtBottom) scrollToBottom('smooth');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, isTyping]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    const onScroll = () => {
      const threshold = 64;
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
      setIsAtBottom(atBottom);
      if (atBottom) setNewCount(0);
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const onNewMessage = () => {
    if (isAtBottom) scrollToBottom('auto');
    else setNewCount((c) => c + 1);
  };

  const stop = () => {
    abortRef.current?.abort();
  };

  const reactTo = (id: string, r: ReactionKey) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id !== id
          ? m
          : {
              ...m,
              reactions: {
                ...(m.reactions ?? {}),
                [r]: ((m.reactions?.[r] ?? 0) + 1) as number,
              },
            }
      )
    );
  };

  const copyMessage = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore
    }
  };

  const softDelete = (id: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, deleted: true, text: '— message supprimé —' }
          : m
      )
    );
    if (replyToId === id) setReplyToId(null);
    if (editingId === id) cancelEdit();
  };

  const startEdit = (id: string) => {
    const m = byId.get(id);
    if (!m || m.deleted || m.isBot) return;
    setEditingId(id);
    setInput(m.text);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setInput('');
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    if (isTyping) return;

    if (editingId) {
      setMessages((prev) =>
        prev.map((m) => (m.id === editingId ? { ...m, text: input, edited: true } : m))
      );
      cancelEdit();
      return;
    }

    const userText = input;

    const userMsg: Msg = {
      id: uid(),
      text: userText,
      isBot: false,
      createdAt: Date.now(),
      replyToId: replyToId ?? undefined,
      reactions: {},
    };

    const botId = uid();
    const botMsg: Msg = {
      id: botId,
      text: '',
      isBot: true,
      createdAt: Date.now() + 1,
      reactions: {},
      links: buildVerifyLinks(userText),
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput('');
    setReplyToId(null);

    onNewMessage();
    onNewMessage();

    setIsTyping(true);
    const ac = new AbortController();
    abortRef.current = ac;

    try {
      const recentUserTexts = [...messages, userMsg]
        .filter((m) => !m.isBot)
        .slice(-6)
        .map((m) => m.text);

      const onChunk = (chunk: string) => {
        setMessages((prev) =>
          prev.map((m) => (m.id === botId ? { ...m, text: m.text + chunk } : m))
        );
        onNewMessage();
      };

      if (llmMode === 'OPENAI') {
        await streamBotAnswerOpenAI(userText, recentUserTexts, ac.signal, onChunk, style);
      } else {
        await streamBotAnswerWithContext(userText, recentUserTexts, ac.signal, (chunk) => {
          setMessages((prev) =>
            prev.map((m) => (m.id === botId ? { ...m, text: m.text + chunk } : m))
          );
          onNewMessage();
        }, style);
      }  // ✅ CETTE LIGNE manquait
      } catch (e: any) {
      if (e?.name === 'AbortError') {
        // keep what was generated so far
      } else {
        setMessages((prev) =>
          prev.map((m) => (m.id === botId ? { ...m, text: 'Oups… erreur.' } : m))
        );
      }
    } finally {
      setIsTyping(false);
      abortRef.current = null;
    }
  };

  const handleReset = () => {
    if (confirm('Effacer la conversation avec Chat Perché ?')) {
      stop();
      setMessages([]);
      setInput('');
      setIsTyping(false);
      setReplyToId(null);
      setNewCount(0);
      cancelEdit();
      setSearch('');
    }
  };

  return (
    <div className="min-h-screen bg-black flex justify-center items-center font-sans">
      <div className="w-full max-w-md h-[850px] bg-white sm:rounded-[3rem] sm:border-[10px] sm:border-gray-900 overflow-hidden flex flex-col relative shadow-2xl">
        {/* --- HEADER (Style iOS) --- */}
        <div className="bg-[#F5F5F5]/90 backdrop-blur-md border-b border-gray-300 p-4 pt-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="text-blue-500 font-medium text-lg flex items-center -ml-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              <span>Retour</span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden mb-1">
              <span className="text-xl">🐱</span>
            </div>
            <h1 className="text-xs font-semibold text-gray-900">Chat Perché</h1>
            <div className="mt-1 flex gap-1">
              {(['CYNIC', 'POET', 'GURU'] as CharlatanStyle[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`text-[10px] px-2 py-0.5 rounded-full border ${
                    style === s
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-700 border-gray-300'
                  }`}
                  type="button"
                  title={`Style: ${s}`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="mt-1 flex gap-1">
              {(['LOCAL', 'OPENAI'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setLlmMode(m)}
                  className={`text-[10px] px-2 py-0.5 rounded-full border ${
                    llmMode === m
                      ? 'bg-[#007AFF] text-white border-[#007AFF]'
                      : 'bg-white text-gray-700 border-gray-300'
                  }`}
                  type="button"
                  title={`Mode: ${m}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher…"
              className="hidden sm:block text-xs px-3 py-1 rounded-full border border-gray-300 bg-white"
            />
            {/* Stop button (only when typing/streaming) */}
            <button
              onClick={stop}
              disabled={!isTyping}
              className={`text-blue-500 hover:text-blue-700 transition-colors ${!isTyping ? 'opacity-40 cursor-not-allowed' : ''}`}
              title="Stop"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="6" y="6" width="12" height="12" rx="2"></rect>
              </svg>
            </button>

            <button
              onClick={handleReset}
              className="text-blue-500 hover:text-blue-700 transition-colors"
              title="Effacer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* --- ZONE DE CHAT --- */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-2 bg-white scrollbar-hide relative">
          <div className="text-center text-gray-400 text-xs py-4 font-medium">
            iMessage avec un philosophe raté
          </div>

          {messages
            .filter((m) => !search.trim() || m.text.toLowerCase().includes(search.trim().toLowerCase()))
            .map((msg) => {
            const replied = msg.replyToId ? byId.get(msg.replyToId) : undefined;

            return (
              <div key={msg.id} className={`flex w-full ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className="max-w-[78%]">
                  {/* Reply/quote preview */}
                  {replied && (
                    <div className={`mb-1 px-3 py-2 text-xs rounded-xl border ${msg.isBot ? 'bg-gray-100 border-gray-200 text-gray-700' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
                      <div className="font-semibold mb-0.5">↩ Réponse à :</div>
                      <div className="line-clamp-2">{replied.text}</div>
                    </div>
                  )}

                  <div
                    className={`group relative max-w-[100%] px-4 py-2 text-[15px] leading-relaxed shadow-sm ${
                      msg.isBot
                        ? 'bg-[#E9E9EB] text-black rounded-2xl rounded-bl-sm'
                        : 'bg-[#007AFF] text-white rounded-2xl rounded-br-sm'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                    {msg.edited && <div className="text-[11px] opacity-60 mt-1">(modifié)</div>}

                    {/* hover actions */}
                    <div className={`absolute -bottom-9 ${msg.isBot ? 'left-0' : 'right-0'} opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1`}
                      style={{ pointerEvents: 'auto' }}
                    >
                      <button
                        onClick={() => setReplyToId(msg.id)}
                        className="text-[11px] px-2 py-1 rounded-full bg-white border border-gray-200 shadow"
                        type="button"
                        title="Répondre"
                      >
                        ↩ Reply
                      </button>

                      <button
                        onClick={() => copyMessage(msg.text)}
                        className="text-[11px] px-2 py-1 rounded-full bg-white border border-gray-200 shadow"
                        type="button"
                        title="Copier"
                      >
                        📋 Copier
                      </button>

                      {!msg.isBot && !msg.deleted && (
                        <button
                          onClick={() => startEdit(msg.id)}
                          className="text-[11px] px-2 py-1 rounded-full bg-white border border-gray-200 shadow"
                          type="button"
                          title="Éditer"
                        >
                          ✏️ Éditer
                        </button>
                      )}

                      <button
                        onClick={() => softDelete(msg.id)}
                        className="text-[11px] px-2 py-1 rounded-full bg-white border border-gray-200 shadow"
                        type="button"
                        title="Supprimer"
                      >
                        🗑️
                      </button>

                      <div className="flex items-center gap-1">
                        {REACTIONS.map((r) => (
                          <button
                            key={r}
                            onClick={() => reactTo(msg.id, r)}
                            className="text-[11px] px-2 py-1 rounded-full bg-white border border-gray-200 shadow"
                            type="button"
                            title={`Réagir ${r}`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {msg.isBot && msg.links?.length ? (
                    <div className="mt-1 flex flex-wrap gap-2">
                      {msg.links.map((l) => (
                        <a
                          key={l.url}
                          href={l.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] px-2 py-1 rounded-full bg-gray-100 border border-gray-200 text-blue-700"
                        >
                          🔎 {l.label}
                        </a>
                      ))}
                    </div>
                  ) : null}

                  {/* reaction pills */}
                  {msg.reactions && (
                    <div className={`mt-1 flex flex-wrap gap-1 ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                      {Object.entries(msg.reactions)
                        .filter(([, v]) => (v ?? 0) > 0)
                        .map(([k, v]) => (
                          <span
                            key={k}
                            className="text-[11px] px-2 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200"
                          >
                            {k} {v}
                          </span>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* typing bubbles stays for vibe (optional) */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[#E9E9EB] text-gray-500 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />

          {/* new messages pill */}
          {newCount > 0 && (
            <button
              onClick={() => scrollToBottom('smooth')}
              className="sticky bottom-2 left-1/2 -translate-x-1/2 mx-auto block px-4 py-2 rounded-full bg-black/80 text-white text-xs shadow-lg"
              type="button"
            >
              ↓ {newCount} nouveau(x) message(s)
            </button>
          )}
        </div>

        {/* Reply bar or Edit bar */}
        {(replyTarget || editingId) && (
          <div className="px-3 py-2 bg-[#F5F5F5] border-t border-gray-300 flex items-center justify-between gap-2">
            {replyTarget && (
              <div className="text-xs text-gray-700 truncate">
                Réponse à: <span className="font-semibold">{replyTarget.text}</span>
              </div>
            )}
            {editingId && (
              <div className="text-xs text-gray-700 truncate">
                Édition en cours
              </div>
            )}
            <button
              onClick={() => {
                setReplyToId(null);
                cancelEdit();
              }}
              className="text-xs text-blue-500 hover:text-blue-700"
              type="button"
            >
              Annuler
            </button>
          </div>
        )}

        {/* --- INPUT (Style iOS) --- */}
        <div className="p-3 bg-[#F5F5F5] border-t border-gray-300 flex items-end gap-2">
          <button className="h-8 w-8 bg-gray-300 text-white rounded-full flex-shrink-0 flex items-center justify-center mb-1" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>

          <div className="flex-1 min-h-[36px] bg-white border border-gray-300 rounded-2xl px-3 py-1 flex items-center focus-within:ring-2 focus-within:ring-blue-500/20">
            <input
              type="text"
              className="w-full bg-transparent outline-none text-[15px] placeholder-gray-400"
              placeholder={editingId ? 'Éditer…' : 'iMessage'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={isTyping}
            />
          </div>

          {input.trim() && (
            <button
              onClick={handleSend}
              className="h-8 w-8 bg-[#007AFF] text-white rounded-full flex-shrink-0 flex items-center justify-center mb-1 transition-transform active:scale-90"
              type="button"
              disabled={isTyping}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="19" x2="12" y2="5"></line>
                <polyline points="5 12 12 5 19 12"></polyline>
              </svg>
            </button>
          )}
        </div>

        <div className="h-5 bg-[#F5F5F5] w-full flex justify-center pt-1">
          <div className="w-1/3 h-1 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

export default App;