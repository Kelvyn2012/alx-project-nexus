import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import { TOGGLE_LIKE, SHARE_POST, REPOST_POST } from '../../graphql/mutations';
import { GET_POSTS } from '../../graphql/queries';
import { formatRelativeTime, formatNumber } from '../../utils/helpers';
import CommentList from '../Comments/CommentList';
import CommentForm from '../Comments/CommentForm';
import ProfilePicture from '../Profile/ProfilePicture';
import QuotedPostCard from './QuotedPostCard';
import QuotePostModal from './QuotePostModal';
import { toast } from 'react-toastify';
import { getErrorMessage } from '../../utils/helpers';

const PostCard = ({ post }) => {
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showRepostMenu, setShowRepostMenu] = useState(false);

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

  const [repostPost, { loading: repostLoading }] = useMutation(REPOST_POST, {
    refetchQueries: [{ query: GET_POSTS, variables: { first: 20, skip: 0, search: '' } }],
    onCompleted: (data) => {
      if (data.repostPost.success) {
        toast.success('Reposted!');
        setShowRepostMenu(false);
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

  const handleRepost = async () => {
    try {
      await repostPost({
        variables: { postId: parseInt(post.id) },
      });
    } catch (error) {
      // Error handled in onError callback
    }
  };

  const handleQuote = () => {
    setShowRepostMenu(false);
    setShowQuoteModal(true);
  };

  const handleToggleComments = () => {
    setShowComments(!showComments);
  };

  // Determine if this is a repost or quote post
  const isRepost = post.isRepost && post.quotedPost;
  const isQuotePost = !post.isRepost && post.quotedPost;

  return (
    <div className="card p-6 mb-4 hover:shadow-xl dark:hover:shadow-dark-xl transition-all duration-300 border border-gray-200 dark:border-dark-700 bg-white dark:bg-gradient-to-br dark:from-dark-850 dark:to-dark-900">
      {/* Repost Header */}
      {isRepost && (
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="font-medium">{post.author.username} reposted</span>
        </div>
      )}

      {/* Post Header */}
      <div className="flex items-start space-x-3 mb-4">
        <ProfilePicture
          username={isRepost ? post.quotedPost.author.username : post.author.username}
          profilePicture={isRepost ? post.quotedPost.author.profile?.profilePicture : post.author.profile?.profilePicture}
          size="medium"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <Link
                to={`/user/${isRepost ? post.quotedPost.author.username : post.author.username}`}
                className="font-bold text-gray-900 dark:text-white hover:text-primary dark:hover:text-blue-400 transition-colors text-lg"
              >
                {isRepost ? post.quotedPost.author.username : post.author.username}
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {formatRelativeTime(isRepost ? post.quotedPost.createdAt : post.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Post Content */}
      {!isRepost && post.content && (
        <div className="mb-4">
          <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words leading-relaxed text-base">
            {post.content}
          </p>
        </div>
      )}

      {/* Quoted Post */}
      {(isRepost || isQuotePost) && post.quotedPost && (
        <QuotedPostCard post={isRepost ? post.quotedPost : post.quotedPost} />
      )}

      {/* Post Actions */}
      <div className="flex items-center justify-around pt-4 mt-4 border-t border-gray-200 dark:border-dark-700">
        {/* Like Button */}
        <button
          onClick={handleLike}
          disabled={likeLoading}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 active:scale-95 group ${
            isLiked ? 'text-like dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          <svg
            className="w-5 h-5 group-hover:scale-110 transition-transform"
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
          <span className="text-sm font-semibold">
            {formatNumber(post.likesCount || 0)}
          </span>
        </button>

        {/* Comment Button */}
        <button
          onClick={handleToggleComments}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 active:scale-95 text-gray-600 dark:text-gray-400 group"
        >
          <svg
            className="w-5 h-5 group-hover:scale-110 transition-transform"
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
          <span className="text-sm font-semibold">
            {formatNumber(post.commentsCount || 0)}
          </span>
        </button>

        {/* Repost/Quote Button */}
        <div className="relative">
          <button
            onClick={() => setShowRepostMenu(!showRepostMenu)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 active:scale-95 text-gray-600 dark:text-gray-400 group"
          >
            <svg
              className="w-5 h-5 group-hover:scale-110 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span className="text-sm font-semibold">
              {formatNumber((post.quotesCount || 0) + (post.repostsCount || 0))}
            </span>
          </button>

          {/* Repost Menu */}
          {showRepostMenu && (
            <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-dark-800 rounded-xl shadow-2xl border border-gray-200 dark:border-dark-700 py-2 min-w-[200px] z-10">
              <button
                onClick={handleRepost}
                disabled={repostLoading}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors flex items-center gap-3 text-gray-900 dark:text-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="font-medium">Repost</span>
              </button>
              <button
                onClick={handleQuote}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors flex items-center gap-3 text-gray-900 dark:text-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="font-medium">Quote</span>
              </button>
            </div>
          )}
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          disabled={shareLoading}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 active:scale-95 text-gray-600 dark:text-gray-400 group"
        >
          <svg
            className="w-5 h-5 group-hover:scale-110 transition-transform"
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
          <span className="text-sm font-semibold">
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

      {/* Quote Post Modal */}
      <QuotePostModal
        post={post}
        isOpen={showQuoteModal}
        onClose={() => setShowQuoteModal(false)}
      />
    </div>
  );
};

export default PostCard;
