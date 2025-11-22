const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const TurndownService = require('turndown');
const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced'
});

const postsDirectory = path.join(process.cwd(), 'blogposts');

function convertHtmlToMdx() {
    const fileNames = fs.readdirSync(postsDirectory);

    fileNames.forEach((fileName) => {
        if (!fileName.endsWith('.html')) return;

        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const $ = cheerio.load(fileContents);

        // Extract Metadata
        const title = $('title').text() || 'No Title';
        const subtitle = $('.p-summary').text().trim() || '';

        // Extract date from filename
        const dateMatch = fileName.match(/^(\d{4}-\d{2}-\d{2})/);
        const date = dateMatch ? dateMatch[1] : '1970-01-01';

        // Extract Content
        const contentSection = $('.e-content');

        // Clean up content before conversion
        contentSection.find('h1').remove(); // Remove title from body
        contentSection.find('*').removeAttr('class').removeAttr('id').removeAttr('style').removeAttr('name').removeAttr('data-field');

        // Convert to Markdown
        const markdown = turndownService.turndown(contentSection.html() || '');

        // Create Frontmatter
        const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
subtitle: "${subtitle.replace(/"/g, '\\"')}"
date: "${date}"
---

`;

        // Write MDX file
        const mdxFileName = fileName.replace(/\.html$/, '.mdx');
        const mdxPath = path.join(postsDirectory, mdxFileName);
        fs.writeFileSync(mdxPath, frontmatter + markdown);

        console.log(`Converted ${fileName} to ${mdxFileName}`);
    });
}

convertHtmlToMdx();
