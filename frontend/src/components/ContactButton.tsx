'use client';

import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Phone, Mail, MessageSquare, Copy } from 'lucide-react';

interface ContactButtonProps {
  type: 'phone' | 'email' | 'whatsapp' | 'copy';
  value: string;
  label?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function ContactButton({ 
  type, 
  value, 
  label, 
  variant = 'outline', 
  size = 'default',
  className = ''
}: ContactButtonProps) {
  const handleAction = () => {
    switch (type) {
      case 'phone':
        const cleanNumber = value.replace(/[^0-9+]/g, '');
        toast.info(`Calling ${value}`, {
          description: 'Opening phone dialer...',
          action: {
            label: 'Copy',
            onClick: () => navigator.clipboard.writeText(cleanNumber)
          }
        });
        // window.location.href = `tel:${cleanNumber}`;
        break;
        
      case 'email':
        const subject = 'Polibatam Parking System Inquiry';
        const body = `Dear Polibatam Team,\n\nI am contacting you regarding the Parking System.\n\nBest regards,\n[Your Name]`;
        window.open(`mailto:${value}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
        toast.success('Opening email client...');
        break;
        
      case 'whatsapp':
        const whatsappNumber = value.replace(/[^0-9]/g, '');
        const message = `Hello Polibatam Security, I need assistance from Parking System.`;
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
        toast.info('Opening WhatsApp...');
        break;
        
      case 'copy':
        navigator.clipboard.writeText(value);
        toast.success('Copied to clipboard');
        break;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'whatsapp': return <MessageSquare className="h-4 w-4" />;
      case 'copy': return <Copy className="h-4 w-4" />;
    }
  };

  const getText = () => {
    if (label) return label;
    switch (type) {
      case 'phone': return 'Call';
      case 'email': return 'Email';
      case 'whatsapp': return 'WhatsApp';
      case 'copy': return 'Copy';
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleAction}
      className={`gap-2 ${className}`}
    >
      {getIcon()}
      {getText()}
    </Button>
  );
}