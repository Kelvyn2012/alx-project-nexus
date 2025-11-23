import { gql } from '@apollo/client';

export const GET_USER_PROFILE = gql`
  query GetUserProfile($username: String!) {
    user(username: $username) {
      id
      username
      email
      dateJoined
      profile {
        bio
        dateOfBirth
        location
        profilePicture
        followersCount
        followingCount
      }
      isFollowing
    }
  }
`;

export const GET_USER_FOLLOWERS = gql`
  query GetUserFollowers($userId: Int!) {
    followers(userId: $userId) {
      id
      username
      profile {
        profilePicture
        followersCount
      }
    }
  }
`;

export const GET_USER_FOLLOWING = gql`
  query GetUserFollowing($userId: Int!) {
    following(userId: $userId) {
      id
      username
      profile {
        profilePicture
        followingCount
      }
    }
  }
`;

export const GET_MY_PROFILE = gql`
  query GetMyProfile {
    me {
      id
      username
      email
      dateJoined
      profile {
        bio
        dateOfBirth
        location
        profilePicture
        followersCount
        followingCount
      }
    }
  }
`;
