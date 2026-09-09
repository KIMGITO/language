import React from 'react';
import { MessageSquarePlus, BookOpen, Compass } from 'lucide-react';
import { ConversationTopic } from '../../types';
import { CONVERSATION_TOPICS } from '../../data/mockData';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface EmptyConversationStateProps {
  onDiscoverClick: () => void;
  onSelectTopic: (topic: ConversationTopic) => void;
}

export function EmptyConversationState({
  onDiscoverClick,
  onSelectTopic,
}: EmptyConversationStateProps) {
  const suggestedTopics = CONVERSATION_TOPICS.slice(0, 3);

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto">
      <div className="h-14 w-14 rounded-none bg-brand-blue-subtle border border-brand-blue-border flex items-center justify-center text-brand-blue mb-4">
        <MessageSquarePlus className="h-7 w-7" />
      </div>

      <h3 className="font-heading text-xl font-bold text-app-text mb-1.5">
        No conversation selected
      </h3>
      <p className="text-xs text-app-text-muted leading-relaxed max-w-sm mb-5">
        Pick a conversation from the list or find a new language partner to start practicing.
      </p>

      <Button
        variant="default"
        size="md"
        onClick={onDiscoverClick}
        className="gap-2 mb-6"
      >
        <Compass className="h-4 w-4" />
        <span>Discover partners</span>
      </Button>

      {/* Suggested Topics preview */}
      <div className="w-full text-left">
        <div className="flex items-center gap-1.5 mb-2.5 text-xs font-semibold uppercase tracking-wider text-app-text-muted">
          <BookOpen className="h-3.5 w-3.5 text-brand-gold" />
          <span>Conversation starters</span>
        </div>

        <div className="space-y-2">
          {suggestedTopics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => onSelectTopic(topic)}
              className="p-3 rounded-none border border-app-border bg-app-surface hover:bg-app-muted transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-heading font-semibold text-xs text-app-text group-hover:text-brand-blue">
                  {topic.title}
                </span>
                <Badge variant="gold" className="text-[10px] py-0.5">
                  {topic.category}
                </Badge>
              </div>
              <p className="text-xs text-app-text-muted line-clamp-2 leading-relaxed">
                "{topic.prompt}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
