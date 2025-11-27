import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_POSTS } from '../../graphql/queries';
import PostCard from './PostCard';
import CreatePost from './CreatePost';
import Loading from '../Common/Loading';
import ErrorMessage from '../Common/ErrorMessage';
import { getErrorMessage } from '../../utils/helpers';

const Feed = ({ searchQuery }) => {
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const { loading, error, data, refetch } = useQuery(GET_POSTS, {
    variables: {
      first: 20,
      skip: 0,
      search: searchQuery || '',
    },
    fetchPolicy: 'cache-and-network',
    pollInterval: 30000, // Poll every 30 seconds for new posts
  });

  useEffect(() => {
    if (data?.posts) {
      setPosts(data.posts);
      setHasMore(data.posts.length >= 20);
    }
  }, [data]);

  useEffect(() => {
    // Refetch when search query changes
    refetch({
      first: 20,
      skip: 0,
      search: searchQuery || '',
    });
  }, [searchQuery, refetch]);

  const handleLoadMore = () => {
    refetch({
      first: 20,
      skip: posts.length,
      search: searchQuery || '',
    });
  };

  if (loading && !posts.length) {
    return <Loading />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={getErrorMessage(error)}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <CreatePost />

      {posts.length === 0 ? (
        <div className="card p-8 text-center">
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
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No posts yet
          </h3>
          <p className="text-gray-500">
            {searchQuery
              ? 'No posts found matching your search.'
              : 'Be the first to share something!'}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {hasMore && posts.length >= 20 && (
            <div className="text-center mt-6">
              <button
                onClick={handleLoadMore}
                className="btn-secondary"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Feed;
