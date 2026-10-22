import React from 'react';
import { Instagram, RefreshCw } from 'lucide-react';

export default function Header({ hasData, onReset }) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30 px-4 py-3 sm:px-6">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-instagram-yellow via-instagram-pink to-instagram-purple p-[2px] flex items-center justify-center shadow-lg shadow-pink-500/10">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Instagram className="w-5 h-5 text-pink-500" />
            </div>
          </div>
          <div>
            <h1 className="font-bold text-base sm:text-lg leading-tight tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Unfollower Tracker
            </h1>
          </div>
        </div>

        {hasData && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Upload New</span>
          </button>
        )}
      </div>
    </header>
  );
}
