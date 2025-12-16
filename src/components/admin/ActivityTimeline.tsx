import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  ShoppingCart, 
  Package, 
  DollarSign, 
  Users, 
  AlertTriangle,
  Clock
} from 'lucide-react';
import { motion } from 'motion/react';

export interface Activity {
  id: string;
  type: 'sale' | 'expense' | 'inventory' | 'customer' | 'alert';
  title: string;
  description: string;
  timestamp: string;
  isPending?: boolean;
}

interface ActivityTimelineProps {
  activities: Activity[];
}

const activityConfig = {
  sale: {
    icon: ShoppingCart,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  expense: {
    icon: DollarSign,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
  inventory: {
    icon: Package,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  customer: {
    icon: Users,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  alert: {
    icon: AlertTriangle,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
};

function formatTimeAgo(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMins = Math.floor(diffInMs / 60000);
  
  if (diffInMins < 1) return 'Just now';
  if (diffInMins < 60) return `${diffInMins}m ago`;
  
  const diffInHours = Math.floor(diffInMins / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return date.toLocaleDateString();
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No recent activities</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const config = activityConfig[activity.type];
            const Icon = config.icon;

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0"
              >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-full ${config.bgColor} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {formatTimeAgo(activity.timestamp)}
                      </span>
                      {activity.isPending && (
                        <Badge variant="secondary" className="text-xs">
                          Pending Sync
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
