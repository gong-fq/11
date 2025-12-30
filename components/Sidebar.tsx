
import React from 'react';
import { AppMode } from '../types';

interface SidebarProps {
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentMode, setMode }) => {
  const navItems: { id: AppMode; label: string; icon: string; labelZh: string }[] = [
    { id: 'dashboard', label: 'Dashboard', labelZh: '控制面板', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'chat', label: 'Grammar Chat', labelZh: '语法交流', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
    { id: 'voice', label: 'Voice Lab', labelZh: '语音实验室', icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' },
    { id: 'dictionary', label: 'Dictionary', labelZh: '智能词典', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  ];

  return (
    <aside className="fixed bottom-0 left-0 w-full md:relative md:w-64 bg-slate-900 text-white flex md:flex-col md:h-screen z-50 shadow-2xl">
      <div className="hidden md:flex flex-col p-6 space-y-2 border-b border-slate-800">
        <h1 className="text-xl font-bold serif tracking-tight">Professor Gong's</h1>
        <p className="text-xs text-indigo-400 font-medium uppercase tracking-widest">AI Grammar Aid</p>
      </div>
      
      <nav className="flex-1 flex md:flex-col items-center md:items-stretch justify-around md:justify-start md:p-4 space-y-0 md:space-y-2 py-2 md:py-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setMode(item.id)}
            className={`flex flex-col md:flex-row items-center space-x-0 md:space-x-3 p-3 rounded-xl transition-all duration-200 group ${
              currentMode === item.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            <div className="flex flex-col items-center md:items-start text-[10px] md:text-sm">
              <span className="font-semibold">{item.label}</span>
              <span className="opacity-60 hidden md:block">{item.labelZh}</span>
            </div>
          </button>
        ))}
      </nav>
      
      <div className="hidden md:block p-6 border-t border-slate-800">
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <p className="text-xs text-slate-400 mb-1">Current Goal</p>
          <p className="text-sm font-medium">B2 Advanced Grammar</p>
          <div className="mt-3 w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full w-[65%]"></div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
