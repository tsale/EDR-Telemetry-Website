# Migration Guide: Converting Static HTML to Next.js

This guide will help you convert the remaining HTML pages, CSS, and JavaScript to the Next.js application.

## Current Progress

We've already:
1. Set up a Next.js project with Vercel Speed Insights
2. Created a component structure for the application
3. Migrated the primary CSS files to `styles/`
4. Converted the index page and about page
5. Created reusable components for navigation and layout

## Remaining Steps

### 1. Convert HTML Pages to Next.js Pages

For each HTML file in the root directory, create a corresponding `.js` file in the `pages/` directory:

```
about.html → pages/about.js
blog.html → pages/blog.js
contact.html → pages/contact.js
contribute.html → pages/contribute.js
eligibility.html → pages/eligibility.js
linux.html → pages/linux.js
mitre_mappings.html → pages/mitre-mappings.js
premium_services.html → pages/premium-services.js
roadmap.html → pages/roadmap.js
scores.html → pages/scores.js
sponsorship.html → pages/sponsorship.js
windows.html → pages/windows.js
```

Use the `TemplatePage` component as a starting point for each page conversion.

### 2. Converting JavaScript Files

JavaScript files in the `js/` directory need to be converted to React components or hooks:

1. **heading-links.js** - Create a React hook in `hooks/useHeadingLinks.js`
2. **contributors.js** - Already converted to `components/Contributors.js`
3. **scores.js** - Create a component in `components/Scores.js`
4. **roadmap.js** - Create a component in `components/Roadmap.js`
5. **scoring.js** - Create utility functions in `utils/scoring.js`
6. **linux_res_pull.js** - Create a component or API route in `pages/api/linux-resources.js`
7. **windows_res_pull.js** - Create a component or API route in `pages/api/windows-resources.js`

### 3. Converting Page Structure

For each page:

1. Copy HTML content from the static HTML file
2. Convert HTML tags to JSX (camelCase attributes, className instead of class)
3. Replace `<a href>` with Next.js `<Link>` components for internal navigation
4. Move any inline JavaScript to React hooks (useEffect)
5. Convert any document.querySelector or DOM manipulation to React state

### 4. Example Conversion Process

Here's an example of how to convert a page:

1. Create a new file in the `pages/` directory (e.g., `windows.js`)
2. Copy the HTML content from the corresponding HTML file
3. Use the `TemplatePage` component as a wrapper
4. Transform the HTML to React JSX syntax
5. Convert any JavaScript to React hooks
6. Test the page in the browser

### 5. CSS Adjustments

Ensure all CSS classes work with the Next.js application:

1. Use CSS modules for page-specific styles if needed
2. Add any missing styles to the global CSS files

### 6. Static Assets

Make sure all static assets are properly referenced:

1. Images should be in `public/images/`
2. Data files should be in `public/data/`
3. Reference them with paths like `/images/filename.jpg`

## Next Steps

After converting all pages:

1. Test thoroughly in the browser
2. Deploy to Vercel to start collecting Speed Insights metrics
3. Set up redirects from the old static site URLs to the new Next.js app

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Vercel Speed Insights](https://vercel.com/docs/speed-insights) 