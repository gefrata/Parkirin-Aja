'use client';

import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, XCircle, Eye } from 'lucide-react';

interface IssueStatusBadgeProps {
  status: 'open' | 'in_progress' | 'resolved' | 'closed' | 'rejected';
  showIcon?: boolean;
}

export function IssueStatusBadge({ status, showIcon = true }: IssueStatusBadgeProps) {
  const statusConfig = {
    open: {
      label: 'Open',
      color: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
      icon: <AlertCircle className="h-3 w-3" />,
    },
    in_progress: {
      label: 'In Progress',
      color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
      icon: <Clock className="h-3 w-3" />,
    },
    resolved: {
      label: 'Resolved',
      color: 'bg-green-100 text-green-800 hover:bg-green-100',
      icon: <CheckCircle className="h-3 w-3" />,
    },
    closed: {
      label: 'Closed',
      color: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
      icon: <Eye className="h-3 w-3" />,
    },
    rejected: {
      label: 'Rejected',
      color: 'bg-red-100 text-red-800 hover:bg-red-100',
      icon: <XCircle className="h-3 w-3" />,
    },
  };

  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={`${config.color} flex items-center gap-1`}>
      {showIcon && config.icon}
      {config.label}
    </Badge>
  );
}