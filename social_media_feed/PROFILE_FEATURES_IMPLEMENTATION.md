# Profile Features Implementation Guide

## 🎯 Features to Implement

1. ✅ User Profile with Bio, DOB, Location
2. ✅ Edit Profile Functionality
3. ✅ Profile Picture Synced Across Users
4. ✅ Follow/Unfollow Users
5. ✅ View Other Users' Profiles
6. ✅ Followers/Following Counts

---

## ✅ COMPLETED: Backend Models

### 1. UserProfile Model (DONE)
```python
class UserProfile(models.Model):
    user = OneToOneField(User)
    bio = TextField(max_length=500)
    date_of_birth = DateField()
    location = CharField(max_length=100)
    profile_picture = TextField()  # Base64 or URL
    followers_count = PositiveIntegerField(default=0)
    following_count = PositiveIntegerField(default=0)
```

### 2. Follow Model (DONE)
```python
class Follow(models.Model):
    follower = ForeignKey(User, related_name='following')
    following = ForeignKey(User, related_name='followers')
    created_at = DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('follower', 'following')
```

---

## 📝 TODO: Backend GraphQL Schema Updates

### Step 1: Add UserProfile Type to `core/schema.py`

Add after line 18:

```python
from .models import Post, Comment, Interaction, UserProfile, Follow

class UserProfileType(DjangoObjectType):
    class Meta:
        model = UserProfile
        fields = ("id", "user", "bio", "date_of_birth", "location",
                  "profile_picture", "followers_count", "following_count",
                  "created_at", "updated_at")

class FollowType(DjangoObjectType):
    class Meta:
        model = Follow
        fields = ("id", "follower", "following", "created_at")

# Update UserType to include profile
class UserType(DjangoObjectType):
    profile = graphene.Field(UserProfileType)
    is_following = graphene.Boolean()

    class Meta:
        model = User
        fields = ("id", "username", "email", "date_joined", "profile")

    def resolve_profile(self, info):
        try:
            return self.profile
        except UserProfile.DoesNotExist:
            return None

    def resolve_is_following(self, info):
        if info.context.user.is_authenticated:
            return Follow.objects.filter(
                follower=info.context.user,
                following=self
            ).exists()
        return False
```

### Step 2: Add Queries to `core/schema.py`

Add to Query class:

```python
class Query(graphene.ObjectType):
    # Existing queries...
    me = graphene.Field(UserType)
    posts = graphene.List(...)

    # NEW QUERIES:
    user = graphene.Field(UserType, username=graphene.String(required=True))
    user_profile = graphene.Field(UserProfileType, user_id=graphene.Int(required=True))
    followers = graphene.List(UserType, user_id=graphene.Int(required=True))
    following = graphene.List(UserType, user_id=graphene.Int(required=True))

    @login_required
    def resolve_user(self, info, username):
        """Get user by username"""
        try:
            return User.objects.get(username=username)
        except User.DoesNotExist:
            return None

    def resolve_user_profile(self, info, user_id):
        """Get user profile"""
        try:
            return UserProfile.objects.get(user_id=user_id)
        except UserProfile.DoesNotExist:
            return None

    def resolve_followers(self, info, user_id):
        # Get user's followers
        follows = Follow.objects.filter(following_id=user_id).select_related('follower')
        return [f.follower for f in follows]

    def resolve_following(self, info, user_id):
        # Get users that user is following
        follows = Follow.objects.filter(follower_id=user_id).select_related('following')
        return [f.following for f in follows]
```

### Step 3: Add Mutations to `core/schema.py`

Add new mutation classes:

```python
class UpdateProfile(graphene.Mutation):
    class Arguments:
        bio = graphene.String()
        date_of_birth = graphene.Date()
        location = graphene.String()
        profile_picture = graphene.String()

    success = graphene.Boolean()
    errors = graphene.List(graphene.String)
    profile = graphene.Field(UserProfileType)

    @login_required
    def mutate(self, info, **kwargs):
        user = info.context.user
        profile, created = UserProfile.objects.get_or_create(user=user)

        for key, value in kwargs.items():
            if value is not None:
                setattr(profile, key, value)

        profile.save()
        return UpdateProfile(success=True, profile=profile)


class FollowUser(graphene.Mutation):
    class Arguments:
        user_id = graphene.Int(required=True)

    success = graphene.Boolean()
    errors = graphene.List(graphene.String)
    is_following = graphene.Boolean()

    @login_required
    def mutate(self, info, user_id):
        follower = info.context.user

        if follower.id == user_id:
            return FollowUser(success=False, errors=['Cannot follow yourself'])

        try:
            following = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return FollowUser(success=False, errors=['User not found'])

        follow, created = Follow.objects.get_or_create(
            follower=follower,
            following=following
        )

        if created:
            # Update counts
            follower_profile, _ = UserProfile.objects.get_or_create(user=follower)
            following_profile, _ = UserProfile.objects.get_or_create(user=following)

            follower_profile.following_count += 1
            following_profile.followers_count += 1

            follower_profile.save()
            following_profile.save()

        return FollowUser(success=True, is_following=True)


class UnfollowUser(graphene.Mutation):
    class Arguments:
        user_id = graphene.Int(required=True)

    success = graphene.Boolean()
    errors = graphene.List(graphene.String)
    is_following = graphene.Boolean()

    @login_required
    def mutate(self, info, user_id):
        follower = info.context.user

        try:
            following = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return UnfollowUser(success=False, errors=['User not found'])

        deleted = Follow.objects.filter(
            follower=follower,
            following=following
        ).delete()[0]

        if deleted:
            # Update counts
            follower_profile = UserProfile.objects.get(user=follower)
            following_profile = UserProfile.objects.get(user=following)

            follower_profile.following_count = max(0, follower_profile.following_count - 1)
            following_profile.followers_count = max(0, following_profile.followers_count - 1)

            follower_profile.save()
            following_profile.save()

        return UnfollowUser(success=True, is_following=False)


# Add to Mutation class:
class Mutation(graphene.ObjectType):
    # Existing mutations...
    register = Register.Field()
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()

    # NEW MUTATIONS:
    update_profile = UpdateProfile.Field()
    follow_user = FollowUser.Field()
    unfollow_user = UnfollowUser.Field()
```

