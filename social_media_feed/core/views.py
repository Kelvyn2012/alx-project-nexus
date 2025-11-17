from django.shortcuts import render

def home(request):
    context = {
        "title": "Welcome to Social Media Feed",
        "message": "This is the backend for the social media feed project."
    }
    return render(request, "core/home.html", context)
