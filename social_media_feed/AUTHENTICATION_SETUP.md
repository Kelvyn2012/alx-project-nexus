# Authentication Features Setup Guide

This document provides setup instructions for the Forgot Password and Google Sign-In features.

## Features Implemented

1. **Forgot Password / Password Reset**
   - Request password reset via email
   - Secure token-based password reset
   - Token expiration (24 hours)

2. **Google Sign-In (OAuth)**
   - One-click authentication with Google
   - Automatic user creation for new Google users
   - Profile picture sync from Google account

## Backend Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

New dependencies added:
- `google-auth==2.35.0`
- `google-auth-oauthlib==1.2.1`
- `google-auth-httplib2==0.2.0`

### 2. Database Migration

Create and run migrations for the new `PasswordResetToken` model:

```bash
python manage.py makemigrations
python manage.py migrate
```

### 3. Environment Configuration

Create a `.env` file based on `.env.example` and configure the following:

#### Email Configuration (for Password Reset)

For development (prints emails to console):
```env
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

For production (using Gmail):
```env
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=noreply@yourdomain.com
```

**Note:** For Gmail, you need to create an [App Password](https://support.google.com/accounts/answer/185833).

#### Google OAuth Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" > "Create Credentials" > "OAuth 2.0 Client ID"
5. Configure OAuth consent screen
6. Create OAuth 2.0 Client ID (Web application)
7. Add authorized JavaScript origins:
   - `http://localhost:5173` (development)
   - Your production frontend URL
8. Add authorized redirect URIs:
   - `http://localhost:5173` (development)
   - Your production frontend URL

Add to `.env`:
```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
FRONTEND_URL=http://localhost:5173
```

## Frontend Setup

### 1. Environment Configuration

Create `frontend/.env` based on `frontend/.env.example`:

```env
VITE_GRAPHQL_API_URL=http://localhost:8000/graphql/
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

### 2. New Routes Added

- `/forgot-password` - Request password reset
- `/reset-password?token=xxx` - Reset password with token

## GraphQL API

### New Mutations

#### 1. Request Password Reset

```graphql
mutation RequestPasswordReset($email: String!) {
  requestPasswordReset(email: $email) {
    success
    message
    errors
  }
}
```

#### 2. Reset Password

```graphql
mutation ResetPassword($token: String!, $newPassword: String!) {
  resetPassword(token: $token, newPassword: $newPassword) {
    success
    message
    errors
  }
}
```

#### 3. Google Sign-In

```graphql
mutation GoogleSignIn($token: String!) {
  googleSignIn(token: $token) {
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
```

## Testing

### Test Password Reset Flow

1. Navigate to `/login`
2. Click "Forgot password?"
3. Enter your email address
4. Check console (development) or email inbox (production)
5. Copy the reset link
6. Visit the link and enter a new password
7. Log in with the new password

### Test Google Sign-In

1. Navigate to `/login`
2. Click "Sign in with Google"
3. Select your Google account
4. You'll be automatically logged in

**First-time users:** A new account will be created automatically using your Google email.

## Security Considerations

1. **Password Reset Tokens**
   - Tokens expire after 24 hours
   - Tokens are single-use only
   - Tokens are cryptographically secure (using `secrets.token_urlsafe`)

2. **Email Security**
   - For security, the system doesn't reveal whether an email exists in the database
   - Always shows success message to prevent email enumeration

3. **Google OAuth**
   - Tokens are verified server-side using Google's official library
   - Only verified Google accounts can authenticate
   - Client ID and secret must be kept secure

## Troubleshooting

### Password Reset Email Not Sending

- Check `EMAIL_BACKEND` setting
- Verify Gmail App Password (not regular password)
- Check email service quotas

### Google Sign-In Not Working

- Verify `VITE_GOOGLE_CLIENT_ID` in frontend `.env`
- Check authorized JavaScript origins in Google Console
- Ensure Google+ API is enabled
- Check browser console for errors

### CORS Issues

- Verify frontend URL is in `CORS_ALLOWED_ORIGINS` in `settings.py`
- Check that the frontend is running on the expected port

## Production Deployment

### Backend (Render/Heroku)

Add environment variables:
```
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=noreply@yourdomain.com
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
FRONTEND_URL=https://your-frontend-url.com
```

### Frontend (Vercel/Netlify)

Add environment variables:
```
VITE_GRAPHQL_API_URL=https://your-backend-url.com/graphql/
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

### Google Cloud Console

Update authorized origins and redirect URIs to include production URLs.

## Support

For issues or questions:
1. Check this documentation
2. Review Django logs for backend issues
3. Check browser console for frontend issues
4. Verify environment variables are set correctly
