import graphene
from graphene_django import DjangoObjectType
from django.contrib.auth import get_user_model
from django.db.models import Q
from graphql_jwt.decorators import login_required
import graphql_jwt
from graphql_jwt.shortcuts import get_token, create_refresh_token
from .models import Post, Comment, Interaction, UserProfile, Follow, PasswordResetToken
from django.core.mail import send_mail
from django.conf import settings
from google.oauth2 import id_token
from google.auth.transport import requests
import os

User = get_user_model()


# ============================================
# GraphQL Type Definitions
# ============================================

class UserProfileType(DjangoObjectType):
    class Meta:
        model = UserProfile
        fields = ("id", "user", "bio", "date_of_birth", "location",
                  "profile_picture", "followers_count", "following_count",
                  "created_at", "updated_at")


class UserType(DjangoObjectType):
    profile = graphene.Field(UserProfileType)
    is_following = graphene.Boolean()

    class Meta:
        model = User
        fields = ("id", "username", "email", "date_joined")

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


class FollowType(DjangoObjectType):
    class Meta:
        model = Follow
        fields = ("id", "follower", "following", "created_at")


class PostType(DjangoObjectType):
    quoted_post = graphene.Field(lambda: PostType)

    class Meta:
        model = Post
        fields = (
            "id",
            "author",
            "content",
            "created_at",
            "updated_at",
            "likes_count",
            "comments_count",
            "shares_count",
            "quotes_count",
            "reposts_count",
            "comments",
            "quoted_post",
            "is_repost",
        )

    def resolve_quoted_post(self, info):
        return self.quoted_post


class CommentType(DjangoObjectType):
    class Meta:
        model = Comment
        fields = ("id", "post", "author", "content", "created_at")


class InteractionType(DjangoObjectType):
    class Meta:
        model = Interaction
        fields = ("id", "user", "post", "type", "created_at")


# ============================================
# Queries
# ============================================

class Query(graphene.ObjectType):
    # User queries
    me = graphene.Field(UserType)
    user = graphene.Field(UserType, username=graphene.String(required=True))
    user_profile = graphene.Field(UserProfileType, user_id=graphene.Int(required=True))
    followers = graphene.List(UserType, user_id=graphene.Int(required=True))
    following = graphene.List(UserType, user_id=graphene.Int(required=True))
    
    # Post queries
    posts = graphene.List(
        PostType,
        search=graphene.String(required=False),
        first=graphene.Int(required=False),
        skip=graphene.Int(required=False),
    )
    post = graphene.Field(PostType, id=graphene.Int(required=True))
    
    # Interaction queries
    interactions = graphene.List(
        InteractionType,
        post_id=graphene.Int(required=False),
        user_id=graphene.Int(required=False)
    )

    # User query resolvers
    @login_required
    def resolve_me(self, info):
        """Get current authenticated user"""
        return info.context.user

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
        """Get user's followers"""
        follows = Follow.objects.filter(following_id=user_id).select_related('follower')
        return [f.follower for f in follows]

    def resolve_following(self, info, user_id):
        """Get users that user is following"""
        follows = Follow.objects.filter(follower_id=user_id).select_related('following')
        return [f.following for f in follows]

    # Post query resolvers
    def resolve_posts(self, info, search=None, first=None, skip=None, **kwargs):
        """Get all posts with optional search and pagination"""
        qs = Post.objects.all().select_related("author").prefetch_related("comments").order_by('-created_at')

        if search:
            qs = qs.filter(
                Q(content__icontains=search) |
                Q(author__username__icontains=search)
            )

        if skip:
            qs = qs[skip:]
        if first:
            qs = qs[:first]

        return qs

    def resolve_post(self, info, id):
        """Get single post by ID"""
        try:
            return Post.objects.select_related("author").prefetch_related("comments").get(pk=id)
        except Post.DoesNotExist:
            return None

    # Interaction query resolvers
    def resolve_interactions(self, info, post_id=None, user_id=None, **kwargs):
        """Get interactions with optional filters"""
        qs = Interaction.objects.all().select_related("user", "post")
        if post_id:
            qs = qs.filter(post_id=post_id)
        if user_id:
            qs = qs.filter(user_id=user_id)
        return qs


# ============================================
# Authentication Mutations
# ============================================

