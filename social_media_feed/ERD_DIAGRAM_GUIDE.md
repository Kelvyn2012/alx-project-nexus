# Entity Relationship Diagram (ERD) - Visual Guide

## 🎨 Create This Diagram for Your Presentation

You can create this using:
- **draw.io** (diagrams.net) - Free, web-based
- **Lucidchart** - Professional diagrams
- **dbdiagram.io** - Database-specific tool
- **PowerPoint/Google Slides** - Built-in shapes

---

## 📊 Complete ERD Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER (Django Built-in)                         │
├─────────────────────────────────────────────────────────────────────────┤
│ PK │ id: Integer                                                         │
│    │ username: String (unique, max_length=150)                          │
│    │ email: String (unique, max_length=254)                             │
│    │ password: String (hashed)                                          │
│    │ first_name: String (max_length=150)                                │
│    │ last_name: String (max_length=150)                                 │
│    │ date_joined: DateTime                                              │
│    │ is_active: Boolean                                                 │
│    │ is_staff: Boolean                                                  │
└─────┬───────────────────────────────────────────────────────────────────┘
      │
      │ 1:1
      ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                              USER PROFILE                                │
├─────────────────────────────────────────────────────────────────────────┤
│ PK │ id: Integer                                                         │
│ FK │ user_id: Integer → User.id (OneToOne, CASCADE)                     │
│    │ bio: Text (max_length=500, nullable)                               │
│    │ date_of_birth: Date (nullable)                                     │
│    │ location: String (max_length=100, nullable)                        │
│    │ profile_picture: Text (Base64 or URL, nullable)                    │
│    │ followers_count: Integer (default=0) 📊 Denormalized               │
│    │ following_count: Integer (default=0) 📊 Denormalized               │
│    │ created_at: DateTime (auto_now_add)                                │
│    │ updated_at: DateTime (auto_now)                                    │
└─────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                                  POST                                    │
├─────────────────────────────────────────────────────────────────────────┤
│ PK │ id: Integer                                                         │
│ FK │ author_id: Integer → User.id (ForeignKey, CASCADE)                 │
│    │ content: Text (required)                                           │
│    │ created_at: DateTime (auto_now_add)                                │
│    │ updated_at: DateTime (auto_now)                                    │
│    │ likes_count: Integer (default=0) 📊 Denormalized                   │
│    │ comments_count: Integer (default=0) 📊 Denormalized                │
│    │ shares_count: Integer (default=0) 📊 Denormalized                  │
│    │                                                                     │
│    │ INDEX: author_id, created_at                                       │
└─────┬───────────────────────────────────────────────────────────────────┘
      │
      │ 1:N
      ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                                COMMENT                                   │
├─────────────────────────────────────────────────────────────────────────┤
│ PK │ id: Integer                                                         │
│ FK │ post_id: Integer → Post.id (ForeignKey, CASCADE)                   │
│ FK │ author_id: Integer → User.id (ForeignKey, CASCADE)                 │
│    │ content: Text (required)                                           │
│    │ created_at: DateTime (auto_now_add)                                │
│    │                                                                     │
│    │ INDEX: post_id, created_at                                         │
└─────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                              INTERACTION                                 │
├─────────────────────────────────────────────────────────────────────────┤
│ PK │ id: Integer                                                         │
│ FK │ user_id: Integer → User.id (ForeignKey, CASCADE)                   │
│ FK │ post_id: Integer → Post.id (ForeignKey, CASCADE)                   │
│    │ type: String(10) CHOICES['like', 'share']                          │
│    │ created_at: DateTime (auto_now_add)                                │
│    │                                                                     │
│    │ UNIQUE CONSTRAINT: (user_id, post_id, type)                        │
│    │ INDEX: user_id, post_id, type                                      │
└─────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                                 FOLLOW                                   │
├─────────────────────────────────────────────────────────────────────────┤
│ PK │ id: Integer                                                         │
│ FK │ follower_id: Integer → User.id (ForeignKey, CASCADE)               │
│ FK │ following_id: Integer → User.id (ForeignKey, CASCADE)              │
│    │ created_at: DateTime (auto_now_add)                                │
│    │                                                                     │
│    │ UNIQUE CONSTRAINT: (follower_id, following_id)                     │
│    │ INDEX: follower_id, following_id                                   │
│    │                                                                     │
│    │ CHECK: follower_id ≠ following_id (prevent self-follow)            │
└─────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                         PASSWORD RESET TOKEN                             │
├─────────────────────────────────────────────────────────────────────────┤
│ PK │ id: Integer                                                         │
│ FK │ user_id: Integer → User.id (ForeignKey, CASCADE)                   │
│    │ token: String(100, unique)                                         │
│    │ created_at: DateTime (auto_now_add)                                │
│    │ expires_at: DateTime (created_at + 24 hours)                       │
│    │ is_used: Boolean (default=False)                                   │
│    │                                                                     │
│    │ UNIQUE: token                                                      │
│    │ INDEX: token, user_id                                              │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🔗 Relationships Explained

