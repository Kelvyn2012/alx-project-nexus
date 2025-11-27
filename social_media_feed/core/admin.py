from django.contrib import admin
from .models import Post, Comment, Interaction, UserProfile, Follow, PasswordResetToken

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('id', 'author', 'content', 'likes_count', 'comments_count', 'shares_count', 'created_at')
    search_fields = ('author__username', 'content')

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'post', 'author', 'created_at')
    search_fields = ('content', 'author__username')

@admin.register(Interaction)
class InteractionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'post', 'type', 'created_at')
    list_filter = ('type',)

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'bio', 'location', 'followers_count', 'following_count', 'created_at')
    search_fields = ('user__username', 'user__email', 'bio')

@admin.register(Follow)
class FollowAdmin(admin.ModelAdmin):
    list_display = ('id', 'follower', 'following', 'created_at')
    search_fields = ('follower__username', 'following__username')

@admin.register(PasswordResetToken)
class PasswordResetTokenAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'token', 'created_at', 'expires_at', 'is_used')
    list_filter = ('is_used',)
    search_fields = ('user__email', 'user__username', 'token')
    readonly_fields = ('token', 'created_at')
