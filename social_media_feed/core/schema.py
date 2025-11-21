import graphene
from graphene_django import DjangoObjectType
from django.contrib.auth import get_user_model
from django.db.models import Q  
from .models import Post, Comment, Interaction

User = get_user_model()

# Define GraphQL types for Post, Comment, and Interaction
class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ("id", "username", "email")


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


# Queries for fetching posts and interactions
class Query(graphene.ObjectType):
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

    def resolve_posts(self, info, search=None, first=None, skip=None, **kwargs):
        qs = Post.objects.all().select_related("author").prefetch_related("comments")

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


# Mutations for creating posts, comments, and toggling interactions (likes and shares)
class CreatePost(graphene.Mutation):
    class Arguments:
        content = graphene.String(required=True)

    post = graphene.Field(PostType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    @classmethod
    def mutate(cls, root, info, content):
        user = info.context.user
        if user.is_anonymous:
            user = User.objects.first()  # Use the first user for now (for demo purposes)

        if not user:
            return CreatePost(post=None, success=False, errors=["No user found"])

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
    def mutate(cls, root, info, post_id, content):
        user = info.context.user
        if user.is_anonymous:
            user = User.objects.first()  # Use the first user for now (for demo purposes)

        if not user:
            return CreateComment(comment=None, success=False, errors=["No user found"])

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
    def mutate(cls, root, info, post_id):
        user = info.context.user
        if user.is_anonymous:
            user = User.objects.first()  # Use the first user for now (for demo purposes)

        if not user:
            return ToggleLike(post=None, liked=False, success=False, errors=["No user found"])

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
    def mutate(cls, root, info, post_id):
        user = info.context.user
        if user.is_anonymous:
            user = User.objects.first()  # Use the first user for now (for demo purposes)

        if not user:
            return SharePost(post=None, success=False, errors=["No user found"])

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


# Mutation for all actions
class Mutation(graphene.ObjectType):
    create_post = CreatePost.Field()
    create_comment = CreateComment.Field()
    toggle_like = ToggleLike.Field()
    share_post = SharePost.Field()