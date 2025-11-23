import { useState, useRef } from 'react';
import { getInitials, getAvatarColor } from '../../utils/helpers';
import { toast } from 'react-toastify';

const ProfilePicture = ({ username, size = 'large', editable = false }) => {
  const [profilePic, setProfilePic] = useState(() => {
    // Get saved profile picture from localStorage
    return localStorage.getItem(`profile_pic_${username}`);
  });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const sizes = {
    small: 'w-8 h-8 text-xs',
    medium: 'w-10 h-10 text-sm',
    large: 'w-20 h-20 text-2xl',
    xlarge: 'w-32 h-32 text-4xl',
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    setIsUploading(true);

    // Read file and convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;

      // Save to localStorage
      localStorage.setItem(`profile_pic_${username}`, base64String);
      setProfilePic(base64String);
      setIsUploading(false);
      toast.success('Profile picture updated!');
    };

    reader.onerror = () => {
      toast.error('Failed to read image file');
      setIsUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    if (editable && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    localStorage.removeItem(`profile_pic_${username}`);
    setProfilePic(null);
    toast.success('Profile picture removed');
  };

  const avatarColor = getAvatarColor(username);
  const initials = getInitials(username);

  return (
    <div className="relative inline-block">
      <div
        className={`${sizes[size]} rounded-full flex items-center justify-center font-bold overflow-hidden ${
          editable ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
        }`}
        style={{
          backgroundColor: profilePic ? 'transparent' : avatarColor,
        }}
        onClick={handleClick}
      >
        {isUploading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        ) : profilePic ? (
          <img
            src={profilePic}
            alt={`${username}'s profile`}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-white">{initials}</span>
        )}
      </div>

      {editable && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <button
            onClick={handleClick}
            className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1.5 hover:bg-blue-600 transition-colors shadow-lg"
            title="Change profile picture"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>

          {profilePic && (
            <button
              onClick={handleRemove}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg"
              title="Remove profile picture"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ProfilePicture;
