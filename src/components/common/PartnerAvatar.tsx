import React from 'react';
import { Avatar } from '../ui/avatar';
import { cn } from '../../lib/utils';

interface PartnerAvatarProps {
  src?: string;
  name: string;
  isOnline?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function PartnerAvatar({
  src,
  name,
  isOnline,
  size = 'md',
  className,
}: PartnerAvatarProps) {
  const fallback = name ? name.charAt(0).toUpperCase() : '?';

  return (
    <div className={cn('relative inline-block shrink-0', className)}>
      <Avatar
        src={src}
        fallback={fallback}
        size={size}
        isOnline={isOnline}
      />
    </div>
  );
}
