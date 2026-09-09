import React from 'react';
import { Globe2, Lock, Mail, UserCheck, Sparkles } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useUiStore } from '../stores/uiStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardFooter } from '../components/ui/card';
import { SocialAuthButtons } from '../components/common/SocialAuthButtons';

export function LoginPage() {
  const { login, error, clearError, loading } = useAuthStore();
  const { navigate } = useUiStore();

  const [email, setEmail] = React.useState('alex.rivera@example.com');
  const [password, setPassword] = React.useState('password123');

  React.useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('home');
    }
  };

  const handleDemoLogin = async () => {
    setEmail('alex.rivera@example.com');
    setPassword('password123');
    const success = await login('alex.rivera@example.com', 'password123');
    if (success) {
      navigate('home');
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
          Welcome back
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Connect with language exchange partners around the world
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="border border-slate-200/80 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
          {/* Quick Demo Access Bar */}
          <div className="bg-indigo-50/70 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-indigo-900/40 p-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 text-xs">
              <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
              <span className="font-medium">Testing preview mode?</span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDemoLogin}
              className="text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 border-indigo-200 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50"
            >
              One-Click Demo
            </Button>
          </div>

          <div className="pt-6 px-6 sm:px-8">
            <SocialAuthButtons actionLabel="Sign in" />
            <div className="flex items-center gap-3 my-5">
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                or with email
              </span>
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-0 px-6 sm:px-8">
              {error && (
                <div className="rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 p-3.5 text-xs text-rose-700 dark:text-rose-300 font-medium">
                  {error}
                </div>
              )}

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
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => navigate('forgot-password')}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 cursor-pointer"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
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
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </CardContent>

            <CardFooter className="flex flex-col border-t border-slate-100 dark:border-slate-800 pt-4 pb-6">
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                Need an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('register')}
                  className="font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  Create free account
                </button>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
