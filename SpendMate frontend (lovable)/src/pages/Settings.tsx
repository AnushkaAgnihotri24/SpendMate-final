import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  ArrowLeft, 
  Moon, 
  Sun, 
  User, 
  Bell, 
  Shield, 
  HelpCircle,
  LogOut,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { data } = useOnboarding();

  const settingsGroups = [
    {
      title: 'Preferences',
      items: [
        {
          icon: theme === 'light' ? Moon : Sun,
          label: 'Dark Mode',
          description: 'Toggle dark/light theme',
          action: 'toggle',
          value: theme === 'dark',
          onToggle: toggleTheme,
        },
        {
          icon: Bell,
          label: 'Notifications',
          description: 'Manage notification preferences',
          action: 'navigate',
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          icon: User,
          label: 'Profile',
          description: 'Edit your profile information',
          action: 'navigate',
        },
        {
          icon: Shield,
          label: 'Privacy & Security',
          description: 'Manage your data and security',
          action: 'navigate',
        },
        {
          icon: RefreshCw,
          label: 'Reset Onboarding',
          description: 'Start fresh with new settings',
          action: 'button',
          onClick: () => {
            const userStr = localStorage.getItem('currentUser');
            let prefix = '';
            if (userStr) {
               try { const user = JSON.parse(userStr); prefix = `${user.id}_`; } catch(e){}
            }
            localStorage.removeItem(`${prefix}onboardingData`);
            localStorage.removeItem(`${prefix}onboardingStep`);
            localStorage.removeItem(`${prefix}onboardingCompleted`);
            window.location.href = '/onboarding';
          },
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: HelpCircle,
          label: 'Help & FAQ',
          description: 'Get help and answers',
          action: 'navigate',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border px-4 py-3">
        <div className="flex items-center gap-4 max-w-2xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-display font-bold text-foreground">Settings</h1>
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto pb-24">
        {/* Profile Card */}
        <div className="card-elevated p-5 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-3xl">
              {data.avatar || '😊'}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-foreground">
                {data.profileName || 'Student'}
              </h2>
              <p className="text-sm text-muted-foreground capitalize">
                {data.studentType?.replace('-', ' ') || 'Student'}
              </p>
            </div>
            <button className="p-2 rounded-xl bg-muted hover:bg-secondary transition-colors">
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Budget Summary */}
        <div className="card-elevated p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Monthly Budget</p>
              <p className="text-xl font-display font-bold text-foreground">
                ₹{(data.monthlyBudget || 0).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Daily Limit</p>
              <p className="text-xl font-display font-bold text-primary">
                ₹{(data.recommendedLimits?.daily || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Settings Groups */}
        {settingsGroups.map((group) => (
          <div key={group.title} className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2 px-1">
              {group.title}
            </h3>
            <div className="card-elevated overflow-hidden">
              {group.items.map((item, index) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-4 p-4 ${
                    index !== group.items.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  {item.action === 'toggle' && (
                    <Switch
                      checked={item.value}
                      onCheckedChange={item.onToggle}
                    />
                  )}
                  {item.action === 'navigate' && (
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  )}
                  {item.action === 'button' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={item.onClick}
                    >
                      Reset
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Logout */}
        <button 
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('currentUser');
            window.location.href = '/auth';
          }}
          className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Log Out</span>
        </button>

        {/* Version */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          SpendMate v1.0.0
        </p>
      </div>
    </div>
  );
};

export default Settings;
