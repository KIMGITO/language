import React from 'react';
import { FilterX, Sparkles } from 'lucide-react';
import { useMatchingStore } from '../stores/matchingStore';
import { useChatStore } from '../stores/chatStore';
import { useUiStore } from '../stores/uiStore';
import { useProfileStore } from '../stores/profileStore';
import { Profile } from '../types';
import { PartnerCard } from '../components/matching/PartnerCard';
import { MatchFilterBar } from '../components/matching/MatchFilterBar';
import { EmptyState } from '../components/common/EmptyState';
import { Badge } from '../components/ui/badge';

export function DiscoverPage() {
  const {
    filteredMatches,
    filters,
    setFilter,
    resetFilters,
    loadMatches,
  } = useMatchingStore();
  const { startConversationWithUser } = useChatStore();
  const { currentProfile } = useProfileStore();
  const { navigate } = useUiStore();

  const activeLanguage = filters.practiceLanguage || currentProfile?.learning_languages[0]?.language.name || 'English';

  React.useEffect(() => {
    if (!filters.practiceLanguage && currentProfile?.learning_languages[0]?.language.name) {
      setFilter('practiceLanguage', currentProfile.learning_languages[0].language.name);
    }
    loadMatches();
  }, [loadMatches, currentProfile]);

  const handleSelectLanguage = (langName: string) => {
    setFilter('practiceLanguage', langName);
  };

  const handleStartChatWithPartner = async (partner: Profile) => {
    const convo = await startConversationWithUser(partner);
    if (convo) {
      navigate('messages', { conversationId: convo.id });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-semibold mb-2">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>50/50 Language Compatibility Engine</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Discover Language Partners
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Filter partners by target language, proficiency level, location, and practice schedule.
          </p>
        </div>

        <Badge variant="gradient" className="self-start sm:self-auto text-xs px-3 py-1.5 font-bold shadow-xs">
          {filteredMatches.length} Partners Online
        </Badge>
      </div>

      {/* Primary Language Filter & Search Bar */}
      <MatchFilterBar
        filters={filters}
        onFilterChange={setFilter}
        onReset={resetFilters}
        selectedLanguage={activeLanguage}
        onSelectLanguage={handleSelectLanguage}
      />

      {/* Section Header */}
      <div className="flex items-center justify-between pt-2 mb-4">
        <div className="flex items-center gap-2">
          <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-900">
            {activeLanguage} Native Partners
          </h2>
          <Badge variant="blue" className="text-xs">
            Reciprocal Match
          </Badge>
        </div>
        <span className="text-xs font-semibold text-slate-400">
          Showing {filteredMatches.length} profiles
        </span>
      </div>

      {/* Partner Cards Grid */}
      {filteredMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.map((match) => (
            <PartnerCard
              key={match.id}
              partner={match.partner}
              match={match}
              onViewProfile={(id) => navigate('user-profile', { userId: id })}
              onStartChat={handleStartChatWithPartner}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FilterX}
          title="No matching partners found"
          description="No users matched current filters. Reset filters to explore all active language learners."
          actionLabel="Reset all filters"
          onAction={resetFilters}
        />
      )}
    </div>
  );
}

