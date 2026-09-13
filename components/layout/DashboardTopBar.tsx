'use client';

import { Search, Bell, ChevronDown } from 'lucide-react';

interface Props {
  userName?: string | null;
}

export default function DashboardTopBar({ userName }: Props) {
  const initial = userName ? userName.charAt(0).toUpperCase() : 'U';
  const firstName = userName ? userName.split(' ')[0] : 'User';

  return (
    <header className="h-20 bg-[#F9FAFB] flex items-center justify-between px-10 border-b border-transparent shrink-0 w-full z-10 sticky top-0">
      
      {/* Search Bar */}
      <div className="flex-1 max-w-2xl relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input 
          type="text" 
          placeholder="Search assessments, topics, or concepts..." 
          className="block w-full pl-11 pr-4 py-2.5 bg-slate-100/80 border-transparent rounded-xl text-sm placeholder-slate-400 focus:border-[#0A3D2C] focus:bg-white focus:ring-0 transition-colors"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6 ml-6">
        <button className="text-slate-600 hover:text-slate-900 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-[#F9FAFB]"></span>
        </button>

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-9 h-9 rounded-full bg-[#042B1F] text-white flex items-center justify-center font-bold text-sm shadow-sm">
            {initial}
          </div>
        </div>
      </div>
      
    </header>
  );
}
