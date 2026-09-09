import React from 'react';
import { BookOpen, Check, CheckCheck } from 'lucide-react';
import { Message } from '../../types';
import { cn } from '../../lib/utils';

interface MessageBubbleProps {
  key?: React.Key;
  message: Message;
  isSelf: boolean;
  partnerAvatar?: string;
  partnerName?: string;
  showAvatar?: boolean;
}

export function MessageBubble({
  message,
  isSelf,
  partnerAvatar,
  partnerName,
  showAvatar = true,
}: MessageBubbleProps) {
  const formatTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      className={cn(
        'flex w-full items-end gap-2.5 group mb-3',
        isSelf ? 'justify-end' : 'justify-start'
      )}
    >
      {!isSelf && showAvatar && (
        <div className="h-8 w-8 rounded-full overflow-hidden shrink-0 bg-slate-100 border border-slate-200/80 mb-1 shadow-xs">
          {partnerAvatar ? (
            <img
              src={partnerAvatar}
              alt={partnerName || 'Partner'}
              className="h-full w-full object-cover rounded-full"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-xs font-bold text-indigo-600">
              {partnerName?.charAt(0) || 'P'}
            </div>
          )}
        </div>
      )}

      {!isSelf && !showAvatar && <div className="w-8 shrink-0" />}

      <div
        className={cn(
          'flex flex-col max-w-[82%] sm:max-w-[70%]',
          isSelf ? 'items-end' : 'items-start'
        )}
      >
        {/* If message is a conversation topic prompt */}
        {message.is_topic_starter && message.topic_title && (
          <div
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1 rounded-t-xl text-[11px] font-semibold tracking-wide border-b',
              isSelf
                ? 'bg-indigo-700 text-amber-200 border-indigo-500'
                : 'bg-amber-50 text-amber-900 border-amber-200'
            )}
          >
            <BookOpen className="h-3 w-3 text-amber-400" />
            <span>Topic: {message.topic_title}</span>
            {message.topic_category && (
              <span className="opacity-75">· {message.topic_category}</span>
            )}
          </div>
        )}

        <div
          className={cn(
            'px-4.5 py-3 text-sm leading-relaxed transition-all duration-150 shadow-xs border',
            isSelf
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-transparent rounded-2xl rounded-br-xs'
              : 'bg-white text-slate-800 border-slate-200/80 rounded-2xl rounded-bl-xs'
          )}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>

          <div
            className={cn(
              'flex items-center justify-end gap-1 mt-1 text-[10px] select-none font-medium',
              isSelf ? 'text-indigo-100/90' : 'text-slate-400'
            )}
          >
            <span>{formatTime(message.created_at)}</span>
            {isSelf && (
              <span>
                {message.read_at ? (
                  <CheckCheck className="h-3.5 w-3.5 text-white" />
                ) : (
                  <Check className="h-3.5 w-3.5 text-white/70" />
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

