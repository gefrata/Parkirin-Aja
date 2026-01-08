'use client';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { ReactNode } from 'react';

interface SocialButtonProps {
  provider: 'google' | 'github' | 'facebook';
  icon: ReactNode;
  isLoading?: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function SocialButton({
  provider,
  icon,
  isLoading,
  onClick,
  disabled
}: SocialButtonProps) {
  const providerNames = {
    google: 'Google',
    github: 'GitHub',
    facebook: 'Facebook'
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      disabled={disabled || isLoading}
      className="w-full h-11"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : (
        <span className="mr-2">{icon}</span>
      )}
      <span className="text-sm">Continue with {providerNames[provider]}</span>
    </Button>
  );
}