### 1. User ↔ UserProfile (1:1)
```
User ────────── UserProfile
 1                    1
(OneToOne relationship)
```
- Each User has exactly one UserProfile
- UserProfile extends User with additional fields
- Cascade delete: Delete User → Delete UserProfile

### 2. User ↔ Post (1:N)
```
User ──────────< Post
 1                 N
(Author relationship)
```
- One User can create many Posts
- Each Post belongs to one User (author)
- Cascade delete: Delete User → Delete all Posts

### 3. Post ↔ Comment (1:N)
```
Post ──────────< Comment
 1                 N
```
- One Post can have many Comments
- Each Comment belongs to one Post
- Cascade delete: Delete Post → Delete all Comments

### 4. User ↔ Comment (1:N)
```
User ──────────< Comment
 1                 N
(Author relationship)
```
- One User can write many Comments
- Each Comment belongs to one User (author)
- Cascade delete: Delete User → Delete all Comments

### 5. Post ↔ Interaction (1:N)
```
Post ──────────< Interaction
 1                 N
```
- One Post can have many Interactions (likes/shares)
- Each Interaction belongs to one Post
- Unique constraint prevents duplicate interactions

### 6. User ↔ Interaction (1:N)
```
User ──────────< Interaction
 1                 N
```
- One User can create many Interactions
- Each Interaction belongs to one User
- Unique constraint: User can't like same post twice

### 7. User ↔ Follow ↔ User (M:N)
```
User (follower) ──────────< Follow >────────── User (following)
     1                         N                      1
```
- Self-referential Many-to-Many through Follow table
- User.following → all Follow records where user is follower
- User.followers → all Follow records where user is following
- Unique constraint prevents duplicate follows

### 8. User ↔ PasswordResetToken (1:N)
```
User ──────────< PasswordResetToken
 1                 N
```
- One User can have multiple reset tokens (over time)
- Each token belongs to one User
- Single-use tokens (is_used flag)

---

## 📐 Cardinality Notation

```
Symbol Meaning:
───    One
──<    Many
──┤    One (mandatory)
──○    Zero or One (optional)
──<    Zero or Many
```

---

## 🎨 Color Coding for Diagram

**Entity Colors:**
- 🟦 **User & UserProfile** - Blue (Authentication/Identity)
- 🟩 **Post & Comment** - Green (Content)
- 🟨 **Interaction** - Yellow (Actions)
- 🟪 **Follow** - Purple (Relationships)
- 🟧 **PasswordResetToken** - Orange (Security)

**Relationship Lines:**
- **Solid Line** - Mandatory relationship
- **Dashed Line** - Optional relationship
- **Thick Line** - Important/frequently used

---

## 🔍 Key Design Patterns

### 1. Denormalized Counters (Performance Optimization)
```
Post:
  ├─ likes_count: 1,234   ← Updated on like/unlike
  ├─ comments_count: 56   ← Updated on comment create/delete
  └─ shares_count: 89     ← Updated on share

Why? Avoid expensive COUNT(*) queries on viral posts
```

### 2. Self-Referential Many-to-Many (Follow)
```
Follow Table:
  follower_id → User A
  following_id → User B

Meaning: User A follows User B

Queries:
  - Get followers: Follow.objects.filter(following=user)
  - Get following: Follow.objects.filter(follower=user)
```

### 3. Interaction Type Pattern (Extensibility)
```
Interaction:
  type: 'like' | 'share' | 'bookmark' (future) | 'retweet' (future)

Why? Single table for all interaction types
Benefit: Easy to add new interaction types
```

### 4. Cascade Deletion (Data Integrity)
```
Delete User:
  ├─ Deletes UserProfile
  ├─ Deletes all Posts
  ├─ Deletes all Comments
  ├─ Deletes all Interactions
  └─ Deletes all Follow relationships

Ensures: No orphaned records
```

---

## 📊 Sample Data Example

