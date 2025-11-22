# Project Structure

## Directory Tree

```
frontend/
├── 📄 Configuration Files
│   ├── package.json              # Dependencies and scripts
│   ├── vite.config.js            # Vite build configuration
│   ├── tailwind.config.js        # TailwindCSS configuration
│   ├── postcss.config.js         # PostCSS configuration
│   ├── .eslintrc.cjs             # ESLint rules
│   ├── .gitignore                # Git ignore patterns
│   ├── .env                      # Environment variables
│   └── .env.example              # Environment template
│
├── 📚 Documentation
│   ├── README.md                 # Main documentation
│   ├── QUICK_START.md            # Quick setup guide
│   ├── TESTING.md                # Testing instructions
│   ├── DEPLOYMENT.md             # Deployment guide
│   ├── PROJECT_OVERVIEW.md       # Technical overview
│   └── STRUCTURE.md              # This file
│
├── 🌐 Public Files
│   └── index.html                # HTML entry point
│
└── 📂 src/                       # Source code
    ├── 📱 App.jsx                # Main application component
    ├── 🚀 main.jsx               # Application entry point
    ├── 🎨 index.css              # Global styles
    │
    ├── 🧩 components/            # React components
    │   │
    │   ├── 🔐 Auth/              # Authentication
    │   │   ├── Login.jsx         # Login form component
    │   │   └── Register.jsx      # Registration form component
    │   │
    │   ├── 💬 Comments/          # Comment system
    │   │   ├── CommentForm.jsx   # Add comment form
    │   │   └── CommentList.jsx   # Display comments
    │   │
    │   ├── 🔄 Common/            # Reusable components
    │   │   ├── Button.jsx        # Button component
    │   │   ├── Input.jsx         # Input field component
    │   │   ├── Loading.jsx       # Loading spinner
    │   │   ├── ErrorMessage.jsx  # Error display
    │   │   └── ProtectedRoute.jsx # Route protection
    │   │
    │   ├── 📰 Feed/              # Feed components
    │   │   ├── Feed.jsx          # Main feed container
    │   │   ├── PostCard.jsx      # Individual post display
    │   │   └── CreatePost.jsx    # Create post form
    │   │
    │   └── 📐 Layout/            # Layout components
    │       └── Header.jsx        # App header/navbar
    │
    ├── 🎯 context/               # React Context
    │   └── AuthContext.jsx       # Authentication context
    │
    ├── 📊 graphql/               # GraphQL operations
    │   ├── queries.js            # GraphQL queries
    │   └── mutations.js          # GraphQL mutations
    │
    ├── 📄 pages/                 # Page components
    │   ├── Home.jsx              # Home/Feed page
    │   ├── Profile.jsx           # Profile component
    │   └── ProfilePage.jsx       # Profile page wrapper
    │
    └── 🛠️ utils/                 # Utility functions
        ├── apolloClient.js       # Apollo Client setup
        ├── auth.js               # Auth utilities
        └── helpers.js            # Helper functions
```

## File Descriptions

### Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Project dependencies, scripts, and metadata |
| `vite.config.js` | Vite development server and build configuration |
| `tailwind.config.js` | TailwindCSS theme and customization |
| `postcss.config.js` | PostCSS plugins configuration |
| `.eslintrc.cjs` | ESLint code quality rules |
| `.gitignore` | Files to exclude from version control |
| `.env` | Environment variables (API endpoint) |
| `.env.example` | Environment variables template |

### Documentation Files

| File | Content |
|------|---------|
| `README.md` | Complete project documentation |
| `QUICK_START.md` | 5-minute setup guide |
| `TESTING.md` | Testing instructions and checklist |
| `DEPLOYMENT.md` | Deployment to various platforms |
| `PROJECT_OVERVIEW.md` | Technical architecture details |
| `STRUCTURE.md` | This file - project structure |

### Source Code Structure

#### Components

**Auth Components** (`src/components/Auth/`)
- `Login.jsx` - User login form with validation
- `Register.jsx` - User registration form with validation

**Comment Components** (`src/components/Comments/`)
- `CommentForm.jsx` - Form to add comments to posts
- `CommentList.jsx` - Display list of comments

**Common Components** (`src/components/Common/`)
- `Button.jsx` - Reusable button component with variants
- `Input.jsx` - Reusable input field with validation
- `Loading.jsx` - Loading spinner component
- `ErrorMessage.jsx` - Error display component
- `ProtectedRoute.jsx` - Route wrapper for authentication

**Feed Components** (`src/components/Feed/`)
- `Feed.jsx` - Main feed container with posts
- `PostCard.jsx` - Individual post with interactions
- `CreatePost.jsx` - Form to create new posts

**Layout Components** (`src/components/Layout/`)
- `Header.jsx` - Application header with navigation

#### Context

**Auth Context** (`src/context/`)
- `AuthContext.jsx` - Global authentication state management

#### GraphQL

**GraphQL Operations** (`src/graphql/`)
- `queries.js` - GraphQL queries (GET_POSTS, GET_ME)
- `mutations.js` - GraphQL mutations (LOGIN, CREATE_POST, etc.)

#### Pages

**Page Components** (`src/pages/`)
- `Home.jsx` - Home page with feed
- `Profile.jsx` - User profile component
- `ProfilePage.jsx` - Profile page wrapper

