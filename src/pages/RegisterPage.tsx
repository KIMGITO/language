import React from 'react';
import { Globe2, Lock, Mail, User, Sparkles } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useUiStore } from '../stores/uiStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardFooter } from '../components/ui/card';

export function RegisterPage() {
  const { register, error, clearError, loading } = useAuthStore();
  const { navigate } = useUiStore();

  const [displayName, setDisplayName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [clientError, setClientError] = React.useState('');

  React.useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClientError('');

    if (password !== confirmPassword) {
      setClientError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setClientError('Password must be at least 6 characters');
      return;
    }

    const success = await register(email, password, displayName);
    if (success) {
      navigate('onboarding');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <div
          onClick={() => navigate('landing')}
          className="inline-flex items-center gap-2.5 cursor-pointer mb-3 group"
        >
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Globe2 className="h-6 w-6" />
          </div>
          <span className="font-heading font-extrabold text-2xl bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent tracking-tight">
            LinguaConnect
          </span>
        </div>
        <h2 className="font-heading text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Create free account
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Start practicing languages with native speakers today
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="border border-slate-200/80 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-8 px-6 sm:px-8">
              {(error || clientError) && (
                <div className="rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 p-3.5 text-xs text-rose-700 dark:text-rose-300 font-medium">
                  {clientError || error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Display Name
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    placeholder="e.g. Alex Rivera"
                    className="pl-10 text-xs rounded-xl"
                  />
                  <User className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="pl-10 text-xs rounded-xl"
                  />
                  <Mail className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="At least 6 characters"
                    className="pl-10 text-xs rounded-xl"
                  />
                  <Lock className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Re-enter password"
                    className="pl-10 text-xs rounded-xl"
                  />
                  <Lock className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                </div>
              </div>

              <Button
                type="submit"
                variant="gradient"
                size="lg"
                disabled={loading}
                className="w-full font-semibold rounded-xl shadow-md hover:shadow-indigo-500/25 transition-all mt-2"
              >
                {loading ? 'Creating Account...' : 'Get Started'}
              </Button>
            </CardContent>

            <CardFooter className="flex flex-col border-t border-slate-100 dark:border-slate-800 pt-4 pb-6">
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('login')}
                  className="font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
