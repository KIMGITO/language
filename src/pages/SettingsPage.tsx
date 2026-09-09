import React from 'react';
import {
  Bell,
  Shield,
  User,
  LogOut,
  Ban,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useProfileStore } from '../stores/profileStore';
import { useSafetyStore } from '../stores/safetyStore';
import { useUiStore } from '../stores/uiStore';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';

export function SettingsPage() {
  const { user, logout } = useAuthStore();
  const { currentProfile, updateCurrentProfile } = useProfileStore();
  const { blockedUsers, unblockUser } = useSafetyStore();
  const { navigate } = useUiStore();

  const [activeTab, setActiveTab] = React.useState('account');
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [inAppSound, setInAppSound] = React.useState(true);
  const [savedSuccess, setSavedSuccess] = React.useState(false);

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
          <Sliders className="h-7 w-7 text-indigo-500" />
          <span>Account Settings</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your account credentials, preferences, and privacy parameters.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 bg-slate-200/60 dark:bg-slate-800/60 p-1.5 rounded-2xl">
          <TabsTrigger value="account" className="gap-1.5 rounded-xl text-xs font-semibold">
            <User className="h-3.5 w-3.5" />
            <span>Account</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5 rounded-xl text-xs font-semibold">
            <Bell className="h-3.5 w-3.5" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="gap-1.5 rounded-xl text-xs font-semibold">
            <Shield className="h-3.5 w-3.5" />
            <span>Privacy & Safety</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Account */}
        <TabsContent value="account">
          <Card className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm">
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-slate-100 mb-4">
              Credentials & Profile Info
            </h3>

            {savedSuccess && (
              <div className="mb-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3.5 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Account settings successfully saved.</span>
              </div>
            )}

            <form onSubmit={handleSaveAccount} className="space-y-4 max-w-md">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address
                </label>
                <Input value={user?.email || 'alex.rivera@example.com'} disabled className="rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Display Name
                </label>
                <Input
                  value={currentProfile?.display_name || ''}
                  onChange={(e) =>
                    currentProfile &&
                    updateCurrentProfile({ display_name: e.target.value })
                  }
                  className="rounded-xl"
                />
              </div>

              <div className="pt-2">
                <Button type="submit" variant="gradient" size="md" className="rounded-xl shadow-md">
                  Save Changes
                </Button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
              <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-slate-100 mb-2">
                Active Session
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Sign out of your active language exchange session on this device.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await logout();
                  navigate('landing');
                }}
                className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 gap-1.5 rounded-xl font-semibold"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Tab 2: Notifications */}
        <TabsContent value="notifications">
          <Card className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-slate-100 mb-2">
              Notification Preferences
            </h3>

            <div className="flex items-center justify-between py-3.5 border-b border-slate-100 dark:border-slate-800">
              <div>
                <p className="font-heading font-bold text-sm text-slate-900 dark:text-slate-100">
                  New Message Alerts
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Receive notifications when an exchange partner sends you a message.
                </p>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="h-5 w-5 accent-indigo-600 rounded-md cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-3.5">
              <div>
                <p className="font-heading font-bold text-sm text-slate-900 dark:text-slate-100">
                  Weekly Recommendation Digests
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Get suggestions for compatible native speakers & practice partners.
                </p>
              </div>
              <input
                type="checkbox"
                checked={inAppSound}
                onChange={(e) => setInAppSound(e.target.checked)}
                className="h-5 w-5 accent-indigo-600 rounded-md cursor-pointer"
              />
            </div>
          </Card>
        </TabsContent>

        {/* Tab 3: Privacy & Safety */}
        <TabsContent value="privacy">
          <Card className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm space-y-6">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900 dark:text-slate-100 mb-1">
                Blocked Exchange Partners
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Blocked users cannot send you messages or view your online status.
              </p>
            </div>

            <div className="space-y-3">
              {blockedUsers.length > 0 ? (
                blockedUsers.map((blocked) => (
                  <div
                    key={blocked.blocked_user_id}
                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-500">
                        <Ban className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {blocked.blocked_name}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => unblockUser(blocked.blocked_user_id)}
                      className="text-xs rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-700"
                    >
                      Unblock
                    </Button>
                  </div>
                ))
              ) : (
                <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
                  No blocked users on your account.
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
