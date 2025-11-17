from django.contrib import admin
from .models import Post, Comment, Interaction

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
