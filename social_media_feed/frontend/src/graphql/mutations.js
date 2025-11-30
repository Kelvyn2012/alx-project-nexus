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
  mutation CreatePost($content: String!, $quotedPostId: Int) {
    createPost(content: $content, quotedPostId: $quotedPostId) {
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
        quotesCount
        repostsCount
        isRepost
        quotedPost {
          id
          content
          author {
            id
            username
          }
          createdAt
        }
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

// Repost a post
export const REPOST_POST = gql`
  mutation RepostPost($postId: Int!) {
    repostPost(postId: $postId) {
      post {
        id
        repostsCount
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

// Request password reset
export const REQUEST_PASSWORD_RESET = gql`
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(email: $email) {
      success
      message
      errors
    }
  }
`;

// Reset password with token
export const RESET_PASSWORD = gql`
  mutation ResetPassword($token: String!, $newPassword: String!) {
    resetPassword(token: $token, newPassword: $newPassword) {
      success
      message
      errors
    }
  }
`;

// Google Sign In
export const GOOGLE_SIGN_IN = gql`
  mutation GoogleSignIn($token: String!) {
    googleSignIn(token: $token) {
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
