Social Media Feed Backend – ProDev BE

A backend service that powers a scalable social media feed with posts, comments, and user interactions.
Built with Django, PostgreSQL, and GraphQL, this project demonstrates real-world backend engineering skills: schema design, efficient querying, interaction tracking, and flexible data fetching using GraphQL.

📌 Project Overview

This backend mimics essential features behind platforms like Instagram, Facebook, or X:

Create posts

Comment on posts

Like / Unlike posts

Share posts

Fetch everything using flexible GraphQL queries

A hosted GraphQL Playground is included for easy testing.

🎯 Goals
Post Management

Create, fetch, and manage posts.

Interaction Management

Handle likes, comments, and shares.

Flexible Querying

GraphQL enables custom, nested, and efficient queries.

Scalability

Uses PostgreSQL indexes, efficient Django querysets, and optimized GraphQL resolvers.

🧰 Tech Stack
Layer	Technology
Backend Framework	Django
Database	PostgreSQL
API Layer	GraphQL (Graphene-Django)
Testing UI	GraphiQL / GraphQL Playground
ORM	Django ORM
📂 Project Structure
social_media_feed/
│
├── social_media_feed/
│   ├── settings.py
│   ├── schema.py
│   ├── urls.py
│   ├── wsgi.py
│
├── feed/
│   ├── models.py
│   ├── schema.py
│   ├── admin.py
│   ├── apps.py
│
├── requirements.txt
├── manage.py
└── README.md

📐 ERD (Entity-Relationship Diagram)
Simple Models-Only Version
erDiagram

    USER ||--o{ POST : "creates"
    USER ||--o{ COMMENT : "writes"
    USER ||--o{ INTERACTION : "performs"

    POST ||--o{ COMMENT : "has"
    POST ||--o{ INTERACTION : "receives"

    USER {
        int id PK
        string username
        string email
    }

    POST {
        int id PK
        int author_id FK
        text content
        int likes_count
        int comments_count
        int shares_count
        datetime created_at
        datetime updated_at
    }

    COMMENT {
        int id PK
        int post_id FK
        int author_id FK
        text content
        datetime created_at
    }

    INTERACTION {
        int id PK
        int post_id FK
        int user_id FK
        enum type  "like | share"
        datetime created_at
    }

🚀 Getting Started
1. Clone the Repository
git clone <your_repo_url>
cd social-feed-backend

2. Create Virtual Environment
python -m venv venv
source venv/bin/activate       # macOS / Linux
venv\Scripts\activate          # Windows

3. Install Dependencies
pip install -r requirements.txt

4. Create PostgreSQL Database
CREATE DATABASE social_feed;

5. Update Database Config in settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'social_feed',
        'USER': 'postgres',
        'PASSWORD': 'postgres',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

6. Run Migrations
python manage.py migrate

7. Start the Server
python manage.py runserver


Local GraphQL UI:
👉 http://127.0.0.1:8000/graphql/

🔍 Example GraphQL Queries
Fetch All Posts
query {
  posts(first: 10) {
    id
    content
    likesCount
    commentsCount
    author {
      username
    }
  }
}

Fetch Single Post
query {
  post(id: 1) {
    id
    content
    comments {
      content
      author { username }
    }
  }
}

✏️ Example Mutations
Create Post
mutation {
  createPost(content: "Hello World") {
    post {
      id
      content
    }
  }
}

Create Comment
mutation {
  createComment(postId: 1, content: "Nice!") {
    comment {
      id
      content
    }
  }
}

Like / Unlike
mutation {
  toggleLike(postId: 1) {
    liked
    post {
      likesCount
    }
  }
}

Share Post
mutation {
  sharePost(postId: 1) {
    post {
      sharesCount
    }
  }
}

📈 Performance Optimizations

select_related() on foreign keys

prefetch_related() on related lists

Indexed fields for:

post_id

user_id

created_at

type

Pre-computed counters for likes, comments, shares (avoids expensive COUNT queries)

📄 Commit Workflow
feat: set up Django project with PostgreSQL
feat: create models for posts, comments, and interactions
feat: implement GraphQL API for querying posts and interactions
feat: integrate and publish GraphQL Playground
perf: optimize database queries for interactions
docs: update README with API usage

🙌 Contributing

Pull requests are welcome.
Please open an issue to discuss proposed improvements.

📜 License

This project is provided for academic and professional development use.
