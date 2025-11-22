import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/helpers';

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="card p-6 mb-6">
        <div className="flex items-start space-x-4">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-2xl">
              {user.username.charAt(0).toUpperCase()}
            </span>
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-secondary mb-1">
              {user.username}
            </h1>
            <p className="text-gray-600 mb-2">{user.email}</p>
            <p className="text-sm text-gray-500">
              Joined {formatDate(user.dateJoined)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card p-4 text-center">
          <div className="text-3xl font-bold text-primary mb-1">0</div>
          <div className="text-sm text-gray-600">Posts</div>
        </div>

        <div className="card p-4 text-center">
          <div className="text-3xl font-bold text-like mb-1">0</div>
          <div className="text-sm text-gray-600">Likes</div>
        </div>

        <div className="card p-4 text-center">
          <div className="text-3xl font-bold text-share mb-1">0</div>
          <div className="text-sm text-gray-600">Shares</div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-bold text-secondary mb-4">My Posts</h2>
        <div className="text-center py-8">
          <svg
            className="w-16 h-16 mx-auto text-gray-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-gray-500">You haven't posted anything yet.</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