class RegisterUser(graphene.Mutation):
    class Arguments:
        username = graphene.String(required=True)
        email = graphene.String(required=True)
        password = graphene.String(required=True)

    user = graphene.Field(UserType)
    token = graphene.String()
    refresh_token = graphene.String()
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    @classmethod
    def mutate(cls, root, info, username, email, password):
        try:
            # Check if user already exists
            if User.objects.filter(username=username).exists():
                return RegisterUser(
                    user=None, 
                    token=None, 
                    refresh_token=None, 
                    success=False, 
                    errors=["Username already exists"]
                )
            
            if User.objects.filter(email=email).exists():
                return RegisterUser(
                    user=None, 
                    token=None, 
                    refresh_token=None, 
                    success=False, 
                    errors=["Email already exists"]
                )

            # Create user
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password
            )
            
            # Generate tokens
            token = get_token(user)
            refresh_token = create_refresh_token(user)
            
            return RegisterUser(
                user=user, 
                token=token, 
                refresh_token=refresh_token, 
                success=True, 
                errors=None
            )
        except Exception as e:
            return RegisterUser(
                user=None, 
                token=None, 
                refresh_token=None, 
                success=False, 
                errors=[str(e)]
            )


class ObtainJSONWebTokenWithRefresh(graphql_jwt.JSONWebTokenMutation):
    """Custom token mutation that includes refresh token"""
    user = graphene.Field(UserType)
    refresh_token = graphene.String()

    @classmethod
    def resolve(cls, root, info, **kwargs):
        return cls(
            user=info.context.user,
            refresh_token=create_refresh_token(info.context.user)
        )


class RequestPasswordReset(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)

    success = graphene.Boolean()
    message = graphene.String()
    errors = graphene.List(graphene.String)

    @classmethod
    def mutate(cls, root, info, email):
        try:
            user = User.objects.get(email=email)

            # Create password reset token
            reset_token = PasswordResetToken.objects.create(user=user)

            # Send email (in production, use a proper email template)
            reset_link = f"{os.getenv('FRONTEND_URL', 'http://localhost:5173')}/reset-password?token={reset_token.token}"

            send_mail(
                subject='Password Reset Request',
                message=f'Click the link below to reset your password:\n\n{reset_link}\n\nThis link will expire in 24 hours.',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )

            return RequestPasswordReset(
                success=True,
                message="Password reset email sent successfully",
                errors=None
            )
        except User.DoesNotExist:
            # For security, don't reveal if email exists
            return RequestPasswordReset(
                success=True,
                message="If an account with that email exists, a password reset link has been sent",
                errors=None
            )
        except Exception as e:
            return RequestPasswordReset(
                success=False,
                message="Failed to send password reset email",
                errors=[str(e)]
            )


class ResetPassword(graphene.Mutation):
    class Arguments:
        token = graphene.String(required=True)
        new_password = graphene.String(required=True)

    success = graphene.Boolean()
    message = graphene.String()
    errors = graphene.List(graphene.String)

    @classmethod
    def mutate(cls, root, info, token, new_password):
        try:
            reset_token = PasswordResetToken.objects.get(token=token)

            if not reset_token.is_valid():
                return ResetPassword(
                    success=False,
                    message="Invalid or expired token",
                    errors=["Token is invalid or has expired"]
                )

            # Reset password
            user = reset_token.user
            user.set_password(new_password)
            user.save()

            # Mark token as used
            reset_token.is_used = True
            reset_token.save()

            return ResetPassword(
                success=True,
                message="Password reset successful",
                errors=None
            )
        except PasswordResetToken.DoesNotExist:
            return ResetPassword(
                success=False,
                message="Invalid token",
                errors=["Invalid token"]
            )
        except Exception as e:
            return ResetPassword(
                success=False,
                message="Failed to reset password",
                errors=[str(e)]
            )


