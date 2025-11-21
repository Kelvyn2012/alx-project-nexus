import graphene
from graphene_django import DjangoObjectType
from django.contrib.auth import get_user_model
from django.db.models import Q
from graphql_jwt.decorators import login_required
import graphql_jwt
from graphql_jwt.shortcuts import get_token, create_refresh_token
from .models import Post, Comment, Interaction

User = get_user_model()


# Define GraphQL types
class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ("id", "username", "email", "date_joined")


class PostType(DjangoObjectType):
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
            "comments",
        )


class CommentType(DjangoObjectType):
    class Meta:
        model = Comment
        fields = ("id", "post", "author", "content", "created_at")


class InteractionType(DjangoObjectType):
    class Meta:
        model = Interaction
        fields = ("id", "user", "post", "type", "created_at")


# Queries
class Query(graphene.ObjectType):
    me = graphene.Field(UserType)
    posts = graphene.List(
        PostType,
        search=graphene.String(required=False),
        first=graphene.Int(required=False),
        skip=graphene.Int(required=False),
    )
    post = graphene.Field(PostType, id=graphene.Int(required=True))
    interactions = graphene.List(
        InteractionType,
        post_id=graphene.Int(required=False),
        user_id=graphene.Int(required=False)
    )

    @login_required
    def resolve_me(self, info):
        """Get current authenticated user"""
        return info.context.user

    def resolve_posts(self, info, search=None, first=None, skip=None, **kwargs):
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
        try:
            return Post.objects.select_related("author").prefetch_related("comments").get(pk=id)
        except Post.DoesNotExist:
            return None

    def resolve_interactions(self, info, post_id=None, user_id=None, **kwargs):
        qs = Interaction.objects.all().select_related("user", "post")
        if post_id:
            qs = qs.filter(post_id=post_id)
        if user_id:
            qs = qs.filter(user_id=user_id)
        return qs


# Auth Mutations
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


# Custom login mutation with refresh token
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


# Post Mutations
class CreatePost(graphene.Mutation):
    class Arguments:
        content = graphene.String(required=True)

    post = graphene.Field(PostType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    @classmethod
    @login_required
    def mutate(cls, root, info, content):
        user = info.context.user

        try:
            post = Post.objects.create(author=user, content=content)
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


# All Mutations
class Mutation(graphene.ObjectType):
    # Authentication
    register = RegisterUser.Field()
    token_auth = ObtainJSONWebTokenWithRefresh.Field()  # Updated to include refresh token
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
    revoke_token = graphql_jwt.Revoke.Field()
    
    # Post actions
    create_post = CreatePost.Field()
    create_comment = CreateComment.Field()
    toggle_like = ToggleLike.Field()
    share_post = SharePost.Field()


# Schema
schema = graphene.Schema(query=Query, mutation=Mutation)