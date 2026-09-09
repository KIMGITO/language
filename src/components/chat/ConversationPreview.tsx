import React from 'react';
import { Conversation, Profile } from '../../types';
import { Avatar } from '../ui/avatar';
import { UnreadBadge } from '../common/UnreadBadge';
import { cn } from '../../lib/utils';

interface ConversationPreviewProps {
  key?: React.Key;
  conversation: Conversation;
  currentUserId: string;
  isActive: boolean;
  onClick: () => void;
}

export function ConversationPreview({
  conversation,
  currentUserId,
  isActive,
  onClick,
}: ConversationPreviewProps) {
  const partner: Profile = conversation.members.find((m) => m.id !== currentUserId) || conversation.members[0];

  const nativeLang = partner?.native_languages[0]?.language.name || 'Spanish';
  const learningLang = partner?.learning_languages[0]?.language.name || 'English';

  const formatTimestamp = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'group flex items-start gap-3 p-3 rounded-none cursor-pointer transition-colors relative border',
        isActive
          ? 'bg-brand-blue-subtle border-brand-blue-border'
          : 'bg-app-surface border-app-border hover:bg-app-muted'
      )}
    >
      <Avatar
        src={partner?.avatar_url}
        fallback={partner?.display_name?.charAt(0) || 'U'}
        isOnline={partner?.is_online}
        size="md"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <h4 className="font-heading text-sm font-bold text-app-text truncate group-hover:text-brand-blue">
            {partner?.display_name || 'Language Partner'}
          </h4>
          <span className="text-[11px] text-app-text-muted shrink-0 font-medium">
            {formatTimestamp(conversation.last_message?.created_at || conversation.updated_at)}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-brand-blue font-semibold mb-1">
          <span>{nativeLang}</span>
          <span className="text-app-text-muted font-normal">↔</span>
          <span>{learningLang}</span>
        </div>

        <p className="text-xs text-app-text-muted truncate leading-snug">
          {conversation.last_message ? conversation.last_message.content : 'Active exchange'}
        </p>
      </div>

      {conversation.unread_count > 0 && (
        <div className="shrink-0 self-center">
          <UnreadBadge count={conversation.unread_count} />
        </div>
      )}
    </div>
  );
}
