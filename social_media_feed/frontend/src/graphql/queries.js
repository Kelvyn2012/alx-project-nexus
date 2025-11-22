import { gql } from '@apollo/client';

// Get all posts with pagination and search
export const GET_POSTS = gql`
  query GetPosts($first: Int, $skip: Int, $search: String) {
    posts(first: $first, skip: $skip, search: $search) {
      id
      content
      author {
        id
        username
      }
      createdAt
      likesCount
      commentsCount
      sharesCount
      comments {
        id
        content
        author {
          id
          username
        }
        createdAt
      }
    }
  }
`;

// Get a single post by ID
export const GET_POST = gql`
  query GetPost($id: ID!) {
    post(id: $id) {
      id
      content
      author {
        id
        username
      }
      createdAt
      likesCount
      commentsCount
      sharesCount
      comments {
        id
        content
        author {
          id
          username
        }
        createdAt
      }
    }
  }
`;

// Get current authenticated user
export const GET_ME = gql`
  query GetMe {
    me {
      id
      username
      email
      dateJoined
    }
  }
`;

// Get user posts
export const GET_USER_POSTS = gql`
  query GetUserPosts($userId: ID!) {
    userPosts(userId: $userId) {
      id
      content
      author {
        id
        username
      }
      createdAt
      likesCount
      commentsCount
      sharesCount
    }
  }
`;
