import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <CheckSquare className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                TaskFlow
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200/60 rounded-full uppercase">
                MERN
              </span>
            </div>
          </div>

          {/* User profile & Logout */}
          <div className="flex items-center gap-3 sm:gap-4">
            {user && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/80">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-sm">
                  {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                </div>
                <div className="hidden sm:block text-left text-xs">
                  <p className="font-semibold text-slate-800 leading-tight">{user.name}</p>
                  <p className="text-slate-500 leading-tight truncate max-w-[140px]">{user.email}</p>
                </div>
              </div>
            )}

            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 border border-rose-200/60 rounded-lg transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
