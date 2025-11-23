import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { useAuth } from '../context/AuthContext';
import { GET_POSTS } from '../graphql/queries';
import { formatDate, formatRelativeTime } from '../utils/helpers';
import Loading from '../components/Common/Loading';
import ErrorMessage from '../components/Common/ErrorMessage';
import ProfilePicture from '../components/Profile/ProfilePicture';
import { getErrorMessage } from '../utils/helpers';
import Header from '../components/Layout/Header';

const UserProfile = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();

  // Fetch all posts to find user's posts
  const { loading, error, data } = useQuery(GET_POSTS, {
    variables: { first: 1000, skip: 0, search: username },
  });

  if (loading) {
    return (
      <>
        <Header />
        <Loading />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <ErrorMessage message={getErrorMessage(error)} />
        </div>
      </>
    );
  }

  // Find posts by this user
  const userPosts = data?.posts?.filter(post => post.author.username === username) || [];

  // If no posts found, user might not exist or hasn't posted
  if (userPosts.length === 0 && !loading) {
    // Try to find any post by this user
    const anyPost = data?.posts?.find(post => post.author.username === username);
    if (!anyPost && username !== currentUser?.username) {
      return (
        <>
          <Header />
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="card p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-700 mb-2">User Not Found</h2>
              <p className="text-gray-500">The user @{username} doesn't exist or hasn't posted anything yet.</p>
            </div>
          </div>
        </>
      );
    }
  }

  // Get user info from first post
  const userInfo = userPosts[0]?.author || { username };

  const totalPosts = userPosts.length;
  const totalLikes = userPosts.reduce((sum, post) => sum + (post.likesCount || 0), 0);
  const totalShares = userPosts.reduce((sum, post) => sum + (post.sharesCount || 0), 0);

  const isOwnProfile = currentUser?.username === username;

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="card p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 flex-1">
              <ProfilePicture
                username={username}
                size="xlarge"
                editable={false}
              />

              <div className="flex-1">
                <h1 className="text-2xl font-bold text-secondary mb-1">
                  {username}
                </h1>
                {userInfo.email && isOwnProfile && (
                  <p className="text-gray-600 mb-2">{userInfo.email}</p>
                )}
                <p className="text-sm text-gray-500">
                  {userInfo.dateJoined && `Joined ${formatDate(userInfo.dateJoined)}`}
                </p>
              </div>
            </div>

            {!isOwnProfile && (
              <button className="btn-primary px-6">
                Follow
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="card p-4 text-center">
            <div className="text-3xl font-bold text-primary mb-1">{totalPosts}</div>
            <div className="text-sm text-gray-600">Posts</div>
          </div>

          <div className="card p-4 text-center">
            <div className="text-3xl font-bold text-like mb-1">{totalLikes}</div>
            <div className="text-sm text-gray-600">Likes Received</div>
          </div>

          <div className="card p-4 text-center">
            <div className="text-3xl font-bold text-share mb-1">{totalShares}</div>
            <div className="text-sm text-gray-600">Shares</div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold text-secondary mb-4">
            {isOwnProfile ? 'My Posts' : `${username}'s Posts`} ({totalPosts})
          </h2>
          {userPosts.length === 0 ? (
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
              <p className="text-gray-500">
                {isOwnProfile ? "You haven't posted anything yet." : `${username} hasn't posted anything yet.`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {userPosts.map((post) => (
                <div key={post.id} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm text-gray-500">
                      {formatRelativeTime(post.createdAt)}
                    </span>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>❤️ {post.likesCount}</span>
                      <span>💬 {post.commentsCount}</span>
                      <span>🔄 {post.sharesCount}</span>
                    </div>
                  </div>
                  <p className="text-secondary">{post.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserProfile;
