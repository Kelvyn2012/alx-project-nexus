import { Link } from 'react-router-dom';
import { formatRelativeTime } from '../../utils/helpers';
import ProfilePicture from '../Profile/ProfilePicture';

const CommentList = ({ comments }) => {
  if (!comments || comments.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic py-2">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-3">
      {comments.map((comment) => (
        <div key={comment.id} className="flex items-start space-x-2">
          <ProfilePicture
            username={comment.author.username}
            profilePicture={comment.author.profile?.profilePicture}
            size="small"
          />

          <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2">
            <div className="flex items-center justify-between mb-1">
              <Link
                to={`/user/${comment.author.username}`}
                className="text-sm font-semibold text-secondary hover:text-primary transition-colors"
              >
                {comment.author.username}
              </Link>
              <span className="text-xs text-gray-500">
                {formatRelativeTime(comment.createdAt)}
              </span>
            </div>
            <p className="text-sm text-gray-700">{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
