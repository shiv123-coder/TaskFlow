import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white">
              <CheckSquare className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-lg tracking-tight text-slate-900">
                TaskFlow
              </span>
              <span className="hidden sm:inline-block text-xs font-normal text-slate-500">
                Workspace
              </span>
            </div>
          </div>

          {/* User profile & Logout */}
          <div className="flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="w-7 h-7 rounded-md bg-slate-200 text-slate-700 flex items-center justify-center font-medium text-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
                </div>
                <div className="hidden sm:block text-left text-xs">
                  <p className="font-medium text-slate-900 leading-tight">{user.name}</p>
                  <p className="text-slate-500 leading-tight truncate max-w-[150px]">{user.email}</p>
                </div>
              </div>
            )}

            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
