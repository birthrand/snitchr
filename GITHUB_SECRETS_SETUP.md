# 🔐 GitHub Secrets Setup

## Required Secrets for Vercel Deployment

Add these secrets to your GitHub repository at: `https://github.com/birthrand/snitchr/settings/secrets/actions`

### 1. VERCEL_TOKEN
**Value**: `l3r8I6d4n3AIdoMnrGLUV78y`

### 2. VERCEL_ORG_ID  
**Value**: `team_PJvaxrChKbx5NdX2cpDEU00s`

### 3. VERCEL_PROJECT_ID
**Value**: `prj_2vBme4KIfXSoG15cl0wzkFXI1gU2`

## How to Add Secrets:

1. Go to your repository: https://github.com/birthrand/snitchr
2. Click **Settings** tab
3. Click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add each secret with the exact name and value above

## Verification:

After adding the secrets, the next push to main branch will automatically:
- ✅ Build the project
- ✅ Run linting
- ✅ Deploy to Vercel
- ✅ Use your provided Vercel project

## Deployment URL:

Once deployed, your app will be available at:
`https://snitchr.vercel.app` (or your custom domain)

---

**Note**: These secrets are now configured for your specific Vercel project and organization.