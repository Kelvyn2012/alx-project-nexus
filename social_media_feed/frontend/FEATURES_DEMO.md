# Features Demo Guide

This guide walks you through all the features of the Social Media Feed application.

## 🚀 Getting Started

### First Time Setup

1. **Navigate to the application:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

2. **Open in browser:**
   ```
   http://localhost:3000
   ```

3. **You'll see the login page:**
   - Clean, modern design
   - Login form with username and password
   - "Create a new account" link
   - "Remember me" checkbox

## 📱 Feature Walkthrough

### 1. User Registration

**Location:** `/register`

**Features:**
- Username field (minimum 3 characters)
- Email field (validated format)
- Password field (minimum 6 characters)
- Confirm password field (must match)
- Real-time validation
- Clear error messages

**How to Test:**
1. Click "create a new account" from login page
2. Try submitting empty form (see validation errors)
3. Enter username: `demo_user`
4. Enter email: `demo@example.com`
5. Enter password: `password123`
6. Confirm password: `password123`
7. Click "Create account"

**Expected Result:**
- Success toast notification
- Automatic login
- Redirect to home feed
- Token stored in localStorage
- Username displayed in header

### 2. User Login

**Location:** `/login`

**Features:**
- Username input
- Password input (hidden)
- Remember me checkbox
- Form validation
- Error handling
- Auto-redirect on success

**How to Test:**
1. Enter credentials:
   - Username: `demo_user`
   - Password: `password123`
2. Check "Remember me" (optional)
3. Click "Sign in"

**Expected Result:**
- Success notification
- Redirect to feed
- User authenticated
- Protected routes accessible

### 3. Main Feed

**Location:** `/` (home)

**Features:**
- Clean header with logo and navigation
- Search bar
- User avatar and name
- Create post box
- List of posts
- Auto-refresh every 30 seconds

**Layout:**
```
┌─────────────────────────────────────┐
│  [Logo] Social Feed    [Search]     │
│  [@User] [Logout]                   │
├─────────────────────────────────────┤
│  What's happening?                  │
│  [Text Area]              [Post]    │
├─────────────────────────────────────┤
│  [@user1] • 2 hours ago             │
│  This is a sample post content      │
│  ❤️ 24   💬 5   🔄 3                │
├─────────────────────────────────────┤
│  [@user2] • 5 hours ago             │
│  Another post here...               │
│  ❤️ 10   💬 2   🔄 1                │
└─────────────────────────────────────┘
```

**How to Test:**
1. After login, observe the feed
2. See existing posts
3. Notice timestamps (relative)
4. Check interaction counts

**Expected Result:**
- Posts display in reverse chronological order
- Each post shows author, time, content, counts
- Smooth scrolling
- Responsive layout

### 4. Create Post

**Location:** Top of feed

**Features:**
- Multi-line text area
- Character counter (500 max)
- Disabled submit when empty
- Optimistic UI update
- Success notification

**How to Test:**
1. Click in "What's happening?" text area
2. Type: "This is my first post! 🎉"
3. Watch character counter: 27/500
4. Click "Post" button

**Expected Result:**
- Post appears immediately at top of feed
- Success toast: "Post created successfully!"
- Text area clears
- Character counter resets
- Post shows your username
- Timestamp shows "just now"

### 5. Like Post

**Features:**
- Toggle like/unlike
- Visual feedback (heart icon fills)
- Count updates
- Optimistic update

**How to Test:**
1. Find any post in feed
2. Click the ❤️ heart icon
3. Click again to unlike

**Expected Result:**
- **First click:**
  - Heart icon fills with red color
  - Like count increases by 1
  - Animation/transition effect
- **Second click:**
  - Heart icon returns to outline
  - Like count decreases by 1

### 6. Comment on Post

**Features:**
- Expandable comment section
- Comment input field
- Submit button
- Comment list with authors
- Relative timestamps

