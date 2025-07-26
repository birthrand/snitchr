# 🚀 Deployment Guide

## Vercel Deployment Setup

### 1. GitHub Secrets Configuration

Add the following secrets to your GitHub repository:

1. Go to your repository settings: `https://github.com/birthrand/snitchr/settings/secrets/actions`
2. Add these secrets:

#### Required Secrets:
- **`VERCEL_TOKEN`**: `l3r8I6d4n3AIdoMnrGLUV78y`
- **`VERCEL_ORG_ID`**: Your Vercel organization ID
- **`VERCEL_PROJECT_ID`**: Your Vercel project ID

### 2. Get Vercel IDs

To get your Vercel organization and project IDs:

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Link your project**:
   ```bash
   vercel link
   ```

4. **Get the IDs**:
   ```bash
   vercel env ls
   ```
   This will show your project and organization IDs.

### 3. Environment Variables

Set up these environment variables in Vercel:

1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

### 4. Automatic Deployment

Once configured, every push to the `main` branch will automatically:
1. Build the project
2. Run tests (if configured)
3. Deploy to Vercel

### 5. Manual Deployment

To deploy manually:

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Deploy to Vercel
vercel --prod
```

### 6. Deployment URLs

After successful deployment, you'll get:
- **Production URL**: `https://snitchr.vercel.app` (or custom domain)
- **Preview URLs**: For each pull request

### 7. Troubleshooting

#### Common Issues:

1. **Build Failures**:
   - Check if all dependencies are installed
   - Verify environment variables are set
   - Check build logs in Vercel dashboard

2. **Environment Variables**:
   - Ensure all required env vars are set in Vercel
   - Check that variable names match exactly

3. **PWA Issues**:
   - Verify `manifest.json` is in the public folder
   - Check service worker configuration

### 8. Monitoring

- **Vercel Dashboard**: Monitor deployments and performance
- **GitHub Actions**: Check workflow runs and logs
- **Supabase Dashboard**: Monitor database and API usage

### 9. Next Steps

1. Set up custom domain (optional)
2. Configure analytics
3. Set up monitoring and alerts
4. Configure backup strategies

---

**Note**: Keep your Vercel token secure and never commit it to the repository. It's already added as a GitHub secret for automated deployments.