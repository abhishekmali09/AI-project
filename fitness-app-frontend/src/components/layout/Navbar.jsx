import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from 'react-oauth2-code-pkce';
import {
  FiHome, FiActivity, FiBarChart2, FiCpu, FiUser,
  FiLogOut, FiMenu, FiX, FiZap
} from 'react-icons/fi';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: FiHome },
  { path: '/activities', label: 'Activities', icon: FiActivity },
  { path: '/statistics', label: 'Statistics', icon: FiBarChart2 },
  { path: '/ai-suggestions', label: 'AI Coach', icon: FiCpu },
  { path: '/profile', label: 'Profile', icon: FiUser },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logOut, tokenData } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut();
    navigate('/');
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-20 xl:w-64 flex-col glass border-r border-white/5 z-50">
        {/* Logo */}
        <div className="flex items-center gap-3 p-5 xl:px-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
            <FiZap className="w-5 h-5 text-white" />
          </div>
          <span className="hidden xl:block text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            FitPulse
          </span>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 flex flex-col gap-1 px-3 mt-6">
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                ${isActive
                  ? 'bg-primary/15 text-primary border border-primary/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="hidden xl:block text-sm font-medium">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User & Logout */}
        <div className="p-3 border-t border-white/5">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold shrink-0">
              {tokenData?.preferred_username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="hidden xl:block flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {tokenData?.preferred_username || 'User'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:text-accent hover:bg-accent/10 transition-all duration-300 cursor-pointer"
          >
            <FiLogOut className="w-5 h-5 shrink-0" />
            <span className="hidden xl:block text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 glass border-b border-white/5 z-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <FiZap className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            FitPulse
          </span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white p-2 cursor-pointer">
          {mobileOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-72 glass border-r border-white/5 z-50 flex flex-col lg:hidden"
            >
              <div className="flex items-center gap-3 p-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <FiZap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  FitPulse
                </span>
              </div>
              <nav className="flex-1 flex flex-col gap-1 px-3 mt-4">
                {navItems.map(({ path, label, icon: Icon }) => (
                  <NavLink
                    key={path}
                    to={path}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                      ${isActive ? 'bg-primary/15 text-primary border border-primary/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`
                    }
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{label}</span>
                  </NavLink>
                ))}
              </nav>
              <div className="p-3 border-t border-white/5">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:text-accent hover:bg-accent/10 transition-all cursor-pointer"
                >
                  <FiLogOut className="w-5 h-5" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
