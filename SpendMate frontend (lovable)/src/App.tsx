import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { OnboardingProvider, useOnboarding } from "@/contexts/OnboardingContext";

// Layouts
import { AppLayout } from "@/components/layout/AppLayout";
import { OnboardingLayout } from "@/components/layout/OnboardingLayout";

// Onboarding Pages
import Welcome from "@/pages/onboarding/Welcome";
import Profile from "@/pages/onboarding/Profile";
import StudentType from "@/pages/onboarding/StudentType";
import Budget from "@/pages/onboarding/Budget";
import FixedExpenses from "@/pages/onboarding/FixedExpenses";
import SpendingBehavior from "@/pages/onboarding/SpendingBehavior";
import Recommended from "@/pages/onboarding/Recommended";
import Success from "@/pages/onboarding/Success";

// App Pages
import Dashboard from "@/pages/Dashboard";
import AddExpense from "@/pages/AddExpense";
import SharedSplit from "@/pages/SharedSplit";
import Ledger from "@/pages/Ledger";
import Goals from "@/pages/Goals";
import Subscriptions from "@/pages/Subscriptions";
import MonthlyReview from "@/pages/MonthlyReview";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isCompleted } = useOnboarding();
  
  if (!isCompleted) {
    return <Navigate to="/onboarding" replace />;
  }
  
  return <>{children}</>;
};

// Onboarding redirect
const OnboardingRedirect: React.FC = () => {
  const { isCompleted, currentStep } = useOnboarding();
  
  if (isCompleted) {
    return <Navigate to="/dashboard" replace />;
  }
  
  const routes: Record<number, string> = {
    1: '/onboarding',
    2: '/onboarding/profile',
    3: '/onboarding/student-type',
    4: '/onboarding/budget',
    5: '/onboarding/fixed-expenses',
    6: '/onboarding/spending-behavior',
    7: '/onboarding/recommended',
    8: '/onboarding/success',
  };
  
  return <Navigate to={routes[currentStep] || '/onboarding'} replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<OnboardingRedirect />} />
      
      {/* Onboarding Flow */}
      <Route path="/onboarding" element={<OnboardingLayout />}>
        <Route index element={<Welcome />} />
        <Route path="profile" element={<Profile />} />
        <Route path="student-type" element={<StudentType />} />
        <Route path="budget" element={<Budget />} />
        <Route path="fixed-expenses" element={<FixedExpenses />} />
        <Route path="spending-behavior" element={<SpendingBehavior />} />
        <Route path="recommended" element={<Recommended />} />
        <Route path="success" element={<Success />} />
      </Route>
      
      {/* Main App */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/ledger" element={<Ledger />} />
      </Route>
      
      {/* Full-screen pages */}
      <Route
        path="/add-expense"
        element={
          <ProtectedRoute>
            <AddExpense />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shared-split"
        element={
          <ProtectedRoute>
            <SharedSplit />
          </ProtectedRoute>
        }
      />
      <Route
        path="/subscriptions"
        element={
          <ProtectedRoute>
            <Subscriptions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/monthly-review"
        element={
          <ProtectedRoute>
            <MonthlyReview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      
      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <OnboardingProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </OnboardingProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
