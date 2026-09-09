import React from 'react';
import { Search, X, BookOpen } from 'lucide-react';
import { ConversationTopic } from '../../types';
import { TOPIC_CATEGORIES, useTopicStore } from '../../stores/topicStore';
import { ConversationTopicCard } from './ConversationTopicCard';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface ConversationTopicPanelProps {
  onSelectTopic?: (topic: ConversationTopic) => void;
  onClose?: () => void;
  className?: string;
}

export function ConversationTopicPanel({
  onSelectTopic,
  onClose,
  className,
}: ConversationTopicPanelProps) {
  const {
    selectedCategory,
    searchQuery,
    setCategory,
    setSearchQuery,
    getFilteredTopics,
  } = useTopicStore();

  const filteredTopics = getFilteredTopics();

  return (
    <div className={cn('bg-app-surface flex flex-col h-full', className)}>
      {/* Header */}
      <div className="p-4 border-b border-app-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-none bg-brand-gold-subtle flex items-center justify-center text-brand-gold">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-app-text leading-none">
              Topics
            </h3>
            <p className="text-[11px] text-app-text-muted mt-1">
              Conversation starters
            </p>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-app-text-muted hover:text-app-text hover:bg-app-muted rounded-none cursor-pointer"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search and Category Filter */}
      <div className="p-4 border-b border-app-border space-y-3 bg-app-muted">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-app-text-muted" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions..."
            className="pl-9 h-9 text-xs"
          />
        </div>

        {/* Categories scrollable pill row */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {TOPIC_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={cn(
                'whitespace-nowrap px-2.5 py-1 text-xs font-semibold rounded-none transition-colors cursor-pointer shrink-0 border',
                selectedCategory === cat
                  ? 'bg-brand-blue text-white border-brand-blue'
                  : 'bg-app-surface text-app-text-muted hover:text-app-text border-app-border'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Topics list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredTopics.length > 0 ? (
          filteredTopics.map((topic) => (
            <ConversationTopicCard
              key={topic.id}
              topic={topic}
              onUseTopic={onSelectTopic}
            />
          ))
        ) : (
          <div className="py-12 text-center text-app-text-muted">
            <p className="text-xs">No topics found.</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCategory('All');
                setSearchQuery('');
              }}
              className="mt-2 text-xs text-brand-blue"
            >
              Reset
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
