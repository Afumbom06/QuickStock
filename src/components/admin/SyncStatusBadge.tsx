import { Badge } from '../ui/badge';
import { RefreshCw, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface SyncStatusBadgeProps {
  pendingCount: number;
  lastSync?: string;
  isOnline: boolean;
}

export function SyncStatusBadge({ pendingCount, lastSync, isOnline }: SyncStatusBadgeProps) {
  if (pendingCount > 0) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        <Badge variant="secondary" className="gap-1">
          <Clock className="w-3 h-3" />
          {pendingCount} pending sync
        </Badge>
      </motion.div>
    );
  }

  if (!isOnline) {
    return (
      <Badge variant="secondary" className="gap-1">
        <AlertCircle className="w-3 h-3" />
        Offline
      </Badge>
    );
  }

  if (lastSync) {
    return (
      <Badge variant="default" className="gap-1 bg-green-600">
        <CheckCircle2 className="w-3 h-3" />
        Synced
      </Badge>
    );
  }

  return null;
}
