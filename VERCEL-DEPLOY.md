# Deploying to Vercel with Speed Insights

This guide walks you through deploying your Next.js application to Vercel and configuring Speed Insights.

## Prerequisites

1. A GitHub, GitLab, or Bitbucket account
2. Your project pushed to a repository
3. A Vercel account (you can sign up at [vercel.com](https://vercel.com) using your GitHub account)

## Step 1: Prepare Your Project

Make sure your project is ready for deployment:

```bash
# Run build to ensure there are no errors
cd next-app
npm run build
```

Fix any errors before proceeding.

## Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New" > "Project"
3. Import your repository
4. Configure project settings:
   - Framework Preset: Next.js
   - Root Directory: next-app
   - Build Command: (leave as default)
   - Output Directory: (leave as default)
5. Click "Deploy"

Vercel will automatically build and deploy your project. Once complete, you'll get a URL where your site is live.

## Step 3: Configure Speed Insights

Speed Insights is already integrated into your application, but you need to enable it in the Vercel dashboard:

1. Go to your project in the Vercel dashboard
2. Click on "Analytics" in the top navigation
3. In the submenu, click on "Speed Insights"
4. Click "Enable Speed Insights"

## Step 4: Custom Domain (Optional)

To use a custom domain:

1. Go to your project in the Vercel dashboard
2. Click on "Settings" > "Domains"
3. Add your domain and follow the instructions to set up DNS

## Step 5: Environment Variables (If Needed)

If your application requires environment variables:

1. Go to your project in the Vercel dashboard
2. Click on "Settings" > "Environment Variables"
3. Add your variables (e.g., API keys, database connection strings)

## Step 6: Viewing Speed Insights Data

After deploying and getting some traffic to your site:

1. Go to your project in the Vercel dashboard
2. Click on "Analytics" > "Speed Insights"
3. View the collected metrics:
   - Core Web Vitals
   - Page load times
   - User experience metrics
   - Performance by page
   - Performance by device type
   - Performance by browser

## Step 7: Continuous Deployment

Vercel automatically sets up continuous deployment:

1. When you push changes to your repository, Vercel automatically rebuilds and deploys
2. Preview deployments are created for pull requests
3. Production deployments happen when you merge to the main branch

## Troubleshooting

If you encounter issues with Speed Insights:

1. Make sure the `@vercel/speed-insights` package is installed
2. Verify that the `<SpeedInsights />` component is included in your pages
3. Check the Vercel documentation: [Speed Insights Docs](https://vercel.com/docs/concepts/speed-insights) 