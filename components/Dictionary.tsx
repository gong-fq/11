
import React, { useState } from 'react';
import { lookupDictionary } from '../services/aiService';
import { DictionaryEntry } from '../types';

const Dictionary: React.FC = () => {
  const [word, setWord] = useState('');
  const [entry, setEntry] = useState<DictionaryEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!word.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await lookupDictionary(word);
      setEntry(data);
    } catch (err) {
      console.error(err);
      setError("I couldn't find that term in my library. Please try another.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-2xl border border-slate-100 min-h-[500px]">
      <h2 className="text-3xl font-bold serif mb-6 text-slate-800">Lexicon Assistant</h2>
      
      <div className="flex space-x-2 mb-8">
        <input
          value={word}
          onChange={(e) => setWord(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Examine a term..."
          className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 transition-all shadow-md active:scale-95"
        >
          {loading ? 'Consulting...' : 'Lookup'}
        </button>
      </div>

      {error && (
        <div className="p-4 mb-4 bg-red-50 text-red-600 rounded-xl border border-red-100 italic">
          {error}
        </div>
      )}

      {entry && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-baseline flex-wrap gap-4 mb-4">
            <h3 className="text-4xl font-bold text-indigo-600 serif">{entry.word}</h3>
            <span className="text-slate-400 font-mono text-lg">{entry.phonetic}</span>
            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm font-bold uppercase tracking-wider">{entry.pos}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-4 bg-slate-50 rounded-xl border-l-4 border-indigo-500">
              <p className="text-xs text-slate-400 uppercase font-bold mb-1">English Definition</p>
              <p className="text-slate-800 leading-relaxed">{entry.definition_en}</p>
            </div>
            <div className="p-4 bg-indigo-50/50 rounded-xl border-l-4 border-indigo-400">
              <p className="text-xs text-indigo-400 uppercase font-bold mb-1">Chinese Definition</p>
              <p className="text-slate-800 leading-relaxed font-medium">{entry.definition_zh}</p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Standard Context
            </h4>
            <ul className="space-y-3">
              {entry.examples.map((ex, i) => (
                <li key={i} className="flex items-start space-x-3 text-slate-700 bg-white p-3 rounded-lg border border-slate-100 shadow-sm italic">
                  <span className="text-indigo-400 font-bold mt-1">•</span>
                  <span>{ex}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dictionary;
