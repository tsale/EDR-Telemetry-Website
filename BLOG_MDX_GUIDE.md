# Blog MDX Authoring & Rendering Guide

_Last updated: 2025-11-22_

## 1. What Changed in `pages/blog/[slug].js`
We refactored the blog post rendering pipeline to make MDX the single source of truth for titles, structure, and rich content styling.

### Summary of Modifications
- Removed hard‑coded `<h1>` / `<h2>` title + subtitle injection. MDX now supplies its own heading hierarchy (you should include an H1 at the top of the MDX file).
- Added a lightweight header section that only shows author avatar/initial, name, reading time, and date.
- Wrapped article content in a semantic container: `<div class="prose prose-lg max-w-none mdx-article-content">` instead of a long chain of utility classes.
- Introduced GitHub‑flavored Markdown (GFM) and syntax highlighting via:
  - `remark-gfm` (tables, strikethrough, task lists, autolinks)
  - `rehype-prism-plus` (code block highlighting + inline diff support, optional line highlighting)
- Added resilient fallback serialization (try/catch) so a plugin failure doesn’t break the build.
- Implemented comprehensive custom styles in `styles/globals.css` under the `.mdx-article-content` namespace (headings, lists, ordered counters, code blocks, inline code, blockquotes, tables, images, horizontal rules).

### Rendering Flow
1. `getPostData(slug)` reads MDX from `blogposts/<slug>.mdx`.
2. Gray‑matter parses frontmatter (metadata) and strips it from content.
3. Content goes through `serialize()` with `remark-gfm` and `rehype-prism-plus`.
4. Page component receives `mdxSource`, passes it to `<MDXRemote />`.
5. Styling applied via Tailwind typography base + our extended CSS rules.

## 2. Authoring New MDX Articles
All blog articles live in `blogposts/` and use the `.mdx` extension.

### Required Frontmatter
At minimum include these fields:
```mdx
---
title: "Your Post Title"
subtitle: "Optional descriptive subtitle"
date: "2025-11-22"  # ISO format recommended (YYYY-MM-DD)
image: "/images/optional-cover.png"  # (optional) used for listing card
---
```
Optional extra fields you can add (supported but not yet consumed everywhere):
```yaml
tags: [telemetry, linux, windows]
author: "Override Name"   # Defaults to Kostas if omitted
```

### Heading Conventions
- Start the document with a single `# H1` matching the frontmatter title OR a refined version of it.
- Use `##` for major sections; `###` / `####` for nested subsections.
- Avoid skipping levels (e.g., don’t jump from `##` directly to `####`).
- Keep heading text concise; rely on paragraphs for detail.

### Paragraphs & Spacing
- A blank line between paragraphs is enough; extra `<br />` tags are unnecessary.
- Emphasis: `*italic*`, `**bold**`, `***bold italic***`.

### Lists
Unordered:
```mdx
- First point
- Second point with **emphasis**
  - Nested detail
```
Ordered:
```mdx
1. Step one
2. Step two
   1. Sub-step A
   2. Sub-step B
```
Our CSS transforms bullets into blue filled circles and ordered indices into numbered badges—no need to customize manually.

### Inline Code
Use backticks for short identifiers:
`` `sysmon` `` or `` `/var/log/auth.log` ``.
Avoid wrapping entire paragraphs—prefer fenced code blocks.

### Code Blocks
Use fenced blocks with a language identifier for highlighting:
```bash
sudo auditctl -w /etc/passwd -p wa -k passwd_changes
```
```python
import os
print(os.getenv("HOME"))
```
Supported Prism languages include: bash, sh, powershell, python, json, yaml, javascript/ts, diff, docker, markdown, etc.
If a language isn’t recognized it will still render, just without token colors.

#### Advanced (optional)
You can highlight specific lines using Prism’s diff or by applying inline marks:
```diff
+ Added important logic
- Removed insecure call
```

### Blockquotes
Use `>` for callouts:
```mdx
> Important: Enable Auditd before configuring process execution rules.
```
They render with a left border + subtle gradient background.

