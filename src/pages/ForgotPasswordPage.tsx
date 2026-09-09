import React from 'react';
import { Globe2, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useUiStore } from '../stores/uiStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardFooter } from '../components/ui/card';

export function ForgotPasswordPage() {
  const { resetPassword, loading } = useAuthStore();
  const { navigate } = useUiStore();

  const [email, setEmail] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await resetPassword(email);
    setSubmitted(true);
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
          Reset your password
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          We'll send you an email with instructions to restore access
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="border border-slate-200/80 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
          {submitted ? (
            <CardContent className="space-y-4 pt-8 pb-8 px-6 text-center">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="font-heading font-bold text-base text-slate-900 dark:text-slate-100">
                Check your inbox
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                If an account exists for <span className="font-semibold text-slate-900 dark:text-slate-100">{email}</span>, we've sent password reset instructions.
              </p>
              <Button
                variant="outline"
                size="md"
                onClick={() => navigate('login')}
                className="w-full mt-4 rounded-xl"
              >
                Back to Sign in
              </Button>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4 pt-8 px-6 sm:px-8">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Email address
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

                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  disabled={loading}
                  className="w-full font-semibold rounded-xl shadow-md hover:shadow-indigo-500/25 transition-all mt-2"
                >
                  {loading ? 'Sending link...' : 'Send reset link'}
                </Button>
              </CardContent>

              <CardFooter className="flex justify-center border-t border-slate-100 dark:border-slate-800 pt-4 pb-6">
                <button
                  type="button"
                  onClick={() => navigate('login')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to Sign in</span>
                </button>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