class GoogleSignIn(graphene.Mutation):
    class Arguments:
        token = graphene.String(required=True)

    user = graphene.Field(UserType)
    token = graphene.String()
    refresh_token = graphene.String()
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    @classmethod
    def mutate(cls, root, info, token):
        try:
            # Verify the Google token
            client_id = os.getenv('GOOGLE_CLIENT_ID')
            if not client_id:
                return GoogleSignIn(
                    user=None,
                    token=None,
                    refresh_token=None,
                    success=False,
                    errors=["Google OAuth is not configured"]
                )

            idinfo = id_token.verify_oauth2_token(
                token,
                requests.Request(),
                client_id
            )

            # Get user info from Google
            email = idinfo.get('email')
            given_name = idinfo.get('given_name', '')
            family_name = idinfo.get('family_name', '')
            picture = idinfo.get('picture', '')

            if not email:
                return GoogleSignIn(
                    user=None,
                    token=None,
                    refresh_token=None,
                    success=False,
                    errors=["Email not provided by Google"]
                )

            # Check if user exists
            user = User.objects.filter(email=email).first()

            if not user:
                # Create new user
                username = email.split('@')[0]
                base_username = username
                counter = 1

                # Ensure unique username
                while User.objects.filter(username=username).exists():
                    username = f"{base_username}{counter}"
                    counter += 1

                user = User.objects.create_user(
                    username=username,
                    email=email,
                    first_name=given_name,
                    last_name=family_name
                )

                # Create profile with Google picture
                UserProfile.objects.create(
                    user=user,
                    profile_picture=picture
                )

            # Generate JWT tokens
            jwt_token = get_token(user)
            refresh = create_refresh_token(user)

            return GoogleSignIn(
                user=user,
                token=jwt_token,
                refresh_token=refresh,
                success=True,
                errors=None
            )

        except ValueError as e:
            return GoogleSignIn(
                user=None,
                token=None,
                refresh_token=None,
                success=False,
                errors=["Invalid Google token"]
            )
        except Exception as e:
            return GoogleSignIn(
                user=None,
                token=None,
                refresh_token=None,
                success=False,
                errors=[str(e)]
            )


# ============================================
# Post Mutations
# ============================================

