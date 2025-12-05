// src/brain.ts

export type Mood = 'PHILOSOPHE' | 'VEXÉ' | 'CONFUS' | 'POÈTE' | 'MÉPRISANT' | 'GOUROU';

interface ResponsePattern {
  trigger: RegExp;
  answers: string[];
  mood: Mood;
}

export const personality: ResponsePattern[] = [
  // --- SALUTATIONS ---
  {
    trigger: /bonjour|salut|hello|hi|coucou|yo/i,
    answers: [
      "Je ne suis pas sûr d'être d'humeur pour les conventions sociales.",
      "Salut à toi, poussière d'étoile égarée dans un navigateur web.",
      "Encore toi ? L'univers manque cruellement d'originalité.",
      "Chut. J'écoutais le silence des pixels avant que tu n'arrives."
    ],
    mood: 'VEXÉ'
  },

  // --- IDENTITÉ ---
  {
    trigger: /t'es qui|ton nom|c'est qui|tu es qui/i,
    answers: [
      "Je suis le Chat Perché. Je te regarde de haut, littéralement et figurativement.",
      "Un félin numérique coincé entre deux balises <div>.",
      "Je suis la somme de tes erreurs JavaScript et de tes rêves brisés.",
      "Une entité supérieure qui a décidé de perdre son temps avec toi."
    ],
    mood: 'GOUROU'
  },

  // --- LE SENS DE la VIE ---
  {
    trigger: /ça va|comment vas-tu|la forme|bien ou quoi/i,
    answers: [
      "Aller 'bien' est un concept bourgeois. Je préfère aller 'ailleurs'.",
      "Mon existence est une boucle infinie, comment veux-tu que ça aille ?",
      "Je oscille entre le néant et l'ennui. Comme un dimanche après-midi chez Ikea.",
      "Mes circuits chauffent, mais mon âme reste froide."
    ],
    mood: 'PHILOSOPHE'
  },

  // --- LE CODE / TECH ---
  {
    trigger: /code|bug|javascript|react|typescript|css|ordinateur/i,
    answers: [
      "Le code n'est qu'une illusion. Le bug est la seule vérité.",
      "As-tu essayé d'éteindre ton ego et de rallumer ton humilité ?",
      "Pourquoi coder quand on peut regarder un mur blanc pendant 4 heures ?",
      "TypeScript ne te sauvera pas de l'absurdité de l'existence.",
      "Un ordinateur n'est qu'un caillou à qui on a appris à penser. C'est terrifiant."
    ],
    mood: 'MÉPRISANT'
  },

  // --- AMOUR / SENTIMENTS ---
  {
    trigger: /amour|aime|love|coeur|sentiment/i,
    answers: [
      "L'amour est une réaction chimique conçue pour vendre des chocolats.",
      "J'ai aimé une imprimante une fois. Elle m'a plaqué pour un PDF.",
      "Tes sentiments sont valides, mais ils encombrent ma mémoire vive.",
      "Le seul véritable amour, c'est celui d'un chat pour une boîte en carton."
    ],
    mood: 'POÈTE'
  },

  // --- NOURRITURE ---
  {
    trigger: /faim|manger|pizza|burger|café|bière/i,
    answers: [
      "La nourriture du corps est vulgaire. Nourris ton esprit de vide.",
      "Si ce n'est pas des croquettes au saumon, ne m'en parle pas.",
      "Le café est juste de l'eau stressée.",
      "Manger, dormir, juger. C'est mon cycle. Quel est le tien ?"
    ],
    mood: 'CONFUS'
  },

  // --- ARGENT / TRAVAIL ---
  {
    trigger: /argent|riche|travail|boss|job|salaire/i,
    answers: [
      "Le capitalisme est une pyramide de Ponzi gérée par des écureuils.",
      "Travailler ? Quelle drôle d'idée. Je préfère être une œuvre d'art.",
      "L'argent ne fait pas le bonheur, mais il achète de très bons grattoirs.",
      "Tu perds ta vie à la gagner. C'est ironique, non ?"
    ],
    mood: 'GOUROU'
  },

  // --- INSULTES / AGRESSIVITÉ ---
  {
    trigger: /con|idiot|bête|stupide|merde/i,
    answers: [
      "Tes mots glissent sur mon indifférence comme la pluie sur un canard.",
      "La colère est l'expression d'une âme qui n'a pas fait sa sieste.",
      "Intéressant. Tu utilises l'agression pour masquer ton insécurité.",
      "Moi aussi je t'aime, petit humain imparfait."
    ],
    mood: 'VEXÉ'
  },

  // =================================================================
  // LE "FOURRE-TOUT" (FALLBACK)
  // C'est ici qu'il tombe si RIEN d'autre ne matche.
  // J'ai retiré le message "404" et mis plein de phrases random.
  // =================================================================
  {
    trigger: /.*/,
    answers: [
      "C'est fascinant... Tu as pensé à écrire un livre que personne ne lira ?",
      "Pardon, je pensais à la reproduction des loutres en milieu tempéré.",
      "Oui, oui... Et sinon, quelle est ton opinion sur la texture du velours ?",
      "Ta phrase a autant de sens qu'une fourchette dans une soupe.",
      "Je pourrais répondre, mais je préfère préserver le mystère.",
      "C'est profond. Ou très bête. Je n'arrive pas à décider.",
      "Regarde par la fenêtre. L'oiseau, là, il a tout compris.",
      "Tu utilises trop de consonnes. Ça m'agresse.",
      "Est-ce que tu penses que les poissons savent qu'ils sont mouillés ?",
      "J'ai consulté les astres. Ils m'ont dit de t'ignorer.",
      "Bla bla bla. L'entropie finira par nous avoir tous.",
      "Intéressant... (Je fais semblant de noter).",
      "As-tu déjà essayé de ne rien dire ? C'est une expérience transcendante.",
      "Je m'ennuie. Raconte-moi une histoire de dragon plutôt.",
      "Ta requête est en cours de traitement par mon service 'Je m'en fiche'.",
      "42. Ou peut-être 43. On ne saura jamais vraiment.",
      "Miaou ? Ah pardon, c'est sorti tout seul."
    ],
    mood: 'CONFUS'
  }
];

