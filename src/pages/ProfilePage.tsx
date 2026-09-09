import React from 'react';
import {
  MapPin,
  Clock,
  Edit3,
  Heart,
  Sparkles,
  Flame,
  MessageSquare,
  Award,
} from 'lucide-react';
import { useProfileStore } from '../stores/profileStore';
import { Avatar } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ProfileLanguageSection } from '../components/profile/ProfileLanguageSection';
import { EditProfileModal } from '../components/profile/EditProfileModal';

export function ProfilePage() {
  const { currentProfile } = useProfileStore();
  const [editOpen, setEditOpen] = React.useState(false);

  if (!currentProfile) {
    return (
      <div className="p-12 text-center text-slate-500 animate-pulse font-medium">
        Loading your language profile...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-200">
      {/* Profile Banner & Header Card */}
      <Card className="p-0 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm bg-white dark:bg-slate-900">
        {/* Top Decorative Gradient Banner */}
        <div className="h-32 sm:h-40 bg-gradient-to-r from-indigo-600 via-violet-600 to-amber-500 relative p-6 flex items-end justify-end">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setEditOpen(true)}
            className="relative z-10 gap-1.5 text-xs font-medium rounded-xl shadow-lg bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 hover:bg-white border-0"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Edit Profile</span>
          </Button>
        </div>

        {/* Profile Details Header */}
        <div className="px-6 sm:px-8 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12 sm:-mt-14 mb-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
              <div className="p-1 bg-white dark:bg-slate-900 rounded-full shadow-lg">
                <Avatar
                  src={currentProfile.avatar_url}
                  fallback={currentProfile.display_name.charAt(0)}
                  isOnline={true}
                  size="xl"
                />
              </div>
              <div className="sm:pb-1">
                <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
                  <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                    {currentProfile.display_name}
                  </h1>
                  <Badge variant="emerald" className="text-xs">
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-indigo-500" />
                    <span>{currentProfile.country}</span>
                  </div>
                  {currentProfile.timezone && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-indigo-500" />
                      <span>{currentProfile.timezone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mt-2">
            {currentProfile.bio || 'No bio provided.'}
          </p>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600">
                <Flame className="h-4 w-4" />
              </div>
              <div>
                <div className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-none">12 Days</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">Practice Streak</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600">
                <MessageSquare className="h-4 w-4" />
              </div>
              <div>
                <div className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-none">34 Sessions</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">Exchanges Done</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
                <Award className="h-4 w-4" />
              </div>
              <div>
                <div className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-none">Top Helper</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">Badge Earned</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Languages Section */}
      <Card className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm">
        <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-slate-100 mb-5 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-500" />
          <span>Languages & Goals</span>
        </h3>
        <ProfileLanguageSection
          nativeLanguages={currentProfile.native_languages}
          learningLanguages={currentProfile.learning_languages}
          learningGoals={currentProfile.learning_goals}
        />
      </Card>

      {/* Interests & Availability */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Interests */}
        <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-slate-100">
            <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-500">
              <Heart className="h-4 w-4" />
            </div>
            <h3 className="font-heading font-bold text-base">
              Interests & Topics
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {currentProfile.interests?.map((interest, idx) => (
              <Badge key={idx} variant="purple" className="text-xs py-1 px-3">
                {interest}
              </Badge>
            ))}
            {(!currentProfile.interests || currentProfile.interests.length === 0) && (
              <p className="text-xs text-slate-400">No interests specified.</p>
            )}
          </div>
        </Card>

        {/* Availability */}
        <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-slate-100">
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-500">
              <Clock className="h-4 w-4" />
            </div>
            <h3 className="font-heading font-bold text-base">
              Availability & Timezone
            </h3>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {currentProfile.availability || 'Flexible schedule.'}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
            <span>Timezone:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">{currentProfile.timezone || 'Not specified'}</span>
          </p>
        </Card>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        open={editOpen}
        onOpenChange={setEditOpen}
        profile={currentProfile}
      />
    </div>
  );
}
