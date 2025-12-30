
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import VoiceLab from './components/VoiceLab';
import Dictionary from './components/Dictionary';
import { AppMode } from './types';

const Dashboard: React.FC = () => (
  <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
    <div className="relative overflow-hidden bg-indigo-700 rounded-3xl p-8 text-white shadow-2xl shadow-indigo-200">
      <div className="relative z-10">
        <h2 className="text-4xl font-bold mb-2 serif">Welcome Back, Learner!</h2>
        <p className="text-indigo-100 text-lg opacity-90">Ready to master English grammar today?</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20">
            <p className="text-sm font-medium opacity-70">Study Streak</p>
            <p className="text-2xl font-bold">12 Days 🔥</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20">
            <p className="text-sm font-medium opacity-70">Rules Mastered</p>
            <p className="text-2xl font-bold">158 🏆</p>
          </div>
        </div>
      </div>
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500 rounded-full blur-3xl opacity-30"></div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold mb-4 flex items-center">
           <span className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center mr-2">📚</span>
           Daily Grammar Rule
        </h3>
        <div className="bg-slate-50 p-6 rounded-2xl border-l-4 border-amber-500">
           <h4 className="font-bold text-lg text-slate-800 mb-1 italic">Subjunctive Mood (虚拟语气)</h4>
           <p className="text-slate-600 mb-4 text-sm leading-relaxed">
             Used to express hypothetical situations, wishes, or demands. 
             "If I **were** you, I would take that offer." (Note: 'were' is used even for singular subjects)
           </p>
           <div className="text-sm font-medium text-slate-400">
             If I were (not was) + would + verb...
           </div>
        </div>
      </section>

      <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold mb-4 flex items-center">
           <span className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mr-2">🎯</span>
           Quick Quiz
        </h3>
        <p className="text-slate-600 mb-4 text-sm">Find the mistake in the sentence below:</p>
        <div className="p-4 bg-emerald-50 text-emerald-900 rounded-xl font-medium border border-emerald-100 mb-4">
          "She don't like playing tennis on Sundays."
        </div>
        <button className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
          Submit Answer
        </button>
      </section>
    </div>
  </div>
);

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('dashboard');

  const renderContent = () => {
    switch (mode) {
      case 'dashboard': return <Dashboard />;
      case 'chat': return <div className="h-full md:p-8"><ChatInterface /></div>;
      case 'voice': return <div className="h-full md:p-8"><VoiceLab /></div>;
      case 'dictionary': return <div className="h-full md:p-8 overflow-y-auto"><Dictionary /></div>;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#f8fafc] text-slate-900 overflow-hidden">
      <Sidebar currentMode={mode} setMode={setMode} />
      
      <main className="flex-1 flex flex-col min-h-0 relative pb-20 md:pb-0">
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white/50 backdrop-blur-md border-b border-slate-100 sticky top-0 z-10">
          <div>
            <span className="text-slate-400 text-sm font-medium">Classroom</span>
            <h1 className="text-xl font-bold text-slate-800 uppercase tracking-tight">
               {mode.replace(/^[a-z]/, (L) => L.toUpperCase())}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
             <div className="flex -space-x-2">
                <img src="https://picsum.photos/seed/user1/40/40" className="w-8 h-8 rounded-full border-2 border-white" alt="avatar" />
             </div>
             <button className="bg-white p-2 rounded-full shadow-sm hover:shadow-md transition-shadow border border-slate-100">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-hidden h-full">
           {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
