import React from 'react';
import { useAuthStore } from './stores/authStore';
import { useProfileStore } from './stores/profileStore';
import { useUiStore } from './stores/uiStore';
import { AppLayout } from './components/layout/AppLayout';
import { LoadingState } from './components/common/LoadingState';
import { ReportDialog } from './components/safety/ReportDialog';
import { BlockDialog } from './components/safety/BlockDialog';

// Pages — lazy-loaded so each route ships its own chunk instead of one
// monolithic bundle. Named exports need a small `.then()` remap since
// React.lazy only accepts a default export.
const LandingPage = React.lazy(() =>
  import('./pages/LandingPage').then((m) => ({ default: m.LandingPage }))
);
const LoginPage = React.lazy(() =>
  import('./pages/LoginPage').then((m) => ({ default: m.LoginPage }))
);
const RegisterPage = React.lazy(() =>
  import('./pages/RegisterPage').then((m) => ({ default: m.RegisterPage }))
);
const ForgotPasswordPage = React.lazy(() =>
  import('./pages/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage }))
);
const OnboardingPage = React.lazy(() =>
  import('./pages/OnboardingPage').then((m) => ({ default: m.OnboardingPage }))
);
const HomePage = React.lazy(() =>
  import('./pages/HomePage').then((m) => ({ default: m.HomePage }))
);
const DiscoverPage = React.lazy(() =>
  import('./pages/DiscoverPage').then((m) => ({ default: m.DiscoverPage }))
);
const MatchesPage = React.lazy(() =>
  import('./pages/MatchesPage').then((m) => ({ default: m.MatchesPage }))
);
const MessagesPage = React.lazy(() =>
  import('./pages/MessagesPage').then((m) => ({ default: m.MessagesPage }))
);
const ProfilePage = React.lazy(() =>
  import('./pages/ProfilePage').then((m) => ({ default: m.ProfilePage }))
);
const UserProfilePage = React.lazy(() =>
  import('./pages/UserProfilePage').then((m) => ({ default: m.UserProfilePage }))
);
const SettingsPage = React.lazy(() =>
  import('./pages/SettingsPage').then((m) => ({ default: m.SettingsPage }))
);

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
      <React.Suspense fallback={<LoadingState message="Loading..." className="min-h-screen" />}>
        {renderCurrentPage()}
      </React.Suspense>
      <ReportDialog />
      <BlockDialog />
    </div>
  );
}
