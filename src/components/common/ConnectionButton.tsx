import React from 'react';
import { UserPlus, Check, Clock, MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

export type ConnectionStatus = 'none' | 'pending' | 'connected';

interface ConnectionButtonProps {
  status?: ConnectionStatus;
  isLoading?: boolean;
  onConnect?: () => void;
  onOpenChat?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ConnectionButton({
  status = 'none',
  isLoading = false,
  onConnect,
  onOpenChat,
  className,
  size = 'sm',
}: ConnectionButtonProps) {
  if (isLoading) {
    return (
      <Button
        variant="outline"
        size={size}
        disabled
        className={cn('gap-1.5', className)}
      >
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        <span>Connecting...</span>
      </Button>
    );
  }

  if (status === 'connected') {
    return (
      <Button
        variant="default"
        size={size}
        onClick={onOpenChat}
        className={cn('gap-1.5 bg-teal-600 hover:bg-teal-700 text-white', className)}
      >
        <MessageSquare className="h-3.5 w-3.5" />
        <span>Chat</span>
      </Button>
    );
  }

  if (status === 'pending') {
    return (
      <Button
        variant="outline"
        size={size}
        disabled
        className={cn('gap-1.5 text-stone-500 bg-stone-50 border-stone-200', className)}
      >
        <Clock className="h-3.5 w-3.5 text-amber-600" />
        <span>Request Sent</span>
      </Button>
    );
  }

  return (
    <Button
      variant="default"
      size={size}
      onClick={onConnect}
      className={cn('gap-1.5 bg-teal-600 hover:bg-teal-700 text-white font-medium', className)}
    >
      <UserPlus className="h-3.5 w-3.5" />
      <span>Connect</span>
    </Button>
  );
}
