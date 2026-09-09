import React from 'react';
import {
  Compass,
  MessageSquare,
  ArrowRight,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { useProfileStore } from '../stores/profileStore';
import { useMatchingStore } from '../stores/matchingStore';
import { useChatStore } from '../stores/chatStore';
import { useUiStore } from '../stores/uiStore';
import { CONVERSATION_TOPICS } from '../data/mockData';
import { Profile } from '../types';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Avatar } from '../components/ui/avatar';
import { PartnerCard } from '../components/matching/PartnerCard';
import { LearningGoalCard } from '../components/common/LearningGoalCard';
import { UnreadBadge } from '../components/common/UnreadBadge';

export function HomePage() {
  const { currentProfile } = useProfileStore();
  const { matches, loadMatches } = useMatchingStore();
  const { conversations, loadConversations, startConversationWithUser } = useChatStore();
  const { navigate } = useUiStore();

  React.useEffect(() => {
    loadMatches();
    loadConversations();
  }, [loadMatches, loadConversations]);

  const targetLang = currentProfile?.learning_languages[0];
  const dailyTopic = CONVERSATION_TOPICS[0];

  const handleStartChatWithPartner = async (partner: Profile) => {
    const convo = await startConversationWithUser(partner);
    if (convo) {
      navigate('messages', { conversationId: convo.id });
    }
  };

  const handleUseDailyTopic = async () => {
    if (conversations.length > 0) {
      navigate('messages', { conversationId: conversations[0].id });
    } else {
      navigate('discover');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
         
          <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Welcome back, {currentProfile?.display_name?.split(' ')[0] || 'Learner'} 
          </h1>
          <p className="text-sm text-slate-500 mt-1.5">
            Connect with native speakers, discover topics, and boost your language fluency.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="gradient"
            size="md"
            onClick={() => navigate('discover')}
            className="gap-2 shadow-sm rounded-xl"
          >
            <Compass className="h-4 w-4" />
            <span>Discover Partners</span>
          </Button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Learning Goal & Recommended Partners */}
        <div className="lg:col-span-2 space-y-8">
          {/* Target Language Card */}
          {targetLang && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-heading font-bold text-base text-slate-900">
                  Active Practice Focus
                </h2>
                <button
                  type="button"
                  onClick={() => navigate('profile')}
                  className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
                >
                  Edit goals & levels
                </button>
              </div>

              <LearningGoalCard
                language={targetLang.language.name}
                proficiency={targetLang.proficiency}
                goal={currentProfile?.learning_goals || 'Conversational practice & vocabulary'}
                flag={targetLang.language.flag}
                onPracticeClick={() => navigate('discover')}
              />
            </div>
          )}

          {/* Top Suggested Matches */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-heading font-bold text-lg text-slate-900">
                  Recommended Language Partners
                </h2>
                <p className="text-xs text-slate-500">Handpicked based on your native & target languages</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('discover')}
                className="text-indigo-600 font-semibold gap-1 text-xs hover:bg-indigo-50 rounded-xl"
              >
                <span>View all partners</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {matches.slice(0, 2).map((match) => (
                <PartnerCard
                  key={match.id}
                  partner={match.partner}
                  match={match}
                  onViewProfile={(id) => navigate('user-profile', { userId: id })}
                  onStartChat={handleStartChatWithPartner}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Active Conversations & Daily Topic */}
        <div className="space-y-6">
          {/* Topic of the Day */}
          <Card className="p-5 border-amber-200/80 bg-gradient-to-br from-amber-50/60 via-white to-amber-50/30 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-amber-600">
              <BookOpen className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Conversation Prompt of the Day
              </span>
            </div>
            <h3 className="font-heading font-bold text-slate-900 text-base mb-1.5">
              {dailyTopic.title}
            </h3>
            <p className="text-xs text-slate-600 mb-4 italic leading-relaxed bg-white/80 p-3 rounded-xl border border-amber-100">
              "{dailyTopic.prompt}"
            </p>
            <Button
              variant="gold"
              size="sm"
              onClick={handleUseDailyTopic}
              className="w-full font-semibold text-xs gap-1.5 rounded-xl shadow-xs"
            >
              <span>Use in conversation</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Card>

          {/* Active Conversations */}
          <Card className="p-5 border-slate-200/80 bg-white rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-slate-900 text-sm flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-indigo-600" />
                <span>Recent Conversations</span>
              </h3>
              <button
                type="button"
                onClick={() => navigate('messages')}
                className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
              >
                All chats
              </button>
            </div>

            <div className="space-y-2">
              {conversations.slice(0, 4).map((convo) => {
                const partner =
                  convo.members.find((m) => m.id !== currentProfile?.id) || convo.members[0];
                return (
                  <div
                    key={convo.id}
                    onClick={() => navigate('messages', { conversationId: convo.id })}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all cursor-pointer group border border-slate-100 hover:border-slate-200 shadow-2xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar
                        src={partner?.avatar_url}
                        fallback={partner?.display_name.charAt(0)}
                        isOnline={partner?.is_online}
                        size="sm"
                      />
                      <div className="min-w-0">
                        <p className="font-heading font-bold text-xs text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                          {partner?.display_name}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {convo.last_message ? convo.last_message.content : 'Active conversation'}
                        </p>
                      </div>
                    </div>

                    {convo.unread_count > 0 && (
                      <UnreadBadge count={convo.unread_count} />
                    )}
                  </div>
                );
              })}

              {conversations.length === 0 && (
                <p className="text-center py-6 text-xs text-slate-400 font-medium">
                  No active chats yet. Connect with a partner to start practicing!
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

