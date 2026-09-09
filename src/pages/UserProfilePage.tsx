import React from 'react';
import {
  ArrowLeft,
  MapPin,
  Clock,
  MessageSquare,
  Heart,
  Sparkles,
  ShieldAlert,
  UserX,
} from 'lucide-react';
import { useUiStore } from '../stores/uiStore';
import { useProfileStore } from '../stores/profileStore';
import { useChatStore } from '../stores/chatStore';
import { useSafetyStore } from '../stores/safetyStore';
import { Avatar } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ProfileLanguageSection } from '../components/profile/ProfileLanguageSection';

export function UserProfilePage() {
  const { currentRouteParams, navigate } = useUiStore();
  const { getPartnerProfile } = useProfileStore();
  const { startConversationWithUser } = useChatStore();
  const { openReportDialog, openBlockDialog } = useSafetyStore();

  const userId = currentRouteParams.userId;
  const partner = userId ? getPartnerProfile(userId) : undefined;

  if (!partner) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Partner profile not found</h2>
        <p className="text-sm text-slate-500 mt-1 mb-6">This partner profile may no longer be available.</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('discover')}
          className="rounded-xl"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Discovery
        </Button>
      </div>
    );
  }

  const handleStartChat = async () => {
    const convo = await startConversationWithUser(partner);
    if (convo) {
      navigate('messages', { conversationId: convo.id });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-200">
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate('discover')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Partners</span>
      </button>

      {/* Main Profile Card with Cover Banner */}
      <Card className="p-0 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm bg-white dark:bg-slate-900">
        {/* Cover Banner */}
        <div className="h-32 sm:h-40 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 relative" />

        {/* User Info Header */}
        <div className="px-6 sm:px-8 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12 sm:-mt-14 mb-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
              <div className="p-1 bg-white dark:bg-slate-900 rounded-full shadow-lg">
                <Avatar
                  src={partner.avatar_url}
                  fallback={partner.display_name.charAt(0)}
                  isOnline={partner.is_online}
                  size="xl"
                />
              </div>
              <div className="sm:pb-1">
                <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
                  <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                    {partner.display_name}
                  </h1>
                  {partner.is_online && (
                    <Badge variant="emerald" className="text-xs">
                      Online Now
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-indigo-500" />
                    <span>{partner.country}</span>
                  </div>
                  {partner.timezone && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-indigo-500" />
                      <span>{partner.timezone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center sm:items-end gap-2.5">
              <Button
                variant="gradient"
                size="lg"
                onClick={handleStartChat}
                className="gap-2 shadow-md hover:shadow-indigo-500/25 transition-all w-full sm:w-auto"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Start Conversation</span>
              </Button>
            </div>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mt-3">
            {partner.bio || 'Language learner ready for practice.'}
          </p>

          <div className="flex items-center justify-between pt-4 mt-6 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-slate-400">Verified Exchange Partner</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => openReportDialog(partner)}
                className="inline-flex items-center gap-1 text-slate-400 hover:text-amber-600 font-medium cursor-pointer transition-colors"
              >
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>Report</span>
              </button>
              <span className="text-slate-200 dark:text-slate-700">•</span>
              <button
                type="button"
                onClick={() => openBlockDialog(partner)}
                className="inline-flex items-center gap-1 text-slate-400 hover:text-rose-600 font-medium cursor-pointer transition-colors"
              >
                <UserX className="h-3.5 w-3.5" />
                <span>Block</span>
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Languages Section */}
      <Card className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm">
        <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-slate-100 mb-5 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-500" />
          <span>Language Exchange Profile</span>
        </h3>
        <ProfileLanguageSection
          nativeLanguages={partner.native_languages}
          learningLanguages={partner.learning_languages}
          learningGoals={partner.learning_goals}
        />
      </Card>

      {/* Interests & Schedule */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-slate-100">
            <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-500">
              <Heart className="h-4 w-4" />
            </div>
            <h3 className="font-heading font-bold text-base">
              Shared Interests
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {partner.interests?.map((interest, idx) => (
              <Badge key={idx} variant="purple" className="text-xs py-1 px-3">
                {interest}
              </Badge>
            ))}
          </div>
        </Card>

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
            {partner.availability || 'Flexible exchange schedule.'}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Timezone: <span className="font-semibold text-slate-700 dark:text-slate-300">{partner.timezone}</span>
          </p>
        </Card>
      </div>
    </div>
  );
}
