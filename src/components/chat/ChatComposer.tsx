import React from 'react';
import { Send, BookOpen, X } from 'lucide-react';
import { ConversationTopic } from '../../types';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

interface ChatComposerProps {
  onSendMessage: (content: string, topicMeta?: { title: string; category: string }) => void;
  selectedTopic: ConversationTopic | null;
  onClearTopic: () => void;
  onOpenTopics: () => void;
  disabled?: boolean;
}

export function ChatComposer({
  onSendMessage,
  selectedTopic,
  onClearTopic,
  onOpenTopics,
  disabled = false,
}: ChatComposerProps) {
  const [text, setText] = React.useState('');
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (selectedTopic) {
      setText(`"${selectedTopic.prompt}"\n\n`);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(
            textareaRef.current.value.length,
            textareaRef.current.value.length
          );
        }
      }, 50);
    }
  }, [selectedTopic]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() || disabled) return;

    const topicMeta = selectedTopic
      ? { title: selectedTopic.title, category: selectedTopic.category }
      : undefined;

    onSendMessage(text.trim(), topicMeta);
    setText('');
    onClearTopic();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-app-border bg-app-surface p-3 sm:p-4">
      {/* Selected Topic Banner */}
      {selectedTopic && (
        <div className="mb-2.5 flex items-start justify-between gap-2 rounded-none bg-brand-gold-subtle border border-brand-gold-border p-2.5 text-xs text-brand-gold-text animate-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-start gap-2">
            <BookOpen className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-brand-gold-text">
                Topic: {selectedTopic.title} ({selectedTopic.category})
              </p>
              <p className="text-[11px] text-app-text-muted line-clamp-1 mt-0.5">
                {selectedTopic.prompt}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClearTopic}
            className="rounded-none p-1 text-app-text-muted hover:bg-app-muted transition-colors cursor-pointer"
            title="Remove topic"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Input row */}
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={onOpenTopics}
          className="shrink-0 text-xs gap-1.5 h-10 px-3"
          title="Conversation topics"
        >
          <BookOpen className="h-4 w-4 text-brand-gold" />
          <span className="hidden sm:inline">Topics</span>
        </Button>

        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (Press Enter to send)"
            disabled={disabled}
            className="min-h-[44px] max-h-32 py-2.5 resize-none pr-3"
            rows={1}
          />
        </div>

        <Button
          type="submit"
          disabled={!text.trim() || disabled}
          size="md"
          variant="default"
          className="shrink-0 h-10 w-10 sm:w-auto sm:px-4 gap-1.5"
        >
          <Send className="h-4 w-4" />
          <span className="hidden sm:inline">Send</span>
        </Button>
      </form>
    </div>
  );
}
