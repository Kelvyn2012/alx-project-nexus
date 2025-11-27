import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import { TOGGLE_LIKE, SHARE_POST } from '../../graphql/mutations';
import { GET_POSTS } from '../../graphql/queries';
import { formatRelativeTime, formatNumber } from '../../utils/helpers';
import CommentList from '../Comments/CommentList';
import CommentForm from '../Comments/CommentForm';
import ProfilePicture from '../Profile/ProfilePicture';
import { toast } from 'react-toastify';
import { getErrorMessage } from '../../utils/helpers';

const PostCard = ({ post }) => {
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const [toggleLike, { loading: likeLoading }] = useMutation(TOGGLE_LIKE, {
    refetchQueries: [{ query: GET_POSTS, variables: { first: 20, skip: 0, search: '' } }],
    onCompleted: (data) => {
      if (data.toggleLike.success) {
        setIsLiked(data.toggleLike.liked);
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const [sharePost, { loading: shareLoading }] = useMutation(SHARE_POST, {
    refetchQueries: [{ query: GET_POSTS, variables: { first: 20, skip: 0, search: '' } }],
    onCompleted: (data) => {
      if (data.sharePost.success) {
        toast.success('Post shared!');
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const handleLike = async () => {
    try {
      await toggleLike({
        variables: { postId: parseInt(post.id) },
      });
    } catch (error) {
      // Error handled in onError callback
    }
  };

  const handleShare = async () => {
    try {
      await sharePost({
        variables: { postId: parseInt(post.id) },
      });
    } catch (error) {
      // Error handled in onError callback
    }
  };

  const handleToggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <div className="card p-4 mb-4 hover:shadow-lg dark:hover:shadow-dark-xl transition-all duration-300 hover:scale-[1.01]">
      {/* Post Header */}
      <div className="flex items-start space-x-3 mb-3">
        <ProfilePicture
          username={post.author.username}
          profilePicture={post.author.profile?.profilePicture}
          size="medium"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <Link
                to={`/user/${post.author.username}`}
                className="font-semibold text-secondary dark:text-gray-100 hover:text-primary dark:hover:text-blue-400 transition-colors"
              >
                {post.author.username}
              </Link>
              <p className="text-sm text-gray-500 dark:text-dark-400">
                {formatRelativeTime(post.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-3">
        <p className="text-secondary dark:text-gray-100 whitespace-pre-wrap break-words leading-relaxed">
          {post.content}
        </p>
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-dark-700">
        <button
          onClick={handleLike}
          disabled={likeLoading}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 active:scale-95 ${
            isLiked ? 'text-like dark:text-red-400' : 'text-gray-600 dark:text-dark-300'
          }`}
        >
          <svg
            className="w-5 h-5"
            fill={isLiked ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span className="text-sm font-medium">
            {formatNumber(post.likesCount || 0)}
          </span>
        </button>

        <button
          onClick={handleToggleComments}
          className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 active:scale-95 text-gray-600 dark:text-dark-300"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span className="text-sm font-medium">
            {formatNumber(post.commentsCount || 0)}
          </span>
        </button>

        <button
          onClick={handleShare}
          disabled={shareLoading}
          className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 active:scale-95 text-gray-600 dark:text-dark-300"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          <span className="text-sm font-medium">
            {formatNumber(post.sharesCount || 0)}
          </span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-700">
          <CommentList comments={post.comments} />
          <CommentForm postId={post.id} />
        </div>
      )}
    </div>
  );
};

export default PostCard;
