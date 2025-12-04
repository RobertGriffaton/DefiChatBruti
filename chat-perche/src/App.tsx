import { useState, useRef, useEffect } from 'react';
import { personality } from './brain';

function App() {
  const [messages, setMessages] = useState<{text: string, isBot: boolean}[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(scrollToBottom, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userText = input;
    setMessages(prev => [...prev, { text: userText, isBot: false }]);
    setInput("");
    setIsTyping(true);

    const delay = Math.random() * 2000 + 1000;

    setTimeout(() => {
      const match = personality.find(p => p.trigger.test(userText));
      const answers = match ? match.answers : personality[personality.length - 1].answers;
      const response = answers[Math.floor(Math.random() * answers.length)];
      
      setMessages(prev => [...prev, { text: response, isBot: true }]);
      setIsTyping(false);
    }, delay);
  };

  const handleReset = () => {
    if (confirm("Effacer la conversation avec Chat Perché ?")) {
        setMessages([]);
        setInput("");
        setIsTyping(false);
    }
  };

  return (
    // Fond global (comme le bureau d'un téléphone ou un fond sombre)
    <div className="min-h-screen bg-black flex justify-center items-center font-sans">
      
      {/* CADRE DU TÉLÉPHONE */}
      <div className="w-full max-w-md h-[850px] bg-white sm:rounded-[3rem] sm:border-[10px] sm:border-gray-900 overflow-hidden flex flex-col relative shadow-2xl">
        
        {/* --- HEADER (Style iOS) --- */}
        <div className="bg-[#F5F5F5]/90 backdrop-blur-md border-b border-gray-300 p-4 pt-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            {/* Flèche retour (décorative) */}
            <div className="text-blue-500 font-medium text-lg flex items-center -ml-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              <span>Retour</span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden mb-1">
               <span className="text-xl">🐱</span>
            </div>
            <h1 className="text-xs font-semibold text-gray-900">Chat Perché</h1>
          </div>

          <button 
            onClick={handleReset}
            className="text-blue-500 hover:text-blue-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
          </button>
        </div>

        {/* --- ZONE DE CHAT --- */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-white scrollbar-hide">
          <div className="text-center text-gray-400 text-xs py-4 font-medium">
            iMessage avec un philosophe raté
          </div>

          {messages.map((msg, index) => (
            <div key={index} className={`flex w-full ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
              <div 
                className={`max-w-[75%] px-4 py-2 text-[15px] leading-relaxed shadow-sm ${
                  msg.isBot 
                    ? 'bg-[#E9E9EB] text-black rounded-2xl rounded-bl-sm' // Bulle grise (iOS Bot)
                    : 'bg-[#007AFF] text-white rounded-2xl rounded-br-sm' // Bulle bleue (iOS User)
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          
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
        </div>

        {/* --- INPUT (Style iOS) --- */}
        <div className="p-3 bg-[#F5F5F5] border-t border-gray-300 flex items-end gap-2">
          {/* Bouton "Plus" (décoratif) */}
          <button className="h-8 w-8 bg-gray-300 text-white rounded-full flex-shrink-0 flex items-center justify-center mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>

          <div className="flex-1 min-h-[36px] bg-white border border-gray-300 rounded-2xl px-3 py-1 flex items-center focus-within:ring-2 focus-within:ring-blue-500/20">
            <input 
              type="text"
              className="w-full bg-transparent outline-none text-[15px] placeholder-gray-400"
              placeholder="iMessage"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
          </div>

          {/* Bouton Envoyer (Flèche bleue iOS) */}
          {input.trim() && (
             <button 
             onClick={handleSend}
             className="h-8 w-8 bg-[#007AFF] text-white rounded-full flex-shrink-0 flex items-center justify-center mb-1 transition-transform active:scale-90"
           >
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
           </button>
          )}
        </div>
        
        {/* Barre du bas iPhone */}
        <div className="h-5 bg-[#F5F5F5] w-full flex justify-center pt-1">
            <div className="w-1/3 h-1 bg-gray-300 rounded-full"></div>
        </div>

      </div>
    </div>
  );
}

export default App;