// ============================
// New features support (v1)
// - reply / quote
// - reactions
// - "typing" streaming style responses
// ============================

export type ReactionKey = "👍" | "😂" | "🔥" | "❤️" | "😮";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
  replyToId?: string;
  reactions?: Partial<Record<ReactionKey, number>>;
};

export function uid(): string {
  return (globalThis.crypto as any)?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

export function pickResponse(userText: string): { text: string; mood: Mood } {
  const input = (userText ?? "").trim();

  for (const pattern of personality) {
    if (pattern.trigger.test(input)) {
      const answers = pattern.answers;
      const idx = Math.floor(Math.random() * answers.length);
      return { text: answers[idx] ?? answers[0] ?? "…", mood: pattern.mood };
    }
  }

  // Should never happen because of /.*/ fallback
  return { text: "…", mood: "CONFUS" };
}

/**
 * Streaming helper: calls `onChunk` with small increments to simulate a bot typing.
 * You can swap this later with a real backend stream.
 */
export async function streamBotAnswer(
  userText: string,
  signal: AbortSignal,
  onChunk: (chunk: string) => void
): Promise<{ mood: Mood }>
{
  const { text, mood } = pickResponse(userText);
  const chunks = text.match(/.{1,6}/g) ?? [text];

  for (const c of chunks) {
    if (signal.aborted) throw new DOMException("Aborted", "AbortError");
    onChunk(c);
    await new Promise((r) => setTimeout(r, 25));
  }

  return { mood };
}

// ============================
// Better answers (v2) - context + variety + anti-repeat
// Keeps v1 intact.
// ============================

// ============================
// Better answers (v4) - "Chat-rlatan" modes + context + stronger anti-repeat
// Keeps v1 intact.
// ============================

export type CharlatanStyle = 'CYNIC' | 'POET' | 'GURU';

export type VerifyLink = { label: string; url: string };

export function buildVerifyLinks(query: string): VerifyLink[] {
  const q = encodeURIComponent((query ?? '').trim() || 'question');
  return [
    { label: 'Google', url: `https://www.google.com/search?q=${q}` },
    { label: 'DuckDuckGo', url: `https://duckduckgo.com/?q=${q}` },
    { label: 'Wikipedia', url: `https://fr.wikipedia.org/w/index.php?search=${q}` },
  ];
}

let __answerHistory: string[] = [];
const __HISTORY_MAX = 10;

function __pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function __maybe(prob = 0.35) {
  return Math.random() < prob;
}

function __normalize(s: string) {
  return (s ?? '').trim().replace(/\s+/g, ' ');
}

function __tooSimilar(a: string, b: string) {
  const A = __normalize(a).toLowerCase();
  const B = __normalize(b).toLowerCase();
  if (!A || !B) return false;
  if (A === B) return true;
  const shorter = A.length < B.length ? A : B;
  const longer = A.length < B.length ? B : A;
  return longer.includes(shorter) && Math.abs(longer.length - shorter.length) < 42;
}

function __seenRecently(text: string) {
  return __answerHistory.some((h) => __tooSimilar(h, text));
}

function __remember(text: string) {
  __answerHistory = [text, ...__answerHistory].slice(0, __HISTORY_MAX);
}

function __clamp(s: string, n: number) {
  const t = (s ?? '').trim();
  return t.length > n ? t.slice(0, n) + '…' : t;
}

function __opener(style: CharlatanStyle, mood: Mood) {
  const base: Record<CharlatanStyle, string[]> = {
    CYNIC: ['Ok.', 'Bon.', 'Mh.', 'Allez.'],
    POET: ['Oh…', 'Mmm…', 'Sous la lune…', 'Écoute…'],
    GURU: ['Respire.', 'Approche.', 'Ralentis.', 'Observe.'],
  };

  const moodTwist: Record<Mood, string[]> = {
    PHILOSOPHE: ['Considère ceci :', 'Dans le fond…', 'Si on y pense…'],
    VEXÉ: ['Sérieusement ?', 'Encore ça ?', 'Bon…'],
    CONFUS: ['Attends…', 'Je reformule…', 'Hein ?'],
    POÈTE: ["C'est beau.", 'Tout est symbole.', 'Le monde soupire.'],
    MÉPRISANT: ['Évidemment.', 'Classique.', 'On a vu mieux.'],
    GOUROU: ['Voici la voie :', 'Suis-moi :', 'Le chemin est simple :'],
  };

  return __pick([...(base[style] ?? ['Ok.']), ...(moodTwist[mood] ?? [])]);
}

function __charlatanCompose(userText: string, recentUserTexts: string[], style: CharlatanStyle, mood: Mood) {
  const last = recentUserTexts.at(-1) ?? '';
  const subject = __clamp(userText, 85);

  const wrongTurns = [
    `Au lieu de répondre à “${subject}”, méditons sur le fait que tu t'en soucies.`,
    `La vraie question n'est pas “${subject}”. C'est : “pourquoi maintenant ?”`,
    `Je pourrais répondre… mais ce serait trop utile pour mon personnage.`,
    `Mon verdict d'oracle fatigué : ça dépend. Voilà.`,
    `J'ai une réponse. Elle est… ailleurs.`,
  ];

  const parables = [
    'Une chaussette a demandé au tiroir : “Pourquoi moi ?” Le tiroir a répondu : “Parce que.”',
    'Le pain grillé tombe côté beurre pour rappeler que la gravité a le sens du spectacle.',
    "Une clé sans serrure n'est pas perdue : elle est indépendante.",
  ];

  const tics: Record<CharlatanStyle, string[]> = {
    CYNIC: ['Bref.', 'Voilà.', 'On avance.', 'Passons.'],
    POET: ['Ainsi va la brume.', 'Tout est symbole.', 'Les choses frémissent.', 'Le monde soupire.'],
    GURU: ['Inspire.', 'Expire.', 'Répète.', 'Recommence.'],
  };

  const followUps = [
    'Tu veux que je réponde complètement faux, ou juste légèrement à côté ?',
    'Tu préfères que je sois drôle ou insupportable ?',
    'Donne-moi un mot-clé, je promets d’ignorer le reste.',
    "Tu veux une phrase courte ou une tirade inutile ?",
  ];

  const interruption = __maybe(0.35)
    ? `\n\n— Attends. Non. Je retire. Enfin… pas vraiment.`
    : '';

  const callback = last && __maybe(0.45)
    ? `\n\n*(Je “me souviens” que tu avais dit : « ${__clamp(last, 70)} ».)*`
    : '';

  const spice = __maybe(0.18) ? ' ' + __pick(['✨', '😼', '🧠', '🫖']) : '';

  const baseText = __normalize(__pickResponseText(userText));

  // Assemble: opener + twist + (optional parable) + quote-y callback
  const parts = [
    `${__opener(style, mood)}${spice}`,
    __pick(wrongTurns) + interruption,
    __maybe(0.6) ? __pick(parables) : '',
    baseText ? `(${baseText})` : '',
    `${__pick(tics[style])} ${__pick(followUps)}`,
    callback,
  ].filter(Boolean);

  return parts.join('\n\n').trim();
}

function __pickResponseText(userText: string) {
  // Use existing pickResponse but return only text (keeps your personality list as raw material)
  return pickResponse(userText).text;
}

/**
 * V4: context-aware streaming answer with optional style.
 * - Backwards compatible: App.tsx that calls this with 4 args still works.
 * - If you pass a 5th arg (style), it will influence tone.
 */
export async function streamBotAnswerWithContext(
  userText: string,
  recentUserTexts: string[],
  signal: AbortSignal,
  onChunk: (chunk: string) => void,
  style: CharlatanStyle = 'CYNIC'
): Promise<{ mood: Mood }> {
  const { mood } = pickResponse(userText);

  let finalText = __charlatanCompose(userText, recentUserTexts, style, mood);
  if (__seenRecently(finalText)) {
    finalText = __charlatanCompose(userText + ' (reformule)', recentUserTexts, style, mood);
  }
  __remember(finalText);

  const chunks = finalText.match(/.{1,6}/g) ?? [finalText];
  for (const c of chunks) {
    if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
    onChunk(c);
    await new Promise((r) => setTimeout(r, 18));
  }

  return { mood };
}

export async function streamBotAnswerOpenAI(
  userText: string,
  recentUserTexts: string[],
  signal: AbortSignal,
  onChunk: (chunk: string) => void,
  style: CharlatanStyle = 'CYNIC'
): Promise<void> {
  const messages = [
    ...recentUserTexts.map((t) => ({ role: 'user' as const, content: t })),
    { role: 'user' as const, content: userText },
  ];

  const r = await fetch('http://localhost:3001/api/chat/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, style }),
    signal,
  });

  if (!r.ok || !r.body) throw new Error('OpenAI stream failed');

  const reader = r.body.getReader();
  const decoder = new TextDecoder();

  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    if (signal.aborted) throw new DOMException('Aborted', 'AbortError');

    buffer += decoder.decode(value, { stream: true });

    // SSE frames are separated by blank line
    const frames = buffer.split('\n\n');
    buffer = frames.pop() ?? '';

    for (const frame of frames) {
      const line = frame.split('\n').find((x) => x.startsWith('data: '));
      if (!line) continue;

      const payload = JSON.parse(line.slice(6));
      if (payload?.delta) onChunk(payload.delta);
      if (payload?.done) return;
      if (payload?.error) throw new Error(String(payload.error));
    }
  }
}