**How to Test:**
1. Click the 💬 comment icon on any post
2. Comment section expands
3. See existing comments (if any)
4. Type in input: "Great post!"
5. Click "Comment" button

**Expected Result:**
- Comment section opens smoothly
- Existing comments display with:
  - Author avatar (initial)
  - Author username
  - Comment text
  - Timestamp
- New comment appears immediately
- Comment count increases
- Success notification
- Input field clears

### 7. Share Post

**Features:**
- Share button
- Count updates
- Success notification

**How to Test:**
1. Find any post
2. Click the 🔄 share icon

**Expected Result:**
- Success toast: "Post shared!"
- Share count increases by 1
- Icon briefly highlights

### 8. Search Posts

**Features:**
- Search bar in header
- Real-time filtering
- Search by content or author
- Clear results

**How to Test:**
1. Type in search bar: "first"
2. Press Enter or wait
3. Feed filters to matching posts
4. Clear search to see all posts

**Expected Result:**
- Feed updates with search results
- Only matching posts show
- Empty state if no matches
- Smooth transition

### 9. User Profile

**Location:** `/profile`

**Features:**
- User avatar
- Username and email
- Join date
- Statistics cards (Posts, Likes, Shares)
- My Posts section

**How to Test:**
1. Click username in header
2. Navigate to profile page

**Expected Result:**
- Profile information displays:
  - Large avatar with initial
  - Username
  - Email address
  - Formatted join date
- Statistics cards show (currently 0s)
- "My Posts" section
- Back to feed option

### 10. Logout

**Features:**
- Clear authentication
- Redirect to login
- Protected route enforcement

**How to Test:**
1. Click "Logout" button in header
2. Confirm logout

**Expected Result:**
- Redirected to login page
- Token cleared from localStorage
- Cannot access protected routes
- Must login again to access feed

### 11. Protected Routes

**Features:**
- Automatic authentication check
- Redirect to login if not authenticated
- Persistent authentication

**How to Test:**
1. Logout if logged in
2. Try to access `http://localhost:3000/`
3. Try to access `http://localhost:3000/profile`

**Expected Result:**
- Automatic redirect to `/login`
- Cannot access protected content
- Login required message

### 12. Responsive Design

**Features:**
- Mobile-first design
- Adaptive layouts
- Touch-friendly interactions

**How to Test:**
1. Open DevTools (F12)
2. Toggle device toolbar
3. Test different sizes:
   - Mobile: 320px
   - Tablet: 768px
   - Desktop: 1024px+

**Expected Result:**
- **Mobile (320px-767px):**
  - Single column layout
  - Hamburger menu (if needed)
  - Touch-friendly buttons
  - Readable text
  - Proper spacing

- **Tablet (768px-1023px):**
  - Optimized for touch
  - Better use of space
  - Comfortable reading

- **Desktop (1024px+):**
  - Maximum width constraints
  - Optimal reading width
  - Full features visible

### 13. Error Handling

**Features:**
- Network error handling
- Validation errors
- User-friendly messages
- Retry functionality

**How to Test:**

**Network Errors:**
1. Disconnect internet
2. Try to create post
3. Observe error message

**Validation Errors:**
1. Try to post empty content
2. Try to register with invalid email
3. Try to login with wrong password

**Expected Result:**
- Clear error messages
- No crashes
- Graceful degradation
- Option to retry

### 14. Loading States

**Features:**
- Loading spinners
- Skeleton screens
- Button loading states
- Smooth transitions

**How to Test:**
1. Refresh page (watch feed load)
2. Create post (watch button state)
3. Like post (watch animation)
4. Load more posts (watch loading)

**Expected Result:**
- Loading spinner shows during fetch
- Buttons show "Loading..." text
- Smooth transitions
- No jarring updates

### 15. Real-time Updates

**Features:**
- Auto-refresh every 30 seconds
- Polling for new posts
- Background updates

