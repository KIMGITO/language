import React from 'react';
import { MessageSquarePlus } from 'lucide-react';
import { ConversationTopic } from '../../types';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';

interface ConversationTopicCardProps {
  key?: React.Key;
  topic: ConversationTopic;
  onUseTopic?: (topic: ConversationTopic) => void;
  className?: string;
}

export function ConversationTopicCard({
  topic,
  onUseTopic,
  className,
}: ConversationTopicCardProps) {
  return (
    <div
      className={cn(
        'rounded-none border border-app-border bg-app-surface p-4 transition-colors flex flex-col justify-between gap-3',
        className
      )}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <Badge variant="blue" className="text-[11px] font-medium">
            {topic.category}
          </Badge>
          {topic.difficulty && (
            <span className="text-[11px] text-app-text-muted font-medium">
              {topic.difficulty}
            </span>
          )}
        </div>

        <h4 className="font-heading font-bold text-sm text-app-text mb-1.5 leading-snug">
          {topic.title}
        </h4>

        <p className="text-xs text-app-text-muted leading-relaxed italic">
          "{topic.prompt}"
        </p>
      </div>

      {onUseTopic && (
        <div className="pt-2 border-t border-app-border flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onUseTopic(topic)}
            className="text-xs gap-1.5 font-semibold"
          >
            <MessageSquarePlus className="h-3.5 w-3.5 text-brand-gold" />
            <span>Use topic</span>
          </Button>
        </div>
      )}
    </div>
  );
}
