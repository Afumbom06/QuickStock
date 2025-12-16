import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { LucideIcon, WifiOff } from 'lucide-react';
import { motion } from 'motion/react';
import { CountUpAnimation } from '../CountUpAnimation';
import { Link } from 'react-router';

interface KPICardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  currency?: string;
  suffix?: string;
  isOffline?: boolean;
  linkTo?: string;
  delay?: number;
}

export function KPICard({ 
  title, 
  value, 
  icon: Icon, 
  iconColor, 
  iconBgColor,
  currency,
  suffix,
  isOffline = false,
  linkTo,
  delay = 0
}: KPICardProps) {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="h-full"
    >
      <Card className={`h-full transition-all duration-300 ${linkTo ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1' : ''}`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-2">{title}</p>
              <div className="flex items-baseline gap-1">
                {currency && <span className="text-lg text-gray-700">{currency}</span>}
                <CountUpAnimation 
                  end={value} 
                  duration={2000}
                  className="text-2xl text-gray-900"
                />
                {suffix && <span className="text-sm text-gray-600 ml-1">{suffix}</span>}
              </div>
            </div>
            <div className={`w-12 h-12 rounded-lg ${iconBgColor} flex items-center justify-center`}>
              <Icon className={`w-6 h-6 ${iconColor}`} />
            </div>
          </div>
          {isOffline && (
            <Badge variant="secondary" className="mt-3 text-xs">
              <WifiOff className="w-3 h-3 mr-1" />
              Offline Data
            </Badge>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  if (linkTo) {
    return <Link to={linkTo} className="block h-full">{content}</Link>;
  }

  return content;
}
