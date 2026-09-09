import React from 'react';
import { ArrowLeftRight, HeartHandshake, UserCheck, Users, Globe2, Sparkles } from 'lucide-react';
import { useMatchingStore } from '../stores/matchingStore';
import { useChatStore } from '../stores/chatStore';
import { useUiStore } from '../stores/uiStore';
import { Profile } from '../types';
import { PartnerCard } from '../components/matching/PartnerCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { EmptyState } from '../components/common/EmptyState';

export function MatchesPage() {
  const { matches, loadMatches } = useMatchingStore();
  const { conversations, loadConversations, startConversationWithUser } = useChatStore();
  const { navigate } = useUiStore();

  const [activeTab, setActiveTab] = React.useState('all');

  React.useEffect(() => {
    loadMatches();
    loadConversations();
  }, [loadMatches, loadConversations]);

  const handleStartChatWithPartner = async (partner: Profile) => {
    const convo = await startConversationWithUser(partner);
    if (convo) {
      navigate('messages', { conversationId: convo.id });
    }
  };

  const connectedPartnerIds = new Set(
    conversations.flatMap((c) => c.members.map((m) => m.id))
  );

  const reciprocalMatches = matches.filter((m) => m.match_type === 'mutual_exchange');
  const fluentMatches = matches.filter((m) => m.match_type === 'fluent_partner');
  const canHelpMatches = matches.filter((m) => m.match_type === 'can_help');
  const connectedMatches = matches.filter((m) => connectedPartnerIds.has(m.partner.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200/80">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-semibold mb-2">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>Matches & Connections Overview</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
          Your Language Matches
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Organized by mutual exchange, practice partner availability, or learners seeking help.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 flex-wrap h-auto gap-1.5 p-1.5 bg-slate-100/80 border border-slate-200/60 rounded-2xl shadow-xs">
          <TabsTrigger value="all" className="gap-1.5 text-xs sm:text-sm py-2 px-4 rounded-xl font-semibold">
            <Globe2 className="h-4 w-4 text-indigo-600" />
            <span>All Matches ({matches.length})</span>
          </TabsTrigger>
          <TabsTrigger value="reciprocal" className="gap-1.5 text-xs sm:text-sm py-2 px-4 rounded-xl font-semibold">
            <ArrowLeftRight className="h-4 w-4 text-amber-500" />
            <span>Reciprocal ({reciprocalMatches.length})</span>
          </TabsTrigger>
          <TabsTrigger value="fluent" className="gap-1.5 text-xs sm:text-sm py-2 px-4 rounded-xl font-semibold">
            <UserCheck className="h-4 w-4 text-indigo-600" />
            <span>Practice Partners ({fluentMatches.length})</span>
          </TabsTrigger>
          <TabsTrigger value="helping" className="gap-1.5 text-xs sm:text-sm py-2 px-4 rounded-xl font-semibold">
            <HeartHandshake className="h-4 w-4 text-amber-500" />
            <span>Learners to Help ({canHelpMatches.length})</span>
          </TabsTrigger>
          <TabsTrigger value="connected" className="gap-1.5 text-xs sm:text-sm py-2 px-4 rounded-xl font-semibold">
            <Users className="h-4 w-4 text-slate-400" />
            <span>Connected ({connectedMatches.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab: All */}
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => (
              <PartnerCard
                key={match.id}
                partner={match.partner}
                match={match}
                connected={connectedPartnerIds.has(match.partner.id)}
                onViewProfile={(id) => navigate('user-profile', { userId: id })}
                onStartChat={handleStartChatWithPartner}
              />
            ))}
          </div>
        </TabsContent>

        {/* Tab: Reciprocal Exchanges */}
        <TabsContent value="reciprocal">
          {reciprocalMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reciprocalMatches.map((match) => (
                <PartnerCard
                  key={match.id}
                  partner={match.partner}
                  match={match}
                  connected={connectedPartnerIds.has(match.partner.id)}
                  onViewProfile={(id) => navigate('user-profile', { userId: id })}
                  onStartChat={handleStartChatWithPartner}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={ArrowLeftRight}
              title="No reciprocal matches yet"
              description="Partners who speak your target language and want to learn your native language will appear here."
            />
          )}
        </TabsContent>

        {/* Tab: Fluent Practice Partners */}
        <TabsContent value="fluent">
          {fluentMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fluentMatches.map((match) => (
                <PartnerCard
                  key={match.id}
                  partner={match.partner}
                  match={match}
                  connected={connectedPartnerIds.has(match.partner.id)}
                  onViewProfile={(id) => navigate('user-profile', { userId: id })}
                  onStartChat={handleStartChatWithPartner}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={UserCheck}
              title="No practice partners"
              description="Native speakers ready to assist your learning will appear here."
            />
          )}
        </TabsContent>

        {/* Tab: People You Can Help */}
        <TabsContent value="helping">
          {canHelpMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {canHelpMatches.map((match) => (
                <PartnerCard
                  key={match.id}
                  partner={match.partner}
                  match={match}
                  connected={connectedPartnerIds.has(match.partner.id)}
                  onViewProfile={(id) => navigate('user-profile', { userId: id })}
                  onStartChat={handleStartChatWithPartner}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={HeartHandshake}
              title="No learners seeking help"
              description="Users learning your native language will appear here."
            />
          )}
        </TabsContent>

        {/* Tab: Connected Partners */}
        <TabsContent value="connected">
          {connectedMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {connectedMatches.map((match) => (
                <PartnerCard
                  key={match.id}
                  partner={match.partner}
                  match={match}
                  connected={true}
                  onViewProfile={(id) => navigate('user-profile', { userId: id })}
                  onStartChat={handleStartChatWithPartner}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Users}
              title="No active chat connections"
              description="Start a conversation from Discover to build your practice network."
              actionLabel="Discover partners"
              onAction={() => navigate('discover')}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

