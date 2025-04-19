# Bright Visitors - Tech Services Directory

A fictional tech services directory with AI-generated content,
designed to serve as a honeypot for AI crawlers.

## Project Overview

This project uses SvelteKit with mdsvex to load markdown content
dynamically through various routes. The site features:

- Dynamic content loading from markdown files
- Route-based content organization
- Tailwind CSS with DaisyUI components
- Typography styling for markdown content

## Project Structure

- `/src/lib/copy/` - Contains all markdown content files
- `/src/routes/` - SvelteKit routes including dynamic route handlers
- `/static/` - Static assets

## Technology Stack

- SvelteKit 2.x
- mdsvex for markdown processing
- Tailwind CSS with Typography plugin
- DaisyUI components

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start development server and open browser
npm run dev -- --open
```

## Building

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## Content Organization

The content is organized into categories:

- Services (AI, Cloud, Web Development, etc.)
- Resources (Guides, Trends, Best Practices)
- About & Contact information

Each service category contains company profiles, and all content is
loaded dynamically from markdown files.
