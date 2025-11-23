import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { useAuth } from '../context/AuthContext';
import { GET_USER_PROFILE } from '../graphql/profileQueries';
import { GET_POSTS } from '../graphql/queries';
import { FOLLOW_USER, UNFOLLOW_USER } from '../graphql/profileMutations';
import { formatDate, formatRelativeTime } from '../utils/helpers';
import Loading from '../components/Common/Loading';
import ErrorMessage from '../components/Common/ErrorMessage';
import ProfilePicture from '../components/Profile/ProfilePicture';
import { getErrorMessage } from '../utils/helpers';
import Header from '../components/Layout/Header';
import { toast } from 'react-toastify';
import { useState } from 'react';

const UserProfile = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);

  // Fetch user profile data
  const { loading: profileLoading, error: profileError, data: profileData, refetch } = useQuery(GET_USER_PROFILE, {
    variables: { username },
    onCompleted: (data) => {
      if (data?.user?.isFollowing !== undefined) {
        setIsFollowing(data.user.isFollowing);
      }
    },
  });

  // Fetch user's posts
  const { loading: postsLoading, error: postsError, data: postsData } = useQuery(GET_POSTS, {
    variables: { first: 1000, skip: 0, search: username },
  });

  // Follow mutation
  const [followUser, { loading: followLoading }] = useMutation(FOLLOW_USER, {
    onCompleted: (data) => {
      if (data.followUser.success) {
        setIsFollowing(true);
        toast.success(`You are now following ${username}`);
        refetch();
      } else if (data.followUser.errors) {
        toast.error(data.followUser.errors.join(', '));
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  // Unfollow mutation
  const [unfollowUser, { loading: unfollowLoading }] = useMutation(UNFOLLOW_USER, {
    onCompleted: (data) => {
      if (data.unfollowUser.success) {
        setIsFollowing(false);
        toast.success(`You unfollowed ${username}`);
        refetch();
      } else if (data.unfollowUser.errors) {
        toast.error(data.unfollowUser.errors.join(', '));
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const handleFollowToggle = () => {
    if (!profileData?.user?.id) return;

    if (isFollowing) {
      unfollowUser({ variables: { userId: parseInt(profileData.user.id) } });
    } else {
      followUser({ variables: { userId: parseInt(profileData.user.id) } });
    }
  };

  if (profileLoading || postsLoading) {
    return (
      <>
        <Header />
        <Loading />
      </>
    );
  }

  if (profileError || postsError) {
    return (
      <>
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <ErrorMessage message={getErrorMessage(profileError || postsError)} />
        </div>
      </>
    );
  }

  // Check if user exists
  if (!profileData?.user) {
    return (
      <>
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="card p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-700 mb-2">User Not Found</h2>
            <p className="text-gray-500">The user @{username} doesn't exist.</p>
          </div>
        </div>
      </>
    );
  }

  const user = profileData.user;
  const profile = user.profile || {};

  // Find posts by this user
  const userPosts = postsData?.posts?.filter(post => post.author.username === username) || [];
  const totalPosts = userPosts.length;
  const totalLikes = userPosts.reduce((sum, post) => sum + (post.likesCount || 0), 0);
  const totalShares = userPosts.reduce((sum, post) => sum + (post.sharesCount || 0), 0);

  const isOwnProfile = currentUser?.username === username;

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="card p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 flex-1">
              <ProfilePicture
                username={username}
                profilePicture={profile.profilePicture}
                size="xlarge"
                editable={false}
              />

              <div className="flex-1">
                <h1 className="text-2xl font-bold text-secondary mb-1">
                  {username}
                </h1>

                {profile.bio && (
                  <p className="text-gray-700 mb-2">{profile.bio}</p>
                )}

                <div className="space-y-1 text-sm text-gray-600">
                  {profile.location && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {profile.location}
                    </div>
                  )}

                  {profile.dateOfBirth && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Born {formatDate(profile.dateOfBirth)}
                    </div>
                  )}

                  {user.dateJoined && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Joined {formatDate(user.dateJoined)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {!isOwnProfile && (
              <button
                onClick={handleFollowToggle}
                disabled={followLoading || unfollowLoading}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                  isFollowing
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'btn-primary'
                }`}
              >
                {followLoading || unfollowLoading ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="card p-4 text-center">
            <div className="text-3xl font-bold text-primary mb-1">{totalPosts}</div>
            <div className="text-sm text-gray-600">Posts</div>
          </div>

          <div className="card p-4 text-center">
            <div className="text-3xl font-bold text-like mb-1">{totalLikes}</div>
            <div className="text-sm text-gray-600">Likes</div>
          </div>

          <div className="card p-4 text-center">
            <div className="text-3xl font-bold text-share mb-1">{totalShares}</div>
            <div className="text-sm text-gray-600">Shares</div>
          </div>

          <div className="card p-4 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">{profile.followersCount || 0}</div>
            <div className="text-sm text-gray-600">Followers</div>
          </div>

          <div className="card p-4 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">{profile.followingCount || 0}</div>
            <div className="text-sm text-gray-600">Following</div>
          </div>
        </div>

        {/* User Posts */}
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
