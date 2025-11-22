import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import rehypePrism from 'rehype-prism-plus';

const postsDirectory = path.join(process.cwd(), 'blogposts');

export function getSortedPostsData() {
    // Get file names under /blogposts
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames.map((fileName) => {
        // Only process .mdx files
        if (!fileName.endsWith('.mdx')) {
            return null;
        }

        // Remove ".mdx" from file name to get id
        const id = fileName.replace(/\.mdx$/, '');

        // Read markdown file as string
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents);

        // Extract first image from content if not in frontmatter (optional, but good for consistency)
        // For MDX, we might want to rely on frontmatter or regex on the content string
        let image = null;
        const imageMatch = matterResult.content.match(/!\[.*?\]\((.*?)\)/);
        if (imageMatch) {
            image = imageMatch[1];
        }

        return {
            id,
            ...matterResult.data,
            image
        };
    }).filter(Boolean); // Filter out nulls (non-mdx files)

    // Sort posts by date
    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}

export function getAllPostIds() {
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames.map((fileName) => {
        if (!fileName.endsWith('.mdx')) return null;
        return {
            params: {
                slug: fileName.replace(/\.mdx$/, ''),
            },
        };
    }).filter(Boolean);
}

export async function getPostData(slug) {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Serialize the content string with plugins for GitHub-flavored markdown and syntax highlighting
    let mdxSource;
    try {
        mdxSource = await serialize(matterResult.content, {
            mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypePrism]
            }
        });
    } catch (err) {
        // Fallback: basic serialization if plugin pipeline fails for any reason
        console.warn('MDX serialization with plugins failed, falling back to basic serialization:', err?.message);
        mdxSource = await serialize(matterResult.content);
    }

    // Calculate reading time
    const wordCount = matterResult.content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // 200 words per minute

    // Default Author Info
    const author = {
        name: 'Kostas',
        avatar: 'https://pbs.twimg.com/profile_images/1324840358405046272/mAwSPmaX_400x400.jpg'
    };

    return {
        slug,
        mdxSource,
        readingTime,
        author,
        ...matterResult.data
    };
}
