import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_COMMENT } from '../../graphql/mutations';
import { GET_POSTS } from '../../graphql/queries';
import Button from '../Common/Button';
import { toast } from 'react-toastify';
import { getErrorMessage } from '../../utils/helpers';

const CommentForm = ({ postId }) => {
  const [content, setContent] = useState('');

  const [createComment, { loading }] = useMutation(CREATE_COMMENT, {
    refetchQueries: [{ query: GET_POSTS, variables: { first: 20, skip: 0, search: '' } }],
    onCompleted: (data) => {
      if (data.createComment.success) {
        setContent('');
        toast.success('Comment added!');
      } else if (data.createComment.errors) {
        toast.error(data.createComment.errors.join(', '));
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      await createComment({
        variables: {
          postId: parseInt(postId),
          content: content.trim(),
        },
      });
    } catch (error) {
      // Error handled in onError callback
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <div className="flex items-start space-x-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <Button
          type="submit"
          variant="primary"
          disabled={loading || !content.trim()}
          className="text-sm px-3 py-2"
        >
          {loading ? 'Posting...' : 'Comment'}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