```
User (id=1, username="alice")
├─ UserProfile (bio="Developer", followers_count=150)
├─ Post (id=10, content="Hello World!", likes_count=45)
│   ├─ Comment (id=20, author=Bob, content="Nice!")
│   ├─ Comment (id=21, author=Carol, content="Great!")
│   ├─ Interaction (user=Bob, type='like')
│   └─ Interaction (user=Carol, type='like')
├─ Follow (follower=Bob, following=Alice)
└─ Follow (follower=Carol, following=Alice)

Queries:
  1. Get Alice's posts: Post.objects.filter(author=alice)
  2. Get Alice's followers: Follow.objects.filter(following=alice)
  3. Get Post 10 likes: Interaction.objects.filter(post=10, type='like')
  4. Quick like count: Post.objects.get(id=10).likes_count  ← Fast!
```

---

## 🛠️ Tools for Creating ERD

### Option 1: draw.io (Recommended - Free)
1. Go to https://app.diagrams.net/
2. Create new diagram
3. Use "Entity Relation" shapes
4. Export as PNG/SVG

**Template:**
- Rectangle with rounded corners for entities
- Small circle for attributes
- Lines with crow's feet notation for relationships

### Option 2: dbdiagram.io (Database-Specific)
```
// Paste this code at https://dbdiagram.io

Table User {
  id integer [primary key]
  username varchar(150) [unique]
  email varchar(254) [unique]
  password varchar(128)
}

Table UserProfile {
  id integer [primary key]
  user_id integer [ref: - User.id]
  bio text
  followers_count integer [default: 0]
  following_count integer [default: 0]
}

Table Post {
  id integer [primary key]
  author_id integer [ref: > User.id]
  content text
  likes_count integer [default: 0]
  comments_count integer [default: 0]
  shares_count integer [default: 0]
  created_at datetime
}

Table Comment {
  id integer [primary key]
  post_id integer [ref: > Post.id]
  author_id integer [ref: > User.id]
  content text
  created_at datetime
}

Table Interaction {
  id integer [primary key]
  user_id integer [ref: > User.id]
  post_id integer [ref: > Post.id]
  type varchar(10)
  created_at datetime

  Indexes {
    (user_id, post_id, type) [unique]
  }
}

Table Follow {
  id integer [primary key]
  follower_id integer [ref: > User.id]
  following_id integer [ref: > User.id]
  created_at datetime

  Indexes {
    (follower_id, following_id) [unique]
  }
}
```

### Option 3: Google Slides/PowerPoint
1. Insert → Shape → Rectangle
2. Add text for entity name and attributes
3. Insert → Line → Connector for relationships
4. Add crow's feet manually with lines

---

## 💡 Pro Tips for ERD in Presentation

1. **Keep it Visual** - Use colors and icons
2. **Show Relationships Clearly** - Bold lines for important paths
3. **Highlight Denormalized Fields** - Use different color
4. **Add Legends** - Explain notation at bottom
5. **Progressive Reveal** - Show one entity at a time in presentation
6. **Zoom Functionality** - Make sure it's readable from back of room

---

## 📝 Talking Points for ERD Slide

**When presenting this slide:**

"Let me walk you through the database architecture. At the core, we have the User model, which is Django's built-in authentication system. From there, we extend it with a UserProfile in a one-to-one relationship for biographical data.

The Post model connects to User as the author, creating a one-to-many relationship. Notice these fields - likes_count, comments_count, shares_count. These are denormalized counters. Instead of running COUNT queries on millions of likes, we increment these atomically. This is the same pattern Twitter uses for scalability.

The Interaction model is particularly interesting. It uses a type field to handle both likes and shares in a single table. The unique constraint on user, post, and type prevents duplicate actions - you can't like the same post twice.

The Follow model creates a self-referential many-to-many relationship through a join table. This allows efficient lookups for both followers and following lists.

Every foreign key uses CASCADE deletion to maintain referential integrity. When a user is deleted, all their posts, comments, and interactions are automatically cleaned up.

This design supports millions of users and billions of interactions, following proven patterns from production social media platforms."

---

## 🎯 Key Metrics to Mention

- **7 Models** (including Django's User)
- **12 Relationships** (1:1, 1:N, M:N)
- **3 Denormalized Counters** (performance optimization)
- **4 Unique Constraints** (data integrity)
- **Cascade Deletes** (referential integrity)
- **Indexed Fields** (query optimization)

---

## 🚀 Advanced: Performance Annotations

Add these notes to your ERD:

```
⚡ Denormalized Counter
🔍 Indexed Field
🔒 Unique Constraint
🗑️ CASCADE Delete
📊 Frequently Queried
```

---

This ERD is the heart of your API architecture. Spend time on this slide - it demonstrates your understanding of database design, scalability, and real-world engineering trade-offs! 🎓
