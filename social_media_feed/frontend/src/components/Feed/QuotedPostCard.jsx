import { Link } from 'react-router-dom';
import { formatRelativeTime, formatNumber } from '../../utils/helpers';

const QuotedPostCard = ({ post }) => {
  if (!post) return null;

  return (
    <Link to={`/user/${post.author.username}`}>
      <div className="mt-3 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-800/50 transition-all duration-200 cursor-pointer group">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm hover:underline">
                {post.author.username}
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-xs">
                · {formatRelativeTime(post.createdAt)}
              </span>
            </div>

            <p className="text-gray-800 dark:text-gray-200 text-sm whitespace-pre-wrap break-words line-clamp-3">
              {post.content}
            </p>

            {/* Stats */}
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span>{formatNumber(post.likesCount)} likes</span>
              <span>{formatNumber(post.commentsCount)} comments</span>
              {(post.quotesCount > 0 || post.repostsCount > 0) && (
                <span>
                  {formatNumber(post.quotesCount + post.repostsCount)} reposts
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default QuotedPostCard;