### Tables
GitHub‑flavored Markdown enables pipe tables:
```mdx
| Event ID | Meaning                | Platform |
|----------|------------------------|----------|
| 4624     | Successful logon       | Windows  |
| 4688     | Process creation       | Windows  |
```
Keep tables narrow—avoid excessive columns. For large datasets consider linking to a dedicated comparison page.

### Images
```mdx
![Alt text describing image](/images/diagram.png)
```
They will get rounded corners + shadow automatically. Prefer compressed `.webp` or `.png` when practical.

### Horizontal Rules
Use `---` to create a thematic break between major sections.

### Admonitions / Callouts
We currently rely on blockquotes for notes. If richer admonitions are desired (e.g., Tip, Warning) we can later add a remark plugin (proposed: `remark-directive`).

## 3. Styling Guarantees
| Element          | Behavior / Styling Summary                                    |
|------------------|---------------------------------------------------------------|
| Headings         | Scaled, negative letter-spacing for optical alignment         |
| Bulleted list    | Custom blue circular bullets w/ subtle outer glow             |
| Ordered list     | Blue circular numbered badges (counter reset per list)        |
| Inline code      | Light badge, mono font, subtle border                         |
| Code blocks      | Dark theme, language label, scrollable horizontal overflow    |
| Blockquotes      | Left border + gradient + larger readable font                 |
| Tables           | Zebra stripes, subtle borders, styled header background       |
| Images           | Centered, shadow, rounded corners                             |
| HR               | Wide spacing before/after, light border                       |

## 4. Content Quality Guidelines
- Aim for paragraphs ≤ 4 lines for readability.
- Prefer active voice and concrete examples.
- Use lists to break up dense conceptual sections.
- Include at least one code block if the topic is technical.
- Always verify paths / commands in a test environment before publishing.

## 5. Common Pitfalls & How to Avoid Them
| Pitfall | Fix |
|---------|-----|
| Missing H1 | Add `# Title` at top; frontmatter alone no longer injects it. |
| Very long code lines | Add manual line breaks or use backslashes for multiline readability. |
| Table overflow | Reduce columns or abbreviate headers; link to full reference. |
| Inline HTML | Favor Markdown syntax—HTML may bypass styling defaults. |
| Mixed heading depths | Maintain sequential structure (`#` then `##`, then `###`). |

## 6. Extensibility Roadmap (Optional Future Enhancements)
- Line numbers for code blocks (via `rehype-prism-plus` configuration + CSS).
- Copy-to-clipboard button overlay on code blocks.
- Admonition directives (remark-directive + custom components).
- MDX components for embedding telemetry comparison snippets.

## 7. Quick Starter Template
Copy this into a new file under `blogposts/`:
```mdx
---
title: "Post Title"
subtitle: "Short descriptive subtitle"
date: "2025-11-22"
image: "/images/post-title.png"
---

# Post Title

Intro paragraph (2–4 lines) setting context.

## Section One

Explain a concept.

- Key point one
- Key point two

```bash
# Example command
auditctl -w /etc/passwd -p wa -k passwd_changes
```

> Tip: Keep your Auditd rules documented in version control.

## Conclusion
Wrap up and link to further resources.
```

## 8. Validation Checklist Before Commit
- Frontmatter date correct & consistent format.
- Single H1 present.
- No empty list items.
- Code fences include language identifiers.
- Images compressed & path valid.
- Spellcheck critical terms (telemetry names, event IDs).

## 9. Troubleshooting
| Issue | Cause | Resolution |
|-------|-------|------------|
| No syntax colors | Language not supported or typo | Use valid Prism language id (e.g. `bash`, `python`). |
| Bullets look default | Cached stylesheet | Hard refresh (Cmd+Shift+R) / ensure `.mdx-article-content` styles not overridden. |
| MDX build error | Invalid frontmatter YAML | Validate with an online YAML parser. |
| Title missing | Forgot to add `#` heading | Add H1 at top of file. |

---
For questions or to propose enhancements, open an issue or add a note to the roadmap.
