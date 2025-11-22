import { gql } from '@apollo/client';

// User registration
export const REGISTER = gql`
  mutation Register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      user {
        id
        username
        email
      }
      token
      refreshToken
      success
      errors
    }
  }
`;

// User login
export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
      refreshToken
      user {
        id
        username
        email
      }
    }
  }
`;

// Create a new post
export const CREATE_POST = gql`
  mutation CreatePost($content: String!) {
    createPost(content: $content) {
      post {
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
      success
      errors
    }
  }
`;

// Toggle like on a post
export const TOGGLE_LIKE = gql`
  mutation ToggleLike($postId: Int!) {
    toggleLike(postId: $postId) {
      post {
        id
        likesCount
      }
      liked
      success
      errors
    }
  }
`;

// Share a post
export const SHARE_POST = gql`
  mutation SharePost($postId: Int!) {
    sharePost(postId: $postId) {
      post {
        id
        sharesCount
      }
      success
      errors
    }
  }
`;

// Create a comment on a post
export const CREATE_COMMENT = gql`
  mutation CreateComment($postId: Int!, $content: String!) {
    createComment(postId: $postId, content: $content) {
      comment {
        id
        content
        author {
          id
          username
        }
        createdAt
      }
      success
      errors
    }
  }
`;