**How to Test:**
1. Open app in two browser tabs
2. Create post in tab 1
3. Wait 30 seconds
4. Check tab 2

**Expected Result:**
- New posts appear after 30s
- No page refresh needed
- Smooth update
- Maintains scroll position

## 🎨 UI/UX Features

### Visual Design
- **Color Scheme:**
  - Primary: Twitter Blue (#1DA1F2)
  - Text: Dark Gray (#14171A)
  - Like: Pink/Red (#E0245E)
  - Share: Green (#17BF63)

- **Typography:**
  - Clean, readable fonts
  - Proper hierarchy
  - Good contrast

- **Spacing:**
  - Adequate white space
  - Comfortable padding
  - Clear separation

### Interactions
- **Hover States:** Subtle highlights on buttons
- **Click Feedback:** Visual confirmation
- **Transitions:** Smooth animations
- **Focus States:** Clear keyboard navigation

### Accessibility
- **Keyboard Navigation:** Tab through elements
- **Screen Reader:** Semantic HTML
- **Color Contrast:** WCAG AA compliant
- **Focus Indicators:** Visible focus rings

## 🔍 Testing Scenarios

### Happy Path
1. Register → Login → Create Post → Like → Comment → Profile → Logout ✅

### Edge Cases
1. Empty form submissions
2. Invalid credentials
3. Network failures
4. Very long posts (500 char limit)
5. Rapid clicking (debouncing)
6. Multiple tabs open
7. Browser back/forward

### Performance
1. Large number of posts (pagination)
2. Multiple rapid actions
3. Slow network
4. Mobile device performance

## 📊 Success Metrics

Track these as you use the app:
- [ ] Pages load in < 3 seconds
- [ ] Smooth scrolling
- [ ] No console errors
- [ ] Responsive on all devices
- [ ] All features work correctly
- [ ] Good user experience

## 🐛 Known Limitations

Current version does not include:
- Image/video uploads (text only)
- Edit/delete posts
- Real-time WebSocket updates
- Push notifications
- Direct messages
- User mentions
- Hashtags

These are potential future enhancements.

## 💡 Tips for Best Experience

1. **Use Modern Browser:** Chrome, Firefox, Safari, or Edge (latest)
2. **Clear Cache:** If issues, clear browser cache
3. **Good Connection:** Stable internet for best experience
4. **Enable Cookies:** For persistent login
5. **Allow JavaScript:** Required for app to function

## 🎯 Feature Checklist

Test all features:

- [ ] User can register
- [ ] User can login
- [ ] User can logout
- [ ] User can create post
- [ ] User can like post
- [ ] User can unlike post
- [ ] User can comment on post
- [ ] User can share post
- [ ] User can search posts
- [ ] User can view profile
- [ ] Protected routes work
- [ ] Responsive on mobile
- [ ] Responsive on tablet
- [ ] Responsive on desktop
- [ ] Errors handled gracefully
- [ ] Loading states show
- [ ] Auto-refresh works
- [ ] Validation works
- [ ] Toast notifications work
- [ ] Timestamps format correctly

## 📸 Screenshots Locations

When taking screenshots, capture:
1. Login page
2. Registration page
3. Home feed with posts
4. Create post box
5. Post with comments expanded
6. User profile page
7. Mobile view (DevTools)
8. Error state
9. Loading state
10. Empty state

## 🎬 Demo Flow

For a complete demo:
1. Start at login page (2 min)
2. Register new account (1 min)
3. Show main feed (2 min)
4. Create a post (1 min)
5. Interact with posts (like, comment, share) (3 min)
6. Search functionality (1 min)
7. View profile (1 min)
8. Show responsive design (2 min)
9. Demonstrate error handling (1 min)
10. Logout and re-login (1 min)

**Total: ~15 minutes**

---

**Enjoy exploring all the features!** 🚀

For issues or questions, refer to the main [README.md](./README.md).
