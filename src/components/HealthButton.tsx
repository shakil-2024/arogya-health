import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useVoice } from '@/contexts/VoiceContext';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface HealthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'emergency' | 'success';
  size?: 'default' | 'lg' | 'touch';
  icon?: React.ReactNode;
  children: React.ReactNode;
  voiceLabel?: string;
  onVoiceCommand?: () => void;
}

export const HealthButton: React.FC<HealthButtonProps> = ({
  variant = 'primary',
  size = 'default',
  icon,
  children,
  className,
  voiceLabel,
  onVoiceCommand,
  onClick,
  ...props
}) => {
  const { isVoiceMode, speak, registerVoiceCommand, isListening } = useVoice();

  React.useEffect(() => {
    if (voiceLabel && onVoiceCommand) {
      registerVoiceCommand(voiceLabel, onVoiceCommand);
    }
  }, [voiceLabel, onVoiceCommand, registerVoiceCommand]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isVoiceMode && voiceLabel) {
      speak(`${voiceLabel} selected`);
    }
    onClick?.(e);
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-material-md';
      case 'secondary':
        return 'bg-gradient-secondary text-secondary-foreground hover:opacity-90 shadow-material-md';
      case 'emergency':
        return 'bg-gradient-emergency text-emergency-foreground hover:opacity-90 shadow-emergency voice-pulse';
      case 'success':
        return 'bg-gradient-success text-success-foreground hover:opacity-90 shadow-material-md';
      default:
        return 'bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-material-md';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'lg':
        return 'h-16 px-8 text-lg touch-target-lg';
      case 'touch':
        return 'h-12 px-6 touch-target min-w-[120px]';
      default:
        return 'h-12 px-6 touch-target';
    }
  };

  return (
    <Button
      className={cn(
        'relative font-medium transition-smooth rounded-xl',
        'focus:ring-4 focus:ring-primary/30 focus:outline-none',
        'active:scale-95 transition-bounce',
        getVariantClasses(),
        getSizeClasses(),
        isVoiceMode && 'ring-2 ring-accent/50',
        isListening && variant === 'primary' && 'voice-active',
        className
      )}
      onClick={handleClick}
      {...props}
    >
      <div className="flex items-center justify-center gap-3">
        {icon && <span className="text-xl">{icon}</span>}
        <span className="font-semibold">{children}</span>
        {isVoiceMode && (
          <div className="ml-2 flex items-center">
            {isListening ? (
              <Mic className="h-4 w-4 text-accent animate-pulse" />
            ) : (
              <Volume2 className="h-4 w-4 opacity-70" />
            )}
          </div>
        )}
      </div>
    </Button>
  );
};