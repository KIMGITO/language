import React from 'react';
import { Search, Compass, MessageSquare } from 'lucide-react';
import { Conversation, Profile } from '../../types';
import { Avatar } from '../ui/avatar';
import { cn } from '../../lib/utils';

interface ChatConversationListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  currentUserId: string;
  onSelectConversation: (id: string) => void;
  onFindPartners: () => void;
  className?: string;
}

export function ChatConversationList({
  conversations,
  activeConversationId,
  currentUserId,
  onSelectConversation,
  onFindPartners,
  className,
}: ChatConversationListProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredConversations = conversations.filter((c) => {
    const partner = c.members.find((m) => m.id !== currentUserId);
    const name = partner?.display_name || 'Language Partner';
    const lastMsg = c.last_message?.content || '';
    const q = searchQuery.toLowerCase();
    return name.toLowerCase().includes(q) || lastMsg.toLowerCase().includes(q);
  });

  return (
    <div
      className={cn(
        'w-full md:w-72 lg:w-80 bg-slate-900/90 border-r border-slate-800/80 text-slate-100 flex flex-col shrink-0 select-none',
        className
      )}
    >
      {/* Top Search bar */}
      <div className="p-3.5 border-b border-slate-800/80">
        <div className="relative">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full bg-slate-950/80 border border-slate-800 text-slate-200 text-xs pl-9 pr-3 py-2 rounded-xl placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Conversation List Items */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5 scrollbar-thin">
        {filteredConversations.map((convo) => {
          const partner: Profile | undefined = convo.members.find((m) => m.id !== currentUserId);
          const isActive = convo.id === activeConversationId;
          const isGroupChat = convo.id === 'conv-group-lc';
          const title = isGroupChat ? 'LC Practice Circle' : partner?.display_name || 'Partner';
          const lastMsg = convo.last_message?.content || 'Started a conversation';
          const isOnline = partner?.is_online ?? true;

          return (
            <div
              key={convo.id}
              onClick={() => onSelectConversation(convo.id)}
              className={cn(
                'group relative flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all border text-left',
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-indigo-500/50 shadow-md shadow-indigo-600/20 font-semibold'
                  : 'bg-slate-950/40 text-slate-300 border-slate-800/60 hover:bg-slate-800/80 hover:text-white hover:border-slate-700/80'
              )}
            >
              {/* Avatar with status indicator */}
              <div className="relative shrink-0">
                <Avatar
                  src={partner?.avatar_url}
                  fallback={title.charAt(0)}
                  size="md"
                  isOnline={isOnline}
                  className={cn(
                    'border',
                    isActive ? 'border-white/20' : 'border-slate-700'
                  )}
                />
              </div>

              {/* Content info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4
                    className={cn(
                      'font-heading text-xs font-bold truncate leading-tight',
                      isActive ? 'text-white font-extrabold' : 'text-slate-200 group-hover:text-white'
                    )}
                  >
                    {title}
                  </h4>
                  {convo.updated_at && (
                    <span
                      className={cn(
                        'text-[10px] shrink-0 font-medium',
                        isActive ? 'text-indigo-200' : 'text-slate-400'
                      )}
                    >
                      {new Date(convo.updated_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  )}
                </div>

                <p
                  className={cn(
                    'text-[11px] truncate mt-0.5 leading-snug',
                    isActive ? 'text-indigo-100 font-medium' : 'text-slate-400'
                  )}
                >
                  {lastMsg}
                </p>
              </div>

              {/* Unread badge */}
              {convo.unread_count && convo.unread_count > 0 && !isActive && (
                <span className="h-4 min-w-4 px-1.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
                  {convo.unread_count}
                </span>
              )}
            </div>
          );
        })}

        {filteredConversations.length === 0 && (
          <div className="p-6 text-center text-slate-400">
            <MessageSquare className="h-6 w-6 mx-auto mb-2 text-slate-500" />
            <p className="text-xs font-semibold text-slate-300">No conversations found</p>
            <p className="text-[11px] text-slate-500 mt-1">Connect with exchange partners.</p>
            <button
              type="button"
              onClick={onFindPartners}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl cursor-pointer shadow-sm transition-all"
            >
              <Compass className="h-3.5 w-3.5" />
              <span>Find partners</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer shortcut */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 font-medium">
          {conversations.length} Active chats
        </span>
        <button
          type="button"
          onClick={onFindPartners}
          className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer transition-colors"
        >
          <Compass className="h-3.5 w-3.5" />
          <span>Discover Partners</span>
        </button>
      </div>
    </div>
  );
}
