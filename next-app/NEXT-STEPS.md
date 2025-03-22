# Next Steps for Completing the Migration

We've created a solid foundation for the Next.js migration with placeholder pages for all routes. Here are the remaining steps needed to complete the migration:

## 1. Fix Missing Images

- [ ] Copy all required images from the original site to `public/images/`
- [ ] Create/find the Twitter and LinkedIn icons needed for the author section
- [ ] Create an EDR telemetry logo for `public/images/edr_telemetry_logo.png`

## 2. Migrate Content for Each Page

For each of the following pages, transfer the full content from the HTML version:

- [ ] Windows page (`pages/windows.js`) - Replace placeholder with content from `windows.html`
- [ ] Linux page (`pages/linux.js`) - Replace placeholder with content from `linux.html`
- [ ] Scores page (`pages/scores.js`) - Replace placeholder with content from `scores.html`
- [ ] Roadmap page (`pages/roadmap.js`) - Replace placeholder with content from `roadmap.html`
- [ ] Blog page (`pages/blog.js`) - Replace placeholder with content from `blog.html`
- [ ] Premium Services page (`pages/premium-services.js`) - Replace placeholder with content from `premium_services.html`
- [ ] Eligibility page (`pages/eligibility.js`) - Replace placeholder with content from `eligibility.html`
- [ ] MITRE Mappings page (`pages/mitre-mappings.js`) - Replace placeholder with content from `mitre_mappings.html`
- [ ] Sponsorship page (`pages/sponsorship.js`) - Replace placeholder with content from `sponsorship.html`
- [ ] Contact page (`pages/contact.js`) - Replace placeholder with content from `contact.html`
- [ ] Contribute page (`pages/contribute.js`) - Replace placeholder with content from `contribute.html`

## 3. Convert JavaScript Files to React Components/Hooks

- [ ] Create `hooks/useSnow.js` (already partially implemented in `utils/common.js`)
- [ ] Convert `js/scores.js` to React components or hooks
- [ ] Convert `js/roadmap.js` to React components or hooks
- [ ] Convert the remaining JavaScript functionality from `js/scoring.js`
- [ ] Convert `js/linux_res_pull.js` to a React component or API route
- [ ] Convert `js/windows_res_pull.js` to a React component or API route

## 4. Add Missing Utilities

- [ ] Create a component for data tables
- [ ] Create a component for product cards
- [ ] Create a component for filtering and sorting functionality

## 5. Fix Styling Issues

- [ ] Update `styles/global.css` to include all global styles
- [ ] Update `styles/heading-links.css` to match the original
- [ ] Update `styles/table-improvements.css` to match the original
- [ ] Create additional CSS modules for page-specific styles if needed

## 6. Setup CI/CD

- [ ] Configure Vercel project
- [ ] Set up deployment automation
- [ ] Configure Vercel Speed Insights analytics

## 7. Documentation

- [ ] Document the migration process
- [ ] Create documentation for future maintenance
- [ ] Update contributor guidelines

## 8. Testing

- [ ] Test all pages in various browsers
- [ ] Test mobile responsiveness
- [ ] Test all interactive elements
- [ ] Verify all links work correctly

## Process for Converting Each Page

Follow this process for each page:

1. Open the HTML file (e.g., `windows.html`)
2. Open the corresponding Next.js file (e.g., `pages/windows.js`)
3. Copy the main content from the HTML file
4. Convert HTML to JSX:
   - Change `class` to `className`
   - Close all tags properly (`<img />` instead of `<img>`)
   - Convert inline styles to objects if present
   - Wrap JavaScript expressions in curly braces
5. Replace `<a href="pagename.html">` with `<Link href="/pagename">`
6. Move any `<script>` content to the `useEffect` hook
7. Replace DOM manipulation with React state
8. Add the `useHeadingLinks()` hook if the page has headings with IDs
9. Add the `createSnow()` function if the page has a snow effect
10. Test the page

## Command to Start Development Server

```bash
cd next-app
npm run dev
```

This starts the server at http://localhost:3000 where you can preview your work. 