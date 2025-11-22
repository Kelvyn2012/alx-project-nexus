# Social Media Feed - Frontend Application

A modern, responsive React-based social media feed application that connects to a Django GraphQL API. Built with React 18, Apollo Client, TailwindCSS, and Vite.

## Features

### Authentication
- User registration with email validation
- Secure login with JWT token management
- Protected routes with automatic redirects
- Persistent authentication across sessions
- Remember me functionality

### Feed
- Real-time feed of posts in reverse chronological order
- Auto-refresh every 30 seconds
- Infinite scroll/pagination support
- Search posts by content or author
- Create new posts with character counter (500 max)
- Optimistic UI updates

### Interactions
- Like/unlike posts (toggle functionality)
- Share posts with share counter
- Comment on posts with expandable comment sections
- Real-time count updates for likes, comments, and shares
- Formatted relative timestamps (e.g., "2 hours ago")

### User Interface
- Clean, modern Twitter-inspired design
- Fully responsive (mobile, tablet, desktop)
- Loading states with spinners
- Error handling with user-friendly messages
- Toast notifications for user actions
- Empty states for better UX

### User Profile
- View user information (username, email, join date)
- Profile statistics dashboard
- User avatar with initials

## Technology Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Apollo Client** - GraphQL client
- **React Router v6** - Navigation and routing
- **TailwindCSS** - Utility-first CSS framework
- **date-fns** - Date formatting library
- **react-toastify** - Toast notifications

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn package manager

## Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**

   Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

   The `.env` file should contain:
   ```
   VITE_GRAPHQL_API_URL=https://alx-project-nexus-vetk.onrender.com/graphql/
   ```

## Development

### Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for production:
```bash
npm run build
```

### Preview production build:
```bash
npm run preview
```

### Lint code:
```bash
npm run lint
```

## Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   │   ├── Auth/         # Authentication components
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── Common/       # Reusable components
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── ErrorMessage.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── Comments/     # Comment components
│   │   │   ├── CommentForm.jsx
│   │   │   └── CommentList.jsx
│   │   ├── Feed/         # Feed components
│   │   │   ├── CreatePost.jsx
│   │   │   ├── Feed.jsx
│   │   │   └── PostCard.jsx
│   │   └── Layout/       # Layout components
│   │       └── Header.jsx
│   ├── context/          # React context
│   │   └── AuthContext.jsx
│   ├── graphql/          # GraphQL queries and mutations
│   │   ├── queries.js
│   │   └── mutations.js
│   ├── pages/            # Page components
│   │   ├── Home.jsx
│   │   ├── Profile.jsx
│   │   └── ProfilePage.jsx
│   ├── utils/            # Utility functions
│   │   ├── apolloClient.js
│   │   ├── auth.js
│   │   └── helpers.js
│   ├── App.jsx           # Main App component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── .env                  # Environment variables
├── .env.example          # Environment variables template
├── package.json          # Dependencies
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # TailwindCSS configuration
└── README.md            # This file
```

## Usage Guide

### 1. Register a New Account

1. Navigate to the registration page
2. Fill in the required fields:
   - Username (minimum 3 characters)
   - Email (valid email format)
   - Password (minimum 6 characters)
   - Confirm Password
3. Click "Create account"
4. You'll be automatically logged in and redirected to the feed

### 2. Login

1. Navigate to the login page
2. Enter your username and password
3. Optionally check "Remember me" for persistent login
4. Click "Sign in"

### 3. Create a Post

1. In the feed, find the "What's happening?" text area at the top
2. Type your post content (max 500 characters)
3. Watch the character counter
4. Click "Post" to publish

### 4. Interact with Posts

- **Like:** Click the heart icon to like/unlike a post
- **Comment:** Click the comment icon to expand the comment section, then type and submit your comment
- **Share:** Click the share icon to share a post

### 5. Search Posts

1. Use the search bar in the header
2. Type keywords to search post content or author names
3. Press Enter or click the search button
4. Results update in real-time

### 6. View Profile

1. Click your username/avatar in the header
2. View your profile information and statistics
3. See your posts and activity

## API Integration

The frontend connects to the backend GraphQL API at:
```
https://alx-project-nexus-vetk.onrender.com/graphql/
```

### Authentication Flow

1. **Registration/Login:**
   - User submits credentials
   - Backend returns JWT token and refresh token
   - Tokens stored in localStorage
   - User redirected to feed

2. **Authenticated Requests:**
   - Token added to Authorization header
   - Format: `Bearer {token}`
   - Apollo Client automatically includes token in all requests

3. **Token Management:**
   - Tokens persist in localStorage
   - Checked on app initialization
   - Cleared on logout

### GraphQL Operations

The app uses the following operations:

**Queries:**
- `GET_POSTS` - Fetch posts with pagination and search
- `GET_ME` - Get current user information

**Mutations:**
- `REGISTER` - Register new user
- `LOGIN` - Authenticate user
- `CREATE_POST` - Create new post
- `TOGGLE_LIKE` - Like/unlike post
- `SHARE_POST` - Share post
- `CREATE_COMMENT` - Add comment to post

## Testing

### Test Credentials

You can use the following test account or create your own:
- Username: `testuser`
- Password: `testpass123`

### Testing Checklist

- [ ] Register a new account
- [ ] Login with credentials
- [ ] Create a new post
- [ ] Like a post
- [ ] Unlike a post
- [ ] Comment on a post
- [ ] Share a post
- [ ] Search for posts
- [ ] View profile
- [ ] Logout
- [ ] Test responsive design (mobile, tablet, desktop)
- [ ] Test auto-refresh functionality
- [ ] Test error handling (network errors, invalid input)

## Responsive Design

The application is fully responsive and optimized for:

- **Mobile:** 320px - 767px
- **Tablet:** 768px - 1023px
- **Desktop:** 1024px and above

Key responsive features:
- Collapsible navigation
- Adaptive layouts
- Touch-friendly buttons and inputs
- Optimized images and icons

## Performance Optimizations

- Code splitting with React lazy loading
- Optimized bundle size with Vite
- Efficient GraphQL caching with Apollo Client
- Debounced search input
- Image lazy loading
- Minimized re-renders with React memo

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Common Issues

**1. "Network error" on login/register:**
- Check that the backend API is running
- Verify the API URL in `.env` is correct
- Check browser console for CORS errors

**2. Posts not loading:**
- Ensure you're logged in
- Check network tab for failed requests
- Verify GraphQL endpoint is accessible

**3. Token expired:**
- Logout and login again
- Clear localStorage and refresh

**4. Build errors:**
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear npm cache: `npm cache clean --force`

### Debug Mode

To enable debug mode for Apollo Client, add to your browser console:
```javascript
localStorage.setItem('debug', 'apollo-client:*')
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_GRAPHQL_API_URL` | GraphQL API endpoint | https://alx-project-nexus-vetk.onrender.com/graphql/ |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the ALX Project Nexus.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review existing GitHub issues
3. Create a new issue with detailed information

## Acknowledgments

- Built with React and Apollo Client
- Styled with TailwindCSS
- Icons from Heroicons
- Backend API powered by Django and Graphene

---

**Built with ❤️ for ALX Project Nexus**
