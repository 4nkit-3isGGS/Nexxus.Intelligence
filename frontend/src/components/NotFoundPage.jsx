import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center p-6 bg-slate-50 text-slate-900">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-xl text-center animate-fade-in flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center shadow-xs mb-4">
          <span className="material-symbols-outlined text-[36px]">travel_explore</span>
        </div>

        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono text-[10px] font-bold border border-slate-200 mb-2">
          ERROR 404 // NOT FOUND
        </span>

        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
          Page Not Found
        </h1>

        <p className="mt-2 text-xs text-slate-600 leading-relaxed">
          The requested operational view or investigation resource does not exist or has been relocated.
        </p>

        <div className="flex items-center gap-2 mt-6 w-full">
          <button
            onClick={() => navigate('/')}
            className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition-colors cursor-pointer"
          >
            Portal Home
          </button>
          <button
            onClick={() => navigate('/workspace/graph')}
            className="flex-1 py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            Knowledge Graph
          </button>
        </div>
      </div>
    </div>
  );
}
