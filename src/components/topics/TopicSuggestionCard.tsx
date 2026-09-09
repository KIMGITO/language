import React from 'react';
import { BookOpen, ArrowRight } from 'lucide-react';
import { ConversationTopic } from '../../types';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface TopicSuggestionCardProps {
  key?: React.Key;
  topic: ConversationTopic;
  onSelectTopic: (topic: ConversationTopic) => void;
}

export function TopicSuggestionCard({ topic, onSelectTopic }: TopicSuggestionCardProps) {
  return (
    <Card className="p-4 bg-app-surface border border-app-border rounded-none hover:bg-app-muted transition-colors flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <Badge variant="blue" className="text-[11px]">
            {topic.category}
          </Badge>
          {topic.difficulty && (
            <Badge variant="gold" className="text-[10px]">
              {topic.difficulty}
            </Badge>
          )}
        </div>

        <h4 className="font-heading font-bold text-sm text-app-text mb-1.5 leading-snug">
          {topic.title}
        </h4>

        <p className="text-xs text-app-text-muted leading-relaxed mb-4">
          "{topic.prompt}"
        </p>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onSelectTopic(topic)}
        className="w-full text-xs gap-1.5 font-medium"
      >
        <BookOpen className="h-3.5 w-3.5 text-brand-gold" />
        <span>Use topic</span>
        <ArrowRight className="h-3 w-3 ml-auto text-app-text-muted" />
      </Button>
    </Card>
  );
}
