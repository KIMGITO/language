import React from 'react';
import { BookOpen, Search } from 'lucide-react';
import { ConversationTopic } from '../../types';
import { CONVERSATION_TOPICS } from '../../data/mockData';
import { Sheet } from '../ui/sheet';
import { Input } from '../ui/input';
import { TopicSuggestionCard } from './TopicSuggestionCard';
import { cn } from '../../lib/utils';

interface TopicPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTopic: (topic: ConversationTopic) => void;
}

const CATEGORIES = [
  'All',
  'Food',
  'Travel',
  'Culture',
  'Everyday Life',
  'Music',
  'Work',
  'Technology',
  'Relationships & Friendship',
  'Hobbies',
  'Learning'
];

export function TopicPickerModal({
  open,
  onOpenChange,
  onSelectTopic,
}: TopicPickerModalProps) {
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [search, setSearch] = React.useState('');

  const filteredTopics = CONVERSATION_TOPICS.filter((topic) => {
    const matchesCategory =
      selectedCategory === 'All' || topic.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      !search.trim() ||
      topic.title.toLowerCase().includes(search.toLowerCase()) ||
      topic.prompt.toLowerCase().includes(search.toLowerCase()) ||
      topic.category.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelect = (topic: ConversationTopic) => {
    onSelectTopic(topic);
    onOpenChange(false);
  };

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      side="right"
      title="Conversation Topics"
      description="Select a topic to start your practice"
      className="max-w-lg"
    >
      <div className="space-y-4 pb-6">
        {/* Search */}
        <div className="relative">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search topics..."
            className="pl-9 text-xs"
          />
          <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-app-text-muted" />
        </div>

        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'rounded-none border px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer',
                selectedCategory === cat
                  ? 'bg-brand-blue text-white border-brand-blue'
                  : 'bg-app-muted text-app-text-muted border-app-border hover:text-app-text'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Topic Grid */}
        <div className="space-y-3 mt-4">
          {filteredTopics.length > 0 ? (
            filteredTopics.map((topic) => (
              <TopicSuggestionCard
                key={topic.id}
                topic={topic}
                onSelectTopic={handleSelect}
              />
            ))
          ) : (
            <div className="text-center py-10">
              <BookOpen className="h-8 w-8 text-app-text-muted mx-auto mb-2" />
              <p className="text-sm font-semibold text-app-text">No topics found</p>
            </div>
          )}
        </div>
      </div>
    </Sheet>
  );
}