#### Utilities

**Utility Functions** (`src/utils/`)
- `apolloClient.js` - Apollo Client configuration
- `auth.js` - Authentication helper functions
- `helpers.js` - General utility functions

## Component Hierarchy

```
App
└── Router
    └── AuthProvider
        ├── Login (Route: /login)
        ├── Register (Route: /register)
        └── ProtectedRoute
            ├── Home (Route: /)
            │   ├── Header
            │   └── Feed
            │       ├── CreatePost
            │       └── PostCard (multiple)
            │           ├── CommentList
            │           └── CommentForm
            └── ProfilePage (Route: /profile)
                ├── Header
                └── Profile
```

## Data Flow

```
User Action
    ↓
Component (UI)
    ↓
GraphQL Query/Mutation
    ↓
Apollo Client
    ↓
Backend API
    ↓
Response
    ↓
Apollo Cache Update
    ↓
Component Re-render
    ↓
Updated UI
```

## File Naming Conventions

- **Components**: PascalCase (e.g., `PostCard.jsx`)
- **Utilities**: camelCase (e.g., `apolloClient.js`)
- **Constants**: UPPER_SNAKE_CASE (if needed)
- **Styles**: kebab-case or camelCase

## Import Structure

Typical import order in components:
```javascript
// 1. React and React libraries
import { useState } from 'react';
import { useQuery } from '@apollo/client';

// 2. Third-party libraries
import { toast } from 'react-toastify';

// 3. GraphQL operations
import { GET_POSTS } from '../../graphql/queries';

// 4. Components
import PostCard from './PostCard';
import Loading from '../Common/Loading';

// 5. Utilities
import { formatDate } from '../../utils/helpers';
```

## State Management

### Global State
- **Authentication**: Context API (`AuthContext`)
- **Server Data**: Apollo Client cache

### Local State
- **Form inputs**: `useState` in components
- **UI state**: `useState` for toggles, modals, etc.

## Styling Approach

### TailwindCSS Utility Classes
- Primary styling method
- Responsive utilities
- Custom components defined in `index.css`

### Custom CSS
- Global styles in `index.css`
- Component-specific styles using Tailwind
- Custom utility classes for common patterns

## File Size Guidelines

- **Components**: < 300 lines (break into smaller components if larger)
- **Utilities**: < 100 lines (split into multiple files if needed)
- **Pages**: < 200 lines (delegate logic to components)

## Adding New Features

### New Component
1. Create file in appropriate folder
2. Follow existing component structure
3. Import and use in parent component

### New Page
1. Create file in `src/pages/`
2. Add route in `src/App.jsx`
3. Add to navigation if needed

### New GraphQL Operation
1. Add query/mutation to `src/graphql/`
2. Import in component
3. Use with `useQuery` or `useMutation`

### New Utility
1. Create function in `src/utils/helpers.js`
2. Export function
3. Import where needed

## Code Organization Best Practices

1. **Single Responsibility**: Each file has one purpose
2. **Component Composition**: Build complex UIs from simple components
3. **Reusability**: Extract common patterns into reusable components
4. **Separation of Concerns**: UI, logic, and data separate
5. **Clear Naming**: Self-documenting code with clear names

## Development Workflow

1. **Create Component** in appropriate folder
2. **Import Dependencies** at the top
3. **Define Component** with JSX
4. **Add PropTypes** (if using TypeScript, add types)
5. **Export** at the bottom
6. **Test** in browser
7. **Refine** based on requirements

## Build Output

After running `npm run build`:
```
dist/
├── index.html              # HTML entry
├── assets/
│   ├── index-[hash].js    # Main JavaScript bundle
│   ├── vendor-[hash].js   # Vendor libraries
│   └── index-[hash].css   # Compiled CSS
└── vite.svg               # Favicon
```

## Environment Variables

All environment variables must be prefixed with `VITE_`:
- `VITE_GRAPHQL_API_URL` - GraphQL endpoint

Access in code:
```javascript
import.meta.env.VITE_GRAPHQL_API_URL
```

## Quick Navigation

| Need | Go To |
|------|-------|
| Authentication logic | `src/context/AuthContext.jsx` |
| GraphQL operations | `src/graphql/` |
| Reusable components | `src/components/Common/` |
| Feed functionality | `src/components/Feed/` |
| Styling configuration | `tailwind.config.js` |
| API client setup | `src/utils/apolloClient.js` |
| Helper functions | `src/utils/helpers.js` |
| Routing | `src/App.jsx` |

## Performance Considerations

- **Code Splitting**: React.lazy() for route-based splitting
- **Memoization**: React.memo for expensive components
- **Apollo Cache**: Automatic query result caching
- **Image Optimization**: Lazy loading images
- **Bundle Size**: Regular analysis with build output

## Security Considerations

- **Token Storage**: localStorage (consider httpOnly cookies for production)
- **Protected Routes**: Authentication check before render
- **Input Validation**: Client and server-side validation
- **XSS Prevention**: React's default escaping
- **HTTPS**: Always use in production

---

**This structure is designed for:**
- Easy navigation
- Clear organization
- Scalability
- Maintainability
- Developer experience
