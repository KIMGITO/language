import React from 'react';
import { useAuthStore } from './stores/authStore';
import { useProfileStore } from './stores/profileStore';
import { useUiStore } from './stores/uiStore';
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { HomePage } from './pages/HomePage';
import { DiscoverPage } from './pages/DiscoverPage';
import { MatchesPage } from './pages/MatchesPage';
import { MessagesPage } from './pages/MessagesPage';
import { ProfilePage } from './pages/ProfilePage';
import { UserProfilePage } from './pages/UserProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { ReportDialog } from './components/safety/ReportDialog';
import { BlockDialog } from './components/safety/BlockDialog';

export default function App() {
  const { user, loading: authLoading, checkSession } = useAuthStore();
  const { currentProfile, loading: profileLoading } = useProfileStore();
  const { currentRoute, navigate } = useUiStore();

  React.useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Handle protected routing guard
  const publicRoutes = ['landing', 'login', 'register', 'forgot-password'];
  const isPublicRoute = publicRoutes.includes(currentRoute);

  // If user is logged in and needs onboarding
  React.useEffect(() => {
    if (user && currentProfile && !currentProfile.onboarding_completed && currentRoute !== 'onboarding') {
      navigate('onboarding');
    }
  }, [user, currentProfile, currentRoute, navigate]);

  // If user is not logged in and tries to access protected page
  React.useEffect(() => {
    if (!authLoading && !user && !isPublicRoute) {
      navigate('landing');
    }
  }, [user, authLoading, isPublicRoute, navigate]);

  // Render current view
  const renderCurrentPage = () => {
    switch (currentRoute) {
      case 'landing':
        return <LandingPage />;
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      case 'forgot-password':
        return <ForgotPasswordPage />;
      case 'onboarding':
        return <OnboardingPage />;
      case 'home':
        return (
          <AppLayout>
            <HomePage />
          </AppLayout>
        );
      case 'discover':
        return (
          <AppLayout>
            <DiscoverPage />
          </AppLayout>
        );
      case 'matches':
        return (
          <AppLayout>
            <MatchesPage />
          </AppLayout>
        );
      case 'messages':
        return (
          <AppLayout>
            <MessagesPage />
          </AppLayout>
        );
      case 'profile':
        return (
          <AppLayout>
            <ProfilePage />
          </AppLayout>
        );
      case 'user-profile':
        return (
          <AppLayout>
            <UserProfilePage />
          </AppLayout>
        );
      case 'settings':
        return (
          <AppLayout>
            <SettingsPage />
          </AppLayout>
        );
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans selection:bg-teal-100 selection:text-teal-900">
      {renderCurrentPage()}
      <ReportDialog />
      <BlockDialog />
    </div>
  );
}
