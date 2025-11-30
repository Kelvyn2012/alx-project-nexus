import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_POST } from '../../graphql/mutations';
import { GET_POSTS } from '../../graphql/queries';
import { toast } from 'react-toastify';
import QuotedPostCard from './QuotedPostCard';

const QuotePostModal = ({ post, isOpen, onClose }) => {
  const [content, setContent] = useState('');
  const [createPost, { loading }] = useMutation(CREATE_POST, {
    refetchQueries: [{ query: GET_POSTS, variables: { first: 20, skip: 0 } }],
    onCompleted: () => {
      toast.success('Quote posted successfully!');
      setContent('');
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to post quote');
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('Please add your thoughts');
      return;
    }
    if (content.length > 500) {
      toast.error('Post is too long (max 500 characters)');
      return;
    }

    await createPost({
      variables: {
        content: content.trim(),
        quotedPostId: parseInt(post.id),
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-dark-850 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-dark-850 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quote Post</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Textarea */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Add your thoughts..."
              className="w-full p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none transition-all"
              rows="4"
              maxLength="500"
            />

            {/* Character Count */}
            <div className="flex justify-end mt-2">
              <span className={`text-sm ${content.length > 450 ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
                {content.length}/500
              </span>
            </div>

            {/* Quoted Post Preview */}
            <div className="mt-4">
              <QuotedPostCard post={post} />
            </div>

            {/* Submit Button */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !content.trim()}
                className="px-6 py-2.5 rounded-xl font-medium text-white bg-primary hover:bg-primary/90 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors shadow-lg shadow-primary/20"
              >
                {loading ? 'Posting...' : 'Quote Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuotePostModal;
