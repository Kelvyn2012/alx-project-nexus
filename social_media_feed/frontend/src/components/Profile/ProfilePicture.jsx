import { getInitials, getAvatarColor } from '../../utils/helpers';

const ProfilePicture = ({ username, profilePicture, size = 'large', editable = false }) => {
  const sizes = {
    small: 'w-8 h-8 text-xs',
    medium: 'w-10 h-10 text-sm',
    large: 'w-20 h-20 text-2xl',
    xlarge: 'w-32 h-32 text-4xl',
  };

  const avatarColor = getAvatarColor(username);
  const initials = getInitials(username);

  // Use profilePicture from server, fallback to localStorage for backward compatibility
  const displayPicture = profilePicture || localStorage.getItem(`profile_pic_${username}`);

  return (
    <div className="relative inline-block">
      <div
        className={`${sizes[size]} rounded-full flex items-center justify-center font-bold overflow-hidden`}
        style={{
          backgroundColor: displayPicture ? 'transparent' : avatarColor,
        }}
      >
        {displayPicture ? (
          <img
            src={displayPicture}
            alt={`${username}'s profile`}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-white">{initials}</span>
        )}
      </div>
    </div>
  );
};

export default ProfilePicture;
