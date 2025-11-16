Social_Media_Feed Backend – ProDev BE

A backend system for powering a scalable social media feed with posts, comments, and user interactions.
This project demonstrates how backend engineers can design flexible GraphQL APIs, manage heavy user activity, optimize database queries, and build a real-world social platform backend using Django, PostgreSQL, and GraphQL.

📌 Project Overview

This backend provides the core features required for a social media feed:

Users can create posts.

Other users can like, comment, and share these posts.

The feed can be queried flexibly using GraphQL.

The system is designed to handle high-traffic interactions efficiently.

A hosted GraphQL Playground is included for easy testing of the API.

🎯 Goals

Post Management – Create, fetch, and manage posts.

Interaction Management – Handle likes, comments, and shares.

Flexible Querying – Use GraphQL to allow custom, nested, and efficient queries.

Scalability – Use PostgreSQL indexes, Django Query optimization, and GraphQL resolvers that scale.

🧰 Tech Stack
Layer Technology
Backend Framework Django
Database PostgreSQL
API Query Language GraphQL (Graphene Django)
Testing Interface GraphiQL / GraphQL Playground
ORM Django ORM

📂 Project Structure

social_media_feed/
│
├── social_media_feed/
│ ├── settings.py
│ ├── schema.py
│ ├── urls.py
│ └── wsgi.py
│
├── core/
│ ├── models.py
│ ├── schema.py
│ ├── admin.py
│ └── apps.py
│
├── requirements.txt
├── manage.py
└── README.md

⚙️ Features

1. GraphQL APIs

Query posts, comments, and user interactions.

Fetch nested data (e.g., post → comments → author).

Mutations for creating posts, commenting, liking, and sharing.

2. Interaction Management

Users can like/unlike posts.

Users can add comments.

Shares are tracked.

Interaction counters are stored for performance.

3. Scalable Schema Design

Database indexes for heavy-query fields.

Efficient queryset usage (select_related, prefetch_related).

Pagination support (via first and skip arguments).

4. Hosted Playground

Access to a public GraphQL Playground to test all API features.

🚀 Getting Started

1. Clone the Repository
   git clone <your_repo_url>
   cd social-feed-backend

2. Create Virtual Environment
   python -m venv venv
   source venv/bin/activate # macOS/Linux
   venv\Scripts\activate # Windows

3. Install Dependencies
   pip install -r requirements.txt

4. Set Up PostgreSQL

Create a PostgreSQL database named social_feed.
CREATE DATABASE social_feed;

Update your database credentials in config/settings.py:
DATABASES = {
'default': {
'ENGINE': 'django.db.backends.postgresql',
'NAME': 'social_feed',
'USER': 'postgres',
'PASSWORD': 'postgres',
'HOST': 'localhost',
'PORT': '5432',
}
} 5. Run Migrations
python manage.py makemigrations
python manage.py migrate

6. Run the Server
   python manage.py runserver

Access the local GraphQL interface:
👉 http://127.0.0.1:8000/graphql/

📌 GraphQL Usage
Sample Queries
Fetch all posts
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

Fetch a single post
query {
post(id: 1) {
id
content
comments {
content
author {
username
}
}
}
}

Sample Mutations
Create a post
mutation {
createPost(content: "Hello GraphQL!") {
post {
id
content
}
}
}

Add a comment
mutation {
createComment(postId: 1, content: "Nice post!") {
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

Share a post
mutation {
sharePost(postId: 1) {
post {
sharesCount
}
}
}

🌍 Deployment

The project is set up for deployment using:

Gunicorn as the WSGI server

Render, Railway, or Fly.io for hosting

Procfile:

web: gunicorn config.wsgi:application --log-file -

Update ALLOWED_HOSTS in settings.py when you get your hosting URL.

📈 Performance Optimizations

Indexed fields such as:

created_at

author

post, type (for interactions)

Optimized GraphQL resolvers:

select_related for foreign keys

prefetch_related for reverse relations

Counter fields for:

likes

comments

shares
(Prevents expensive COUNT() queries)

🧪 Testing

Use the GraphQL Playground to test queries and mutations.

Local:
👉 http://127.0.0.1:8000/graphql/

Hosted version (example):
👉 https://your-app-name.onrender.com/graphql/

📘 Git Commit Workflow

Recommended commit structure for this project:

feat: set up Django project with PostgreSQL
feat: create models for posts, comments, and interactions
feat: implement GraphQL API for querying posts and interactions
feat: integrate and publish GraphQL Playground
perf: optimize database queries for interactions
docs: update README with API usage

🙌 Contributing

Feel free to fork this project and build on it.
Pull requests and suggestions are welcome.

📄 License

This project is for educational and professional development purposes.
