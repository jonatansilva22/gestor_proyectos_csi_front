import React from 'react';
import { toMediaUrl } from '../../utils/media';
import placeholder from '../../assets/placeholder.png';

interface UserAvatarProps {
  user: {
    first_name: string;
    last_name: string;
    photo?: string | null;
  };
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  user, 
  size = 'medium', 
  className = '' 
}) => {
  const sizeClasses = {
    small: 'w-8 h-8 text-xs',
    medium: 'w-10 h-10 text-sm',
    large: 'w-16 h-16 text-lg'
  };

  const getInitials = () => {
    const firstInitial = user.first_name?.charAt(0)?.toUpperCase() || '';
    const lastInitial = user.last_name?.charAt(0)?.toUpperCase() || '';
    return firstInitial + lastInitial;
  };

  const getBackgroundColor = () => {
    const colors = [
      'bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
      'bg-red-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'
    ];
    const name = user.first_name + user.last_name;
    const index = name.length % colors.length;
    return colors[index];
  };

    const imageUrl = user.photo || placeholder;

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={`${user.first_name} ${user.last_name}`}
        className={`${sizeClasses[size]} ${className} rounded-full object-cover border-2 border-gray-200 dark:border-gray-600`}
        onError={(e) => {
          e.currentTarget.src = placeholder;
        }}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} ${className} ${getBackgroundColor()} rounded-full flex items-center justify-center text-white font-semibold border-2 border-gray-200 dark:border-gray-600`}
    >
      {getInitials()}
    </div>
  );
};

export default UserAvatar;