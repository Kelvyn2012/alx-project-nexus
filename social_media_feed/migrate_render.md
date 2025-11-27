# Run Migrations on Render

## Quick Fix (One-Time)

1. Go to: https://dashboard.render.com
2. Click on your service: `alx-project-nexus-vetk`
3. Click **"Shell"** in the left sidebar
4. Run this command:
   ```bash
   python manage.py migrate
   ```
5. You should see output like:
   ```
   Running migrations:
     Applying contenttypes.0001_initial... OK
     Applying auth.0001_initial... OK
     Applying admin.0001_initial... OK
     ...
   ```

## Permanent Fix (Recommended)

Update your build command to run migrations automatically on every deploy:

1. Go to Render Dashboard
2. Click your service: `alx-project-nexus-vetk`
3. Go to **"Settings"** tab
4. Scroll to **"Build Command"**
5. Change from:
   ```bash
   pip install -r requirements.txt
   ```
   To:
   ```bash
   pip install -r requirements.txt && python manage.py migrate
   ```
6. Click **"Save Changes"**
7. Click **"Manual Deploy"** → **"Deploy latest commit"**

This ensures all future deployments run migrations automatically.

## Verify It Worked

After running migrations, test your API:

```bash
curl -X POST https://alx-project-nexus-vetk.onrender.com/graphql/ \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __typename }"}'
```

Should return:
```json
{"data":{"__typename":"Query"}}
```

No more "relation does not exist" errors!
