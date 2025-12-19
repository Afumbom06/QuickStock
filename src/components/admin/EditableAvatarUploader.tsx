import { useState, useRef } from 'react';
import { Camera, User, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { motion } from 'motion/react';
import { toast } from 'sonner';

interface EditableAvatarUploaderProps {
  currentAvatar?: string;
  onAvatarChange: (avatarUrl: string) => void;
  name: string;
}

export function EditableAvatarUploader({ currentAvatar, onAvatarChange, name }: EditableAvatarUploaderProps) {
  const [preview, setPreview] = useState<string | undefined>(currentAvatar);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB');
      return;
    }

    setUploading(true);

    try {
      // Convert to base64 for local storage
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreview(base64String);
        onAvatarChange(base64String);
        toast.success('Profile photo updated');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative group">
        {/* Avatar Display */}
        <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center overflow-hidden shadow-lg">
          {preview ? (
            <img src={preview} alt={name} className="w-full h-full object-cover" />
          ) : (
            <User className="w-16 h-16 text-gray-400" />
          )}
        </div>

        {/* Upload Button Overlay */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? (
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          ) : (
            <Camera className="w-8 h-8 text-white" />
          )}
        </motion.div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="mt-4"
      >
        <Camera className="w-4 h-4 mr-2" />
        {preview ? 'Change Photo' : 'Upload Photo'}
      </Button>
    </div>
  );
}
