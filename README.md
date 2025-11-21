Social Media Feed API-ProDev Baackend

A full-featured social media feed backend API built with Django, GraphQL, and PostgreSQL. This API powers a Twitter/Instagram-like social feed where users can create posts, comment, like, and share content.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Future Enhancements](#future-enhancements)

---

## 🎯 Overview

**Social Media Feed API** is a GraphQL-powered backend service that provides all the essential features for a social media platform. Users can register, authenticate, create posts, engage with content through likes and shares, and participate in discussions through comments.

### What This Project Does

- ✅ User registration and JWT-based authentication
- ✅ Create, read, and search posts
- ✅ Like and unlike posts
- ✅ Share posts with others
- ✅ Comment on posts
- ✅ Track engagement metrics (likes, shares, comments counts)
- ✅ Secure API with token-based authentication
- ✅ Optimized database queries for performance

### Live Demo

- **Production URL**: [https://alx-project-nexus-vetk.onrender.com/graphql/](https://alx-project-nexus-vetk.onrender.com/graphql/)
- **GraphQL Playground**: Available at the production URL

---

## ✨ Features

### Core Functionality

| Feature | Description |
|---------|-------------|
| **User Authentication** | JWT-based registration, login, and token refresh |
| **Post Management** | Create and view posts with rich content |
| **Engagement System** | Like/unlike posts with toggle functionality |
| **Sharing** | Share posts to increase visibility |
| **Comments** | Multi-level discussions on posts |
| **Search** | Search posts by content or author |
| **Pagination** | Efficient data loading with skip/first parameters |
| **Real-time Counters** | Denormalized counters for instant metrics |

### Technical Features

- **GraphQL API**: Modern, flexible API with single endpoint
- **JWT Authentication**: Secure, stateless authentication
- **Database Optimization**: Eager loading, select_related, prefetch_related
- **Error Handling**: Comprehensive error messages
- **Data Validation**: Input validation on all mutations
- **Scalable Architecture**: Designed for growth

---

## 🛠 Technology Stack

### Backend

- **Framework**: Django 5.2
- **API**: GraphQL (Graphene-Django)
- **Database**: PostgreSQL (Production) / SQLite (Development)
- **Authentication**: django-graphql-jwt
- **Server**: Gunicorn (Production)

### DevOps

- **Hosting**: Render.com
- **Static Files**: WhiteNoise
- **Environment Management**: python-dotenv
- **Version Control**: Git/GitHub

### Dependencies
```
Django==5.2
graphene-django
django-graphql-jwt
PyJWT
psycopg2-binary
dj-database-url
python-dotenv
whitenoise
gunicorn
```

---

## 🚀 Installation

### Prerequisites

- Python 3.10 or higher
- pip (Python package manager)
- PostgreSQL (optional, for local production-like setup)
- Git

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/social-media-feed.git
cd social-media-feed
```

### Step 2: Create Virtual Environment
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Environment Configuration

Create a `.env` file in the project root:
```env
SECRET_KEY=your-secret-key-here-generate-a-strong-one
DEBUG=True
POSTGRES_DB=social_feed
POSTGRES_USER=postgres
POSTGRES_PASSWORD=
DB_HOST=localhost
DB_PORT=5432
```

Generate a secret key:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### Step 5: Database Setup
```bash
# Run migrations
python manage.py migrate

# Create superuser (admin)
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

### Step 6: Access the Application

- **GraphQL Playground**: http://localhost:8000/graphql/
- **Admin Panel**: http://localhost:8000/admin/

---

## 📚 API Documentation

### Base URL

- **Local**: `http://localhost:8000/graphql/`
- **Production**: `https://alx-project-nexus-vetk.onrender.com/graphql/`

### Quick Start Example
```graphql
# 1. Register a new user
mutation {
  register(
    username: "johndoe"
    email: "john@example.com"
    password: "securepassword123"
  ) {
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

# 2. Create a post (add token to headers first)
mutation {
  createPost(content: "Hello World! This is my first post.") {
    post {
      id
      content
      author {
        username
      }
      createdAt
    }
    success
    errors
  }
}

# 3. Get all posts
query {
  posts {
    id
    content
    author {
      username
    }
    likesCount
    commentsCount
    sharesCount
    createdAt
  }
}
```

### Authentication Endpoints

#### Register User
```graphql
mutation {
  register(
    username: "johndoe"
    email: "john@example.com"
    password: "securepass123"
  ) {
    user { id username email }
    token
    refreshToken
    success
    errors
  }
}
```

#### Login
```graphql
mutation {
  tokenAuth(username: "johndoe", password: "securepass123") {
    token
    refreshToken
    user { id username }
    payload
  }
}
```

#### Refresh Token
```graphql
mutation {
  refreshToken(refreshToken: "your_refresh_token") {
    token
    payload
    refreshToken
  }
}
```

#### Get Current User
```graphql
query {
  me {
    id
    username
    email
    dateJoined
  }
}
```

### Post Endpoints

#### Create Post (Authenticated)
```graphql
mutation {
  createPost(content: "Your post content here") {
    post {
      id
      content
      author { username }
      createdAt
      likesCount
      commentsCount
      sharesCount
    }
    success
    errors
  }
}
```

#### Get All Posts
```graphql
query {
  posts {
    id
    content
    author {
      id
      username
    }
    createdAt
    updatedAt
    likesCount
    commentsCount
    sharesCount
  }
}
```

#### Search Posts
```graphql
query {
  posts(search: "GraphQL") {
    id
    content
    author { username }
  }
}
```

#### Pagination
```graphql
query {
  posts(first: 10, skip: 0) {
    id
    content
  }
}
```

#### Get Single Post
```graphql
query {
  post(id: 1) {
    id
    content
    author {
      username
      email
    }
    comments {
      id
      content
      author { username }
      createdAt
    }
    likesCount
    commentsCount
    sharesCount
  }
}
```

### Interaction Endpoints

#### Like/Unlike Post (Authenticated)
```graphql
mutation {
  toggleLike(postId: 1) {
    post {
      id
      likesCount
    }
    liked
    success
    errors
  }
}
```

#### Share Post (Authenticated)
```graphql
mutation {
  sharePost(postId: 1) {
    post {
      id
      sharesCount
    }
    success
    errors
  }
}
```

#### Create Comment (Authenticated)
```graphql
mutation {
  createComment(postId: 1, content: "Great post!") {
    comment {
      id
      content
      author { username }
      createdAt
    }
    success
    errors
  }
}
```

#### Get Interactions
```graphql
# All interactions
query {
  interactions {
    id
    user { username }
    post { id content }
    type
    createdAt
  }
}

# Interactions for a specific post
query {
  interactions(postId: 1) {
    id
    user { username }
    type
    createdAt
  }
}

# Interactions by a specific user
query {
  interactions(userId: 1) {
    id
    post { id content }
    type
    createdAt
  }
}
```

---

## 🔐 Authentication

This API uses JWT (JSON Web Tokens) for authentication.

### How to Authenticate Requests

1. **Register or Login** to get a token
2. **Add the token to request headers**:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

3. **In GraphiQL**, add to HTTP Headers section:
```json
{
  "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Token Lifecycle

- **Access Token**: Valid for 7 days
- **Refresh Token**: Valid for 30 days
- Use refresh token to get new access tokens without re-logging in

### Protected Endpoints

These mutations require authentication:
- `createPost`
- `createComment`
- `toggleLike`
- `sharePost`
- `me` query

---

## 📁 Project Structure
```
social-media-feed/
│
├── social_media_feed/          # Project settings
│   ├── __init__.py
│   ├── settings.py             # Django settings
│   ├── urls.py                 # URL routing
│   ├── wsgi.py                 # WSGI config
│   └── schema.py               # GraphQL schema aggregator
│
├── core/                       # Main application
│   ├── migrations/             # Database migrations
│   ├── __init__.py
│   ├── models.py               # Database models
│   ├── schema.py               # GraphQL schema
│   ├── admin.py                # Admin configuration
│   └── apps.py
│
├── staticfiles/                # Collected static files
├── venv/                       # Virtual environment
├── .env                        # Environment variables
├── .gitignore                  # Git ignore rules
├── requirements.txt            # Python dependencies
├── manage.py                   # Django management script
├── build.sh                    # Render build script
└── README.md                   # This file
```

---

## 🗄 Database Schema

### Entity Relationship Diagram
```
┌─────────────────────┐
│       User          │
│ ─────────────────── │
│ PK  id              │
│     username        │
│     email           │
│     password        │
│     date_joined     │
└──────────┬──────────┘
           │
           │ 1:N (creates)
           │
           ▼
┌─────────────────────┐         1:N        ┌─────────────────────┐
│       Post          │────────────────────│     Comment         │
│ ─────────────────── │      (has)         │ ─────────────────── │
│ PK  id              │                    │ PK  id              │
│ FK  author_id       │                    │ FK  post_id         │
│     content         │                    │ FK  author_id       │
│     created_at      │                    │     content         │
│     updated_at      │                    │     created_at      │
│     likes_count     │                    └─────────────────────┘
│     comments_count  │
│     shares_count    │
└──────────┬──────────┘
           │
           │ 1:N (has)
           │
           ▼
┌─────────────────────┐
│    Interaction      │
│ ─────────────────── │
│ PK  id              │
│ FK  user_id         │
│ FK  post_id         │
│     type            │ ← ENUM('like','share')
│     created_at      │
│ UNIQUE(user,post,   │
│        type)        │
└─────────────────────┘
```

### Models

#### User (Django's built-in)
- Handles authentication
- Stores user credentials
- Related to posts, comments, and interactions

#### Post
```python
- id: Primary Key
- author: ForeignKey → User
- content: TextField
- created_at: DateTime (auto)
- updated_at: DateTime (auto)
- likes_count: Integer (denormalized)
- comments_count: Integer (denormalized)
- shares_count: Integer (denormalized)
```

#### Comment
```python
- id: Primary Key
- post: ForeignKey → Post
- author: ForeignKey → User
- content: TextField
- created_at: DateTime (auto)
```

#### Interaction
```python
- id: Primary Key
- user: ForeignKey → User
- post: ForeignKey → Post
- type: Enum ('like', 'share')
- created_at: DateTime (auto)
- Unique constraint: (user, post, type)
```

---

## 🌐 Deployment

### Deployed on Render.com

#### Build Configuration

**Build Command:**
```bash
./build.sh
```

**Start Command:**
```bash
gunicorn social_media_feed.wsgi:application
```

#### Environment Variables (Production)

Set these in Render dashboard:
```
DEBUG=False
SECRET_KEY=your-production-secret-key
DATABASE_URL=postgresql://...  (auto-set by Render)
PYTHON_VERSION=3.13.0
```

#### build.sh Script
```bash
#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate
```

### Deploy Your Own Instance

1. Fork this repository
2. Create account on [Render.com](https://render.com)
3. Create a new PostgreSQL database
4. Create a new Web Service
5. Connect your GitHub repository
6. Configure environment variables
7. Deploy!

---

## 🔮 Future Enhancements

### Planned Features

- [ ] **User Profiles**: Extended user information and bios
- [ ] **Follow System**: Users can follow/unfollow each other
- [ ] **Feed Algorithm**: Personalized content feed
- [ ] **Media Support**: Image and video uploads
- [ ] **Notifications**: Real-time notifications for interactions
- [ ] **Direct Messaging**: Private messaging between users
- [ ] **Hashtags**: Post categorization and discovery
- [ ] **Trending**: Discover popular posts and topics
- [ ] **Moderation**: Report and block features
- [ ] **Analytics**: User engagement analytics dashboard

### Technical Improvements

- [ ] **Caching**: Redis for performance optimization
- [ ] **Rate Limiting**: API rate limiting per user
- [ ] **WebSockets**: Real-time updates with subscriptions
- [ ] **ElasticSearch**: Advanced full-text search
- [ ] **CDN**: Content delivery for media files
- [ ] **Testing**: Comprehensive test coverage
- [ ] **CI/CD**: Automated testing and deployment
- [ ] **API Versioning**: Version management strategy

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com
- LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)

---

## 🙏 Acknowledgments

- Django Documentation
- Graphene-Django Documentation
- ALX Africa Backend Development Program
- The open-source community

---

## 📞 Support

For support, email your.email@example.com or open an issue in the GitHub repository.

---

## 🔄 Version History

- **v1.0.0** (2025-11-21)
  - Initial release
  - User authentication with JWT
  - Post creation and management
  - Like/share/comment functionality
  - GraphQL API
  - Deployed to Render.com

---

**Built with ❤️ using Django and GraphQL**
```

## Additional Files to Include

### 1. Create `LICENSE` file (MIT License):
```
MIT License

Copyright (c) 2025 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### 2. Create `.gitignore`:
```
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
venv/
env/
ENV/

# Django
*.log
local_settings.py
db.sqlite3
db.sqlite3-journal
staticfiles/
media/

# Environment
.env
.env.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db
```

### 3. Update `requirements.txt`:
```
Django==5.2
graphene-django==3.0.0
django-graphql-jwt==0.4.0
PyJWT==2.8.0
psycopg2-binary==2.9.9
dj-database-url==2.1.0
python-dotenv==1.0.0
whitenoise==6.6.0
gunicorn==21.2.0
