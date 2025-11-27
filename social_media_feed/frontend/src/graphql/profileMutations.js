import { gql } from '@apollo/client';

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile(
    $bio: String
    $date_of_birth: Date
    $location: String
    $profile_picture: String
  ) {
    updateProfile(
      bio: $bio
      dateOfBirth: $date_of_birth
      location: $location
      profilePicture: $profile_picture
    ) {
      success
      errors
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

export const FOLLOW_USER = gql`
  mutation FollowUser($userId: Int!) {
    followUser(userId: $userId) {
      success
      errors
      isFollowing
    }
  }
`;

export const UNFOLLOW_USER = gql`
  mutation UnfollowUser($userId: Int!) {
    unfollowUser(userId: $userId) {
      success
      errors
      isFollowing
    }
  }
`;
