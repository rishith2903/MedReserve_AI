# 🚀 MedReserve Frontend Deployment Guide

## Manual Deployment to GitHub Pages

Since GitHub Actions is having cache issues, we'll use manual deployment which works perfectly.

### Prerequisites
- Node.js 18+ installed
- Git configured with your GitHub account
- Repository access to push to gh-pages branch

### Deployment Steps

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

3. **Build the project**:
   ```bash
   npm run build
   ```

4. **Deploy to GitHub Pages**:
   ```bash
   npm run deploy
   ```

### What happens during deployment:
- ✅ Vite builds the project with correct base path (`/MedReserve-AI/`)
- ✅ gh-pages pushes the `dist` folder to `gh-pages` branch
- ✅ GitHub Pages serves the app from the gh-pages branch

### Your app will be available at:
🌐 **https://rishith2903.github.io/MedReserve-AI/**

### Troubleshooting

**If you see a white page:**
1. Check that the URL matches your repository name
2. Verify the homepage in package.json is correct
3. Ensure the base path in vite.config.js matches

**If deployment fails:**
1. Make sure you have push access to the repository
2. Check that gh-pages package is installed
3. Verify your Git credentials are configured

### PowerShell Script (Windows)
You can also use the provided PowerShell script:
```powershell
.\deploy.ps1
```

### Bash Script (Linux/Mac)
Or use the bash script:
```bash
./deploy.sh
```

---

**Note**: GitHub Actions workflow has been disabled due to cache issues. Manual deployment is more reliable and faster for this project.