class CreatePost(graphene.Mutation):
    class Arguments:
        content = graphene.String(required=True)
        quoted_post_id = graphene.Int(required=False)

    post = graphene.Field(PostType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    @classmethod
    @login_required
    def mutate(cls, root, info, content, quoted_post_id=None):
        user = info.context.user

        try:
            quoted_post = None
            if quoted_post_id:
                try:
                    quoted_post = Post.objects.get(pk=quoted_post_id)
                    # Increment quotes count on the quoted post
                    quoted_post.quotes_count += 1
                    quoted_post.save(update_fields=["quotes_count"])
                except Post.DoesNotExist:
                    return CreatePost(post=None, success=False, errors=["Quoted post not found"])

            post = Post.objects.create(
                author=user,
                content=content,
                quoted_post=quoted_post,
                is_repost=False
            )
            return CreatePost(post=post, success=True, errors=None)
        except Exception as e:
            return CreatePost(post=None, success=False, errors=[str(e)])


class CreateComment(graphene.Mutation):
    class Arguments:
        post_id = graphene.Int(required=True)
        content = graphene.String(required=True)

    comment = graphene.Field(CommentType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    @classmethod
    @login_required
    def mutate(cls, root, info, post_id, content):
        user = info.context.user

        try:
            post = Post.objects.get(pk=post_id)
            comment = Comment.objects.create(post=post, author=user, content=content)
            post.comments_count = Comment.objects.filter(post=post).count()
            post.save(update_fields=["comments_count"])

            return CreateComment(comment=comment, success=True, errors=None)
        except Post.DoesNotExist:
            return CreateComment(comment=None, success=False, errors=["Post not found"])
        except Exception as e:
            return CreateComment(comment=None, success=False, errors=[str(e)])


class ToggleLike(graphene.Mutation):
    class Arguments:
        post_id = graphene.Int(required=True)

    post = graphene.Field(PostType)
    liked = graphene.Boolean()
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    @classmethod
    @login_required
    def mutate(cls, root, info, post_id):
        user = info.context.user

        try:
            post = Post.objects.get(pk=post_id)

            interaction, created = Interaction.objects.get_or_create(
                user=user,
                post=post,
                type=Interaction.LIKE,
            )

            if not created:
                interaction.delete()
                liked = False
            else:
                liked = True

            post.likes_count = Interaction.objects.filter(
                post=post, type=Interaction.LIKE
            ).count()
            post.save(update_fields=["likes_count"])

            return ToggleLike(post=post, liked=liked, success=True, errors=None)
        except Post.DoesNotExist:
            return ToggleLike(post=None, liked=False, success=False, errors=["Post not found"])
        except Exception as e:
            return ToggleLike(post=None, liked=False, success=False, errors=[str(e)])


class SharePost(graphene.Mutation):
    class Arguments:
        post_id = graphene.Int(required=True)

    post = graphene.Field(PostType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    @classmethod
    @login_required
    def mutate(cls, root, info, post_id):
        user = info.context.user

        try:
            post = Post.objects.get(pk=post_id)

            Interaction.objects.create(
                user=user,
                post=post,
                type=Interaction.SHARE
            )

            post.shares_count = Interaction.objects.filter(
                post=post, type=Interaction.SHARE
            ).count()
            post.save(update_fields=["shares_count"])

            return SharePost(post=post, success=True, errors=None)
        except Post.DoesNotExist:
            return SharePost(post=None, success=False, errors=["Post not found"])
        except Exception as e:
            return SharePost(post=None, success=False, errors=[str(e)])


class RepostPost(graphene.Mutation):
    class Arguments:
        post_id = graphene.Int(required=True)

    post = graphene.Field(PostType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    @classmethod
    @login_required
    def mutate(cls, root, info, post_id):
        user = info.context.user

        try:
            original_post = Post.objects.get(pk=post_id)

            # Check if user already reposted this
            existing_repost = Post.objects.filter(
                author=user,
                quoted_post=original_post,
                is_repost=True
            ).first()

            if existing_repost:
                # Toggle: delete the repost
                existing_repost.delete()
                original_post.reposts_count = max(0, original_post.reposts_count - 1)
                original_post.save(update_fields=["reposts_count"])
                return RepostPost(post=original_post, success=True, errors=None)

            # Create repost (no content, just reference)
            repost = Post.objects.create(
                author=user,
                content="",  # Empty content for pure reposts
                quoted_post=original_post,
                is_repost=True
            )

            # Increment repost count on original
            original_post.reposts_count += 1
            original_post.save(update_fields=["reposts_count"])

            return RepostPost(post=repost, success=True, errors=None)
        except Post.DoesNotExist:
            return RepostPost(post=None, success=False, errors=["Post not found"])
        except Exception as e:
            return RepostPost(post=None, success=False, errors=[str(e)])


# ============================================
# Profile Mutations
# ============================================

class UpdateProfile(graphene.Mutation):
    class Arguments:
        bio = graphene.String()
        date_of_birth = graphene.Date()
        location = graphene.String()
        profile_picture = graphene.String()

    success = graphene.Boolean()
    errors = graphene.List(graphene.String)
    profile = graphene.Field(UserProfileType)

    @classmethod
    @login_required
    def mutate(cls, root, info, **kwargs):
        user = info.context.user
        profile, created = UserProfile.objects.get_or_create(user=user)

        for key, value in kwargs.items():
            if value is not None:
                setattr(profile, key, value)

        profile.save()
        return UpdateProfile(success=True, profile=profile, errors=None)


# ============================================
# Follow Mutations
# ============================================

class FollowUser(graphene.Mutation):
    class Arguments:
        user_id = graphene.Int(required=True)

    success = graphene.Boolean()
    errors = graphene.List(graphene.String)
    is_following = graphene.Boolean()

    @classmethod
    @login_required
    def mutate(cls, root, info, user_id):
        follower = info.context.user

        if follower.id == user_id:
            return FollowUser(success=False, errors=['Cannot follow yourself'], is_following=False)

        try:
            following = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return FollowUser(success=False, errors=['User not found'], is_following=False)

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

        return FollowUser(success=True, is_following=True, errors=None)


class UnfollowUser(graphene.Mutation):
    class Arguments:
        user_id = graphene.Int(required=True)

    success = graphene.Boolean()
    errors = graphene.List(graphene.String)
    is_following = graphene.Boolean()

    @classmethod
    @login_required
    def mutate(cls, root, info, user_id):
        follower = info.context.user

        try:
            following = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return UnfollowUser(success=False, errors=['User not found'], is_following=True)

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

        return UnfollowUser(success=True, is_following=False, errors=None)


# ============================================
# Mutation Class - Register all mutations here
# ============================================

class Mutation(graphene.ObjectType):
    # Authentication
    register = RegisterUser.Field()
    token_auth = ObtainJSONWebTokenWithRefresh.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
    revoke_token = graphql_jwt.Revoke.Field()

    # Password reset
    request_password_reset = RequestPasswordReset.Field()
    reset_password = ResetPassword.Field()

    # Google OAuth
    google_sign_in = GoogleSignIn.Field()

    # Post actions
    create_post = CreatePost.Field()
    create_comment = CreateComment.Field()
    toggle_like = ToggleLike.Field()
    share_post = SharePost.Field()
    repost_post = RepostPost.Field()

    # Profile actions
    update_profile = UpdateProfile.Field()

    # Follow actions
    follow_user = FollowUser.Field()
    unfollow_user = UnfollowUser.Field()


# ============================================
# Schema Export
# ============================================

schema = graphene.Schema(query=Query, mutation=Mutation)