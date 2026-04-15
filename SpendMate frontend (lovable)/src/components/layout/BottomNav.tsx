import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, PlusCircle, Target, BookOpen } from 'lucide-react';

const navItems = [
  { path: '/dashboard', icon: Home, label: 'Home' },
  { path: '/add-expense', icon: PlusCircle, label: 'Add' },
  { path: '/goals', icon: Target, label: 'Goals' },
  { path: '/ledger', icon: BookOpen, label: 'Ledger' },
];

export const BottomNav: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border md:hidden">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <NavLink
              key={path}
              to={path}
              className={`nav-item flex-1 ${isActive ? 'active' : ''}`}
            >
              <div className={`p-2 rounded-xl transition-all duration-200 ${
                isActive ? 'gradient-primary text-primary-foreground' : 'text-muted-foreground'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-medium ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}>
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
