# Deployment Guide

## Quick Deploy Options

### 1. Vercel (Recommended)

Vercel provides the easiest deployment for Vite React apps.

#### Steps:
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Set environment variables in Vercel dashboard:
   - `VITE_GRAPHQL_API_URL`

#### Alternative: GitHub Integration
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import repository
4. Configure environment variables
5. Deploy automatically

### 2. Netlify

#### Steps:
1. Build the project:
   ```bash
   npm run build
   ```

2. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

3. Deploy:
   ```bash
   netlify deploy --prod
   ```

4. Select `dist` as the deploy directory

#### Alternative: Drag and Drop
1. Run `npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Drag `dist` folder to deploy

### 3. GitHub Pages

1. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Update `vite.config.js`:
   ```javascript
   export default defineConfig({
     base: '/repository-name/',
     // ... rest of config
   })
   ```

3. Add to `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

### 4. AWS Amplify

1. Install Amplify CLI:
   ```bash
   npm install -g @aws-amplify/cli
   ```

2. Initialize:
   ```bash
   amplify init
   ```

3. Add hosting:
   ```bash
   amplify add hosting
   ```

4. Publish:
   ```bash
   amplify publish
   ```

### 5. Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf`:
```nginx
server {
    listen 80;
    server_name _;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

Build and run:
```bash
docker build -t social-feed-frontend .
docker run -p 80:80 social-feed-frontend
```

## Environment Variables

Set these in your deployment platform:

| Variable | Value |
|----------|-------|
| `VITE_GRAPHQL_API_URL` | Your GraphQL API endpoint |

## Build Optimization

### 1. Analyze Bundle Size
```bash
npm run build
```

Check the `dist` folder and build output for size information.

### 2. Code Splitting

Already implemented with React lazy loading. To add more:

```javascript
const Profile = lazy(() => import('./pages/Profile'));
```

### 3. Image Optimization

- Use WebP format
- Lazy load images
- Implement responsive images

### 4. Performance Checklist

- [ ] Enable gzip compression
- [ ] Set cache headers
- [ ] Minify assets
- [ ] Remove console.logs
- [ ] Optimize images
- [ ] Enable CDN

## Production Configuration

### 1. Security Headers

Add to your server configuration:
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

### 2. CORS Configuration

Ensure backend allows your frontend domain:
```python
CORS_ALLOWED_ORIGINS = [
    "https://your-frontend-domain.com",
]
```

### 3. SSL/HTTPS

Always use HTTPS in production. Most platforms (Vercel, Netlify) provide this automatically.

## Monitoring

### 1. Error Tracking

Integrate Sentry:
```bash
npm install @sentry/react
```

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
});
```

### 2. Analytics

Add Google Analytics or similar:
```javascript
// Add to index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

## Continuous Deployment

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2

    - name: Setup Node
      uses: actions/setup-node@v2
      with:
        node-version: '18'

    - name: Install dependencies
      run: npm ci

    - name: Build
      run: npm run build
      env:
        VITE_GRAPHQL_API_URL: ${{ secrets.VITE_GRAPHQL_API_URL }}

    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Troubleshooting Deployment

### Issue: Blank page after deployment

**Solution:**
- Check browser console for errors
- Verify API endpoint is correct
- Ensure all environment variables are set
- Check network tab for failed requests

### Issue: 404 on refresh

**Solution:**
- Configure server to serve `index.html` for all routes
- For Netlify, create `_redirects`:
  ```
  /*    /index.html   200
  ```
- For Vercel, create `vercel.json`:
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/" }]
  }
  ```

### Issue: API connection fails

**Solution:**
- Check CORS settings on backend
- Verify API URL is correct
- Ensure backend is deployed and running
- Check network firewall rules

## Post-Deployment Checklist

- [ ] Application loads correctly
- [ ] All pages accessible
- [ ] Authentication works
- [ ] API requests succeed
- [ ] No console errors
- [ ] Mobile responsive
- [ ] HTTPS enabled
- [ ] Environment variables set
- [ ] Error tracking configured
- [ ] Performance acceptable
- [ ] SEO meta tags present

## Rollback Plan

If deployment fails:

1. **Vercel/Netlify:** Use dashboard to rollback to previous deployment
2. **Docker:** Keep previous images tagged
3. **Manual:** Keep backup of previous dist folder

## Custom Domain

### Vercel:
1. Go to project settings
2. Add domain
3. Update DNS records as shown

### Netlify:
1. Go to Domain settings
2. Add custom domain
3. Configure DNS

## Performance Monitoring

Use these tools:
- Google PageSpeed Insights
- Lighthouse
- WebPageTest
- GTmetrix

Target scores:
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

## Scaling

### CDN Configuration
- Enable CDN for static assets
- Use service like Cloudflare
- Configure edge caching

### Load Balancing
For high traffic:
- Deploy to multiple regions
- Use load balancer
- Implement edge functions

## Backup Strategy

1. Regular backups of build artifacts
2. Git tags for releases
3. Database backups (if applicable)
4. Environment variable backups

---

**Need help?** Check the main README or create an issue.
