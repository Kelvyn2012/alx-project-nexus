# Quick Start Guide

Get up and running with the Social Media Feed frontend in 5 minutes!

## Prerequisites Check

Before you start, ensure you have:
- [ ] Node.js v18 or higher installed
- [ ] npm or yarn installed
- [ ] Backend API running at: https://alx-project-nexus-vetk.onrender.com/graphql/

Check your Node version:
```bash
node --version  # Should be v18.0.0 or higher
npm --version   # Should be v9.0.0 or higher
```

## Step 1: Install Dependencies (2 minutes)

Navigate to the frontend directory and install:
```bash
cd frontend
npm install
```

Expected output: ~1000 packages installed

## Step 2: Configure Environment (30 seconds)

The `.env` file is already configured with the backend URL:
```
VITE_GRAPHQL_API_URL=https://alx-project-nexus-vetk.onrender.com/graphql/
```

No changes needed unless you're using a different backend!

## Step 3: Start Development Server (30 seconds)

```bash
npm run dev
```

Expected output:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

## Step 4: Open Application (10 seconds)

Open your browser and navigate to:
```
http://localhost:3000
```

You should see the login page!

## Step 5: Create Account & Start Using (1 minute)

### Register a New Account
1. Click "create a new account"
2. Fill in the form:
   - Username: `yourname`
   - Email: `your@email.com`
   - Password: `yourpassword`
   - Confirm Password: `yourpassword`
3. Click "Create account"

You'll be automatically logged in and redirected to the feed!

### Start Posting
1. Type in the "What's happening?" box
2. Write your first post
3. Click "Post"

### Interact with Posts
- ❤️ Click the heart to like
- 💬 Click the comment icon to add a comment
- 🔄 Click the share icon to share

## Troubleshooting

### Problem: Dependencies fail to install

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Problem: Port 3000 already in use

**Solution:**
Change the port in `vite.config.js`:
```javascript
server: {
  port: 3001,  // Change to any available port
}
```

### Problem: Cannot connect to API

**Solution:**
1. Check your internet connection
2. Verify the backend is running: https://alx-project-nexus-vetk.onrender.com/graphql/
3. Check the `.env` file has the correct URL

### Problem: Blank page after login

**Solution:**
1. Check browser console for errors (F12)
2. Clear browser cache and localStorage
3. Try a different browser

## Next Steps

Now that you're up and running:

1. **Explore the App**
   - Create posts
   - Like and comment
   - Search for posts
   - View your profile

2. **Read the Documentation**
   - [Full README](./README.md) - Complete documentation
   - [Testing Guide](./TESTING.md) - How to test features
   - [Deployment Guide](./DEPLOYMENT.md) - Deploy to production
   - [Project Overview](./PROJECT_OVERVIEW.md) - Technical details

3. **Customize**
   - Change colors in `tailwind.config.js`
   - Modify components in `src/components/`
   - Add new features

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Check code quality
```

## File Structure Quick Reference

```
src/
├── components/      # React components
│   ├── Auth/       # Login, Register
│   ├── Feed/       # Feed, PostCard, CreatePost
│   ├── Comments/   # Comment components
│   ├── Layout/     # Header, navigation
│   └── Common/     # Reusable components
├── pages/          # Page components
├── context/        # React context (Auth)
├── graphql/        # GraphQL queries/mutations
├── utils/          # Helper functions
├── App.jsx         # Main app component
└── main.jsx        # Entry point
```

## Common Tasks

### Change API Endpoint
Edit `.env`:
```
VITE_GRAPHQL_API_URL=http://localhost:8000/graphql/
```

### Add a New Component
```bash
# Create file
touch src/components/YourComponent/YourComponent.jsx

# Import in parent
import YourComponent from './components/YourComponent/YourComponent';
```

### Add a New Page
1. Create page in `src/pages/YourPage.jsx`
2. Add route in `src/App.jsx`:
```javascript
<Route path="/yourpage" element={<YourPage />} />
```

## Tips for Success

1. **Use React DevTools**
   - Install React DevTools browser extension
   - Inspect component tree and state

2. **Check the Console**
   - Open browser DevTools (F12)
   - Watch for errors and warnings
   - Monitor network requests

3. **Hot Reload**
   - Changes auto-reload
   - No need to restart server
   - Fast iteration

4. **Code Quality**
   - Run `npm run lint` before committing
   - Fix warnings and errors
   - Follow ESLint rules

## Learning Resources

- **React:** https://react.dev/learn
- **Apollo Client:** https://www.apollographql.com/docs/react/
- **TailwindCSS:** https://tailwindcss.com/docs
- **GraphQL:** https://graphql.org/learn/

## Getting Help

1. Check the [FAQ](#faq) below
2. Review error messages carefully
3. Search GitHub issues
4. Create a new issue with details

## FAQ

**Q: How do I reset my environment?**
```bash
rm -rf node_modules package-lock.json .env
cp .env.example .env
npm install
```

**Q: Can I use yarn instead of npm?**
Yes! Replace `npm install` with `yarn` and `npm run` with `yarn`.

**Q: How do I update dependencies?**
```bash
npm update
```

**Q: Where are posts stored?**
Posts are stored in the PostgreSQL database on the backend.

**Q: Can I run this offline?**
No, it requires connection to the backend API.

**Q: How do I contribute?**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Keyboard Shortcuts

When dev server is running:
- `r` - Restart server
- `u` - Show URL
- `o` - Open in browser
- `c` - Clear console
- `q` - Quit

## Success Checklist

You're all set when you can:
- [ ] Access the app at http://localhost:3000
- [ ] Create a new account
- [ ] Login successfully
- [ ] Create a post
- [ ] Like a post
- [ ] Comment on a post
- [ ] Search for posts
- [ ] View your profile
- [ ] Logout

## What's Next?

Ready to go deeper?
1. **Deploy to Production** - See [DEPLOYMENT.md](./DEPLOYMENT.md)
2. **Run Tests** - See [TESTING.md](./TESTING.md)
3. **Understand Architecture** - See [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)
4. **Add Features** - Check the code and start building!

---

**Congratulations!** 🎉 You're now ready to use and develop the Social Media Feed application!

Need help? Create an issue or check the documentation.
