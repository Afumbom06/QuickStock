import { Card, CardContent, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { User, Store, Mail, Phone, Calendar, Clock, Wifi, WifiOff, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { getRoleDisplayName } from '../../utils/roleUtils';
import { UserRole } from '../../contexts/AuthContext';

interface ProfileCardProps {
  name: string;
  shopName: string;
  email?: string;
  phone?: string;
  avatar?: string;
  joinDate?: string;
  lastSync?: string;
  isOnline: boolean;
  role: UserRole;
}

export function ProfileCard({ 
  name, 
  shopName, 
  email, 
  phone, 
  avatar, 
  joinDate, 
  lastSync,
  isOnline,
  role
}: ProfileCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-950" />
        <CardContent className="pt-0">
          <div className="flex flex-col items-center -mt-12">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center overflow-hidden shadow-lg">
                {avatar ? (
                  <img src={avatar} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-gray-400" />
                )}
              </div>
              {/* Online Status Indicator */}
              <div className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-white ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
            </div>

            {/* Name & Status */}
            <div className="text-center mt-4 space-y-1">
              <h3 className="text-xl text-gray-900">{name}</h3>
              <div className="flex items-center gap-2 justify-center text-gray-600">
                <Store className="w-4 h-4" />
                <span>{shopName}</span>
              </div>
              <Badge variant={isOnline ? "default" : "secondary"} className="mt-2">
                {isOnline ? (
                  <>
                    <Wifi className="w-3 h-3 mr-1" />
                    Online
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3 mr-1" />
                    Offline
                  </>
                )}
              </Badge>
              <Badge variant="default" className="mt-2">
                <ShieldCheck className="w-3 h-3 mr-1" />
                {getRoleDisplayName(role)}
              </Badge>
            </div>

            {/* Contact Info */}
            <div className="w-full mt-6 space-y-3">
              {email && (
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{email}</span>
                </div>
              )}
              {phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{phone}</span>
                </div>
              )}
              {joinDate && (
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Joined {joinDate}</span>
                </div>
              )}
              {lastSync && (
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Last sync: {lastSync}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}