import React, { useState } from 'react';
import { Bot, Send, Languages, Sparkles, User, HelpCircle } from 'lucide-react';

export default function ChatbotWidget() {
  const [language, setLanguage] = useState('en');
  const [inputQuery, setInputQuery] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      sender: 'bot',
      text: 'Namaste! I am CoalGuard AI, your multilingual coal mine governance assistant. How can I help you today?',
    },
  ]);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी (Hindi)' },
    { code: 'bn', name: 'বাংলা (Bengali)' },
    { code: 'or', name: 'ଓଡ଼ିଆ (Odia)' },
  ];

  const suggestionChips = {
    en: [
      "What is the compliance status of Jharia Mine?",
      "Show all active high-risk alerts",
      "How do I submit an offline field inspection report?",
    ],
    hi: [
      "झरिया खदान की अनुपालन स्थिति क्या है?",
      "सभी उच्च जोखिम चेतावनियाँ दिखाएं",
      "ऑफ़लाइन रिपोर्ट कैसे सबमिट करें?",
    ],
    bn: [
      "ঝরিয়া খনির অবস্থা কী?",
      "সকল উচ্চ ঝুঁকির সতর্কতা দেখান",
    ],
    or: [
      "ଝରିଆ ଖଣିର ସ୍ଥିତି କଣ?",
      "ଉଚ୍ଚ ବିପଦ ଚେତାବନୀ ଦେଖାନ୍ତୁ",
    ],
  };

  const handleSend = async (queryText) => {
    const q = queryText || inputQuery;
    if (!q.trim()) return;

    const userMsg = { id: `u-${Date.now()}`, sender: 'user', text: q };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsSending(true);

    try {
      const res = await fetch('/api/chatbot/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, language }),
      });
      const data = await res.json();
      const botMsg = { id: `b-${Date.now()}`, sender: 'bot', text: data.reply };
      setMessages(prev => [...prev, botMsg]);
      setIsSending(false);
    } catch (err) {
      setMessages(prev => [...prev, { id: `b-${Date.now()}`, sender: 'bot', text: "Unable to connect to AI server." }]);
      setIsSending(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 bg-slate-950 min-h-screen text-slate-100 flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">CoalGuard Multilingual AI Assistant App</h2>
            <p className="text-xs text-slate-400">Natural language voice & text assistant in regional Indian mining languages</p>
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          <Languages className="w-4 h-4 text-amber-400" />
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="bg-transparent text-xs text-white font-bold focus:outline-none"
          >
            {languages.map(l => (
              <option key={l.code} value={l.code} className="bg-slate-900 text-white">{l.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Suggestion Chips */}
      <div className="flex flex-wrap gap-2 shrink-0">
        {(suggestionChips[language] || suggestionChips['en']).map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip)}
            className="text-xs bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{chip}</span>
          </button>
        ))}
      </div>

      {/* Messages Thread Container */}
      <div className="flex-1 bg-slate-900 p-6 rounded-2xl border border-slate-800 overflow-y-auto space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              msg.sender === 'user' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-purple-600 text-white'
            }`}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`p-4 rounded-2xl max-w-xl text-xs leading-relaxed ${
              msg.sender === 'user' 
                ? 'bg-amber-500/10 text-amber-200 border border-amber-500/30' 
                : 'bg-slate-950 text-slate-200 border border-slate-800'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isSending && (
          <div className="flex items-center space-x-2 text-xs text-amber-400 font-medium p-2">
            <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
            <span>CoalGuard AI is processing query...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form onSubmit={e => { e.preventDefault(); handleSend(); }} className="flex space-x-3 shrink-0">
        <input
          type="text"
          value={inputQuery}
          onChange={e => setInputQuery(e.target.value)}
          placeholder={`Type or speak query in ${languages.find(l=>l.code===language)?.name}...`}
          className="flex-1 bg-slate-900 border border-slate-800 text-white rounded-xl px-4 py-3 text-xs focus:ring-amber-500"
        />
        <button
          type="submit"
          disabled={isSending}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-6 py-3 rounded-xl transition flex items-center space-x-2"
        >
          <Send className="w-4 h-4" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
}