---

## 🗄️ Database Migrations

### Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

### On Render:
Update your build command to include migrations (already done ✅)

---

## 🎨 Frontend Implementation

I'll now create the frontend components for these features...

---

## 📋 Implementation Checklist

### Backend:
- [x] Create UserProfile model
- [x] Create Follow model
- [x] Create migrations
- [ ] Update GraphQL schema (copy code above)
- [ ] Add UserProfileType
- [ ] Add queries (user, userProfile, followers, following)
- [ ] Add mutations (updateProfile, followUser, unfollowUser)
- [ ] Test mutations in GraphQL playground

### Frontend:
- [ ] Create EditProfile component
- [ ] Create UserProfile page (view other users)
- [ ] Add Follow/Unfollow button
- [ ] Update ProfilePicture to sync across users
- [ ] Add bio, DOB, location fields
- [ ] Create Followers/Following lists

---

## 🚀 Quick Start

### ✅ Phase 1 Complete!

You can now:
- Click on any username in posts/comments to view their profile
- See user statistics (posts, likes, shares)
- View user's post history
- Navigate to `/user/:username` route

### 🔨 Next Steps: Implementing Phase 2 & 3

**Phase 2: Update Backend GraphQL Schema**

1. **Update your Render build command** (if not done already):
   - Go to Render dashboard → Your service → Settings
   - Update Build Command to: `pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --no-input`
   - This ensures migrations run automatically on deployment

2. **Update `core/schema.py`** with the code provided in Step 1, 2, and 3 above
   - Copy the UserProfileType and FollowType classes
   - Update the UserType class
   - Add the new queries (user, userProfile, followers, following)
   - Add the new mutations (updateProfile, followUser, unfollowUser)

3. **Test in GraphQL Playground**:
   ```bash
   # Local testing
   python manage.py runserver
   # Visit http://localhost:8000/graphql/

   # Test query
   query {
     me {
       id
       username
       profile {
         bio
         location
         followersCount
         followingCount
       }
     }
   }
   ```

4. **Deploy to Render**:
   ```bash
   git add core/schema.py
   git commit -m 'Add profile and follow GraphQL schema'
   git push
   ```

**Phase 3: Frontend Implementation**

After Phase 2 is deployed, you'll need to:

1. Create `frontend/src/graphql/profileQueries.js`:
   ```javascript
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
   ```

2. Create `frontend/src/graphql/profileMutations.js` for updateProfile, followUser, unfollowUser

3. Update UserProfile.jsx to use the new queries and show Follow/Unfollow button

4. Create EditProfile component for editing bio, DOB, location

5. Update ProfilePicture component to upload to server instead of localStorage

**Need help with Phase 3?** Just let me know when Phase 2 is deployed and I'll implement the frontend components!

---

## 📋 Implementation Status

### ✅ Phase 1 Complete:
- [x] Backend models (UserProfile, Follow)
- [x] Database migrations
- [x] UserProfile.jsx page created
- [x] Route added to App.jsx
- [x] Clickable usernames in posts and comments
- [x] View other users' profiles
- [x] Display user statistics

### 📝 Phase 2 TODO (Backend):
- [ ] Update GraphQL schema in core/schema.py
- [ ] Test GraphQL endpoints
- [ ] Deploy to Render

### 📝 Phase 3 TODO (Frontend):
- [ ] Create profile GraphQL queries/mutations
- [ ] Add Follow/Unfollow functionality
- [ ] Create EditProfile component
- [ ] Add bio, DOB, location fields
- [ ] Update ProfilePicture to sync with server
- [ ] Create Followers/Following list pages
