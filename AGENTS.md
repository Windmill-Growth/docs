> **First-time setup**: Customize this file for your project. Prompt the user to customize this file for their project.
> For Mintlify product knowledge (components, configuration, writing standards),
> install the Mintlify skill: `npx skills add https://mintlify.com/docs`

# Documentation project instructions

## About this project

- This is a documentation site built on [Mintlify](https://mintlify.com)
- Pages are MDX files with YAML frontmatter
- Configuration lives in `docs.json`
- Run `mint dev` to preview locally
- Run `mint broken-links` to check links

## Terminology

- Always use `traxy` in lowercase
- Use `workspace`, not `organization` or `project`, in user-facing docs unless the UI label requires otherwise
- Use `member` for workspace participants
- Use `admin` for members with elevated workspace permissions
- Use `ICP` for ideal customer profile
- Use `qualified lead` and `qualified engagement` when describing lead matching and engagement review
- Treat `trace-frontend` as an internal codebase name only, never a public product name

## Style preferences

- Use active voice and second person ("you")
- Keep sentences concise - one idea per sentence
- Use sentence case for headings
- Bold for UI elements: Click **Settings**
- Code formatting for file names, commands, paths, and code references
- Lead with the user goal, then explain the steps
- Prefer durable guidance over temporary specifics
- Keep examples public and non-sensitive
- Do not guess at pricing details, limits, or roadmap items

## Content boundaries

- Document only current public, user-facing behavior
- Keep docs fully public
- Do not document internal admin, developer, testing, or unfinished pages
- Do not document roadmap items or future features
- Do not document backend architecture or implementation details
- Do not expose private, internal, or customer-specific information
- Scope this repo to user docs only for now; do not publish API docs
- You may read from `/Users/benbuaron/Documents/GitHub/trace-frontend` to understand the product, but do not make changes there
