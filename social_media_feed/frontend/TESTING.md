# Testing Guide

## Manual Testing Guide

### 1. Authentication Testing

#### Register New User
1. Navigate to `/register`
2. Test validation:
   - Try submitting empty form (should show errors)
   - Enter username less than 3 characters (should show error)
   - Enter invalid email format (should show error)
   - Enter password less than 6 characters (should show error)
   - Enter non-matching passwords (should show error)
3. Fill valid data:
   - Username: `testuser123`
   - Email: `testuser123@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
4. Submit form
5. Verify:
   - Success toast appears
   - Redirected to home feed
   - Token stored in localStorage
   - User info displayed in header

#### Login
1. Navigate to `/login`
2. Test validation:
   - Try empty credentials (should show errors)
3. Enter credentials:
   - Username: `testuser123`
   - Password: `password123`
4. Check "Remember me" option
5. Submit form
6. Verify:
   - Success redirect to feed
   - Token stored
   - User authenticated

#### Protected Routes
1. Logout
2. Try to access `/` or `/profile`
3. Verify redirected to `/login`

#### Logout
1. Click logout button
2. Verify:
   - Redirected to login
   - Tokens cleared from localStorage
   - Cannot access protected routes

### 2. Feed Testing

#### View Posts
1. Login and navigate to home
2. Verify:
   - Posts load and display
   - Author names visible
   - Timestamps showing relative time
   - Like, comment, share counts visible
   - Loading spinner shows during fetch

#### Create Post
1. Type in "What's happening?" textarea
2. Verify:
   - Character counter updates
   - Post button disabled when empty
   - Cannot exceed 500 characters
3. Submit post with content
4. Verify:
   - Success toast appears
   - New post appears at top of feed
   - Textarea cleared
   - Post shows correct author

#### Auto-Refresh
1. Wait 30 seconds on feed
2. Verify posts refresh automatically
3. Check network tab for polling requests

#### Pagination
1. Scroll to bottom of feed
2. If more than 20 posts, verify "Load More" button appears
3. Click "Load More"
4. Verify additional posts load

### 3. Post Interactions

#### Like Post
1. Click heart icon on a post
2. Verify:
   - Heart icon fills with color
   - Like count increments
   - Success feedback
3. Click again to unlike
4. Verify:
   - Heart icon returns to outline
   - Like count decrements

#### Share Post
1. Click share icon
2. Verify:
   - Success toast appears
   - Share count increments

#### Comments
1. Click comment icon to expand
2. Verify comment section opens
3. View existing comments (if any)
4. Type in comment input
5. Click "Comment" button
6. Verify:
   - Success toast
   - Comment appears in list
   - Comment count increments
   - Comment shows correct author and time

### 4. Search Testing

#### Search Posts
1. Type keyword in search bar
2. Press Enter
3. Verify:
   - Feed filters to matching posts
   - Loading indicator shows
   - Empty state if no results
4. Clear search
5. Verify all posts return

#### Search Edge Cases
- Search with no results
- Search with special characters
- Very long search query
- Empty search query

### 5. Profile Testing

#### View Profile
1. Click username in header
2. Navigate to profile page
3. Verify:
   - Username displayed
   - Email displayed
   - Join date formatted correctly
   - Avatar with initial shown
   - Statistics cards visible

### 6. Responsive Design Testing

#### Mobile (320px - 767px)
1. Open DevTools
2. Set viewport to mobile size
3. Test all features:
   - Navigation works
   - Forms are usable
   - Posts display properly
   - Buttons are touch-friendly
   - Search bar accessible

#### Tablet (768px - 1023px)
1. Set viewport to tablet size
2. Verify layout adapts
3. Test all interactions

#### Desktop (1024px+)
1. Test on full desktop width
2. Verify optimal layout
3. Check max-width constraints

### 7. Error Handling

#### Network Errors
1. Disconnect internet
2. Try to perform actions
3. Verify error messages display
4. Reconnect
5. Verify retry functionality

#### Invalid Data
1. Submit invalid GraphQL queries
2. Verify graceful error handling
3. Check error messages are user-friendly

#### Form Validation
- Test all form validations
- Verify inline error messages
- Check error clearing on input change

### 8. Performance Testing

#### Load Time
1. Clear cache
2. Load application
3. Measure time to interactive
4. Should be under 3 seconds

#### Bundle Size
1. Run `npm run build`
2. Check `dist` folder size
3. Verify assets are optimized

### 9. Cross-Browser Testing

Test in:
- Chrome
- Firefox
- Safari
- Edge

Verify:
- Consistent appearance
- All features work
- No console errors

## Automated Testing (Future)

### Unit Tests
```bash
npm run test
```

Test coverage should include:
- Component rendering
- User interactions
- Form validation
- Utility functions
- API integration

### E2E Tests
```bash
npm run test:e2e
```

End-to-end tests should cover:
- Complete user flows
- Authentication flow
- Post creation and interaction
- Navigation

## Test Data

### Sample Users
- Username: `testuser`, Password: `testpass123`
- Username: `demo`, Password: `demo1234`

### Sample Posts
Create posts with:
- Short content (< 50 chars)
- Medium content (100-300 chars)
- Long content (400-500 chars)
- Special characters
- Emojis

## Performance Metrics

Target metrics:
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms

## Accessibility Testing

1. Keyboard navigation
2. Screen reader compatibility
3. Color contrast (WCAG AA)
4. Focus indicators
5. ARIA labels

## Bug Reporting

When reporting bugs, include:
1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Browser and version
5. Screenshots/videos
6. Console errors
7. Network requests

## Test Checklist

Use this checklist for complete testing:

- [ ] User registration works
- [ ] User login works
- [ ] Protected routes work
- [ ] Logout works
- [ ] Posts display correctly
- [ ] Create post works
- [ ] Like/unlike works
- [ ] Share post works
- [ ] Comments work
- [ ] Search works
- [ ] Profile displays
- [ ] Mobile responsive
- [ ] Tablet responsive
- [ ] Desktop responsive
- [ ] Error handling works
- [ ] Loading states show
- [ ] Toast notifications work
- [ ] Auto-refresh works
- [ ] Pagination works
- [ ] Cross-browser compatible
- [ ] No console errors
- [ ] Performance acceptable
