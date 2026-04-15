import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  PlusCircle, 
  Target, 
  BookOpen, 
  Users, 
  CreditCard, 
  BarChart3,
  Settings,
  Moon,
  Sun
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const navItems = [
  { path: '/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/add-expense', icon: PlusCircle, label: 'Add Expense' },
  { path: '/shared-split', icon: Users, label: 'Shared Split' },
  { path: '/goals', icon: Target, label: 'Savings Goals' },
  { path: '/ledger', icon: BookOpen, label: 'Ledger' },
  { path: '/subscriptions', icon: CreditCard, label: 'Subscriptions' },
  { path: '/monthly-review', icon: BarChart3, label: 'Monthly Review' },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-card border-r border-border fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-xl font-display font-bold text-gradient">
          SpendMate
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <NavLink
              key={path}
              to={path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'gradient-primary text-primary-foreground shadow-glow' 
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-2">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-foreground hover:bg-muted transition-all duration-200"
        >
          {theme === 'light' ? (
            <>
              <Moon className="w-5 h-5" />
              <span className="font-medium">Dark Mode</span>
            </>
          ) : (
            <>
              <Sun className="w-5 h-5" />
              <span className="font-medium">Light Mode</span>
            </>
          )}
        </button>
        <NavLink
          to="/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-muted transition-all duration-200"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </NavLink>
      </div>
    </aside>
  );
};
