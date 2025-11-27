import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_POST } from '../../graphql/mutations';
import { GET_POSTS } from '../../graphql/queries';
import Button from '../Common/Button';
import { toast } from 'react-toastify';
import { getErrorMessage } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const { user } = useAuth();
  const maxLength = 500;

  const [createPost, { loading }] = useMutation(CREATE_POST, {
    refetchQueries: [{ query: GET_POSTS, variables: { first: 20, skip: 0, search: '' } }],
    onCompleted: (data) => {
      if (data.createPost.success) {
        setContent('');
        toast.success('Post created successfully!');
      } else if (data.createPost.errors) {
        toast.error(data.createPost.errors.join(', '));
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error('Post content cannot be empty');
      return;
    }

    if (content.length > maxLength) {
      toast.error(`Post content must be less than ${maxLength} characters`);
      return;
    }

    try {
      await createPost({
        variables: { content: content.trim() },
      });
    } catch (error) {
      // Error handled in onError callback
    }
  };

  return (
    <div className="card p-4 mb-6 shadow-md dark:shadow-dark-lg">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 dark:from-blue-500 dark:to-primary rounded-full flex items-center justify-center flex-shrink-0 shadow-md dark:shadow-dark-md">
            <span className="text-white font-semibold text-sm">
              {user?.username?.charAt(0).toUpperCase()}
            </span>
          </div>

          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening?"
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-dark-400"
              rows={3}
              maxLength={maxLength}
            />

            <div className="flex items-center justify-between mt-2">
              <span className={`text-sm transition-colors ${
                content.length > maxLength * 0.9
                  ? 'text-red-500 dark:text-red-400 font-semibold'
                  : 'text-gray-500 dark:text-dark-400'
              }`}>
                {content.length}/{maxLength}
              </span>

              <Button
                type="submit"
                variant="primary"
                disabled={loading || !content.trim()}
              >
                {loading ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
