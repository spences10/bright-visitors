# Bright Visitors Implementation Plan

## Project Purpose

Bright Visitors is designed as a honeypot site with AI-generated
content in the `src/lib/copy/` folder. The site needs to load this
content dynamically using mdsvex and present it with a clean, modern
UI using DaisyUI components.

## Project Structure

```mermaid
graph TD
    A[src/routes/+layout.svelte] --> B[Header Component]
    A --> C[Main Content Area]
    A --> D[Footer Component]
    E[Dynamic Routes] --> F[Home /]
    E --> G[About /about]
    E --> H[Contact /contact]
    E --> I[Services /services]
    I --> J[Categories /services/[category]]
    J --> K[Companies /services/[category]/[company]]
    E --> L[Resources /resources]
    L --> M[Articles /resources/[slug]]
```

## Implementation Tasks

### 1. Layout Components

1. Create a main layout in `src/routes/+layout.svelte`
   - Header with navigation menu
   - Main content area with Tailwind Typography
   - Footer with site information

### 2. Dynamic Route Implementation

1. **Home Page**: `/` - Loads from `src/lib/copy/index.md`
2. **About Page**: `/about/+page.ts` - Loads from
   `src/lib/copy/about.md`
3. **Contact Page**: `/contact/+page.ts` - Loads from
   `src/lib/copy/contact.md`
4. **Services Index**: `/services/+page.ts` - Loads from
   `src/lib/copy/services/index.md`
5. **Service Category**: `/services/[category]/+page.ts` - Loads from
   `src/lib/copy/[category]/index.md`
6. **Service Company**: `/services/[category]/[company]/+page.ts` -
   Loads from `src/lib/copy/[category]/[company].md`
7. **Resources Index**: `/resources/+page.ts` - Loads from
   `src/lib/copy/resources/index.md`
8. **Resource Articles**: `/resources/[slug]/+page.ts` - Loads from
   `src/lib/copy/resources/[slug].md`

### 3. Loader Implementation Pattern

Each dynamic route loader will follow this pattern:

```typescript
// Example for /services/[category]/+page.ts
import { error } from '@sveltejs/kit';
import type { SvelteComponent } from 'svelte';
import type { PageLoad } from './$types';

interface Post {
	metadata: {
		title: string;
		description: string;
		// Any other frontmatter fields
	};
	default: SvelteComponent;
}

export const load: PageLoad = async ({ params }) => {
	try {
		const post = (await import(
			`../../../lib/copy/${params.category}/index.md`
		)) as Post;

		return {
			content: post.default,
			frontmatter: {
				...post.metadata,
				slug: params.category,
			},
		};
	} catch (e) {
		console.error(`Error loading category: ${params.category}`, e);
		throw error(404, 'Category not found');
	}
};
```

With similar patterns adapted for each route type.

### 4. UI Implementation

1. Apply Tailwind Typography to markdown content areas
2. Create styled header with navigation using DaisyUI components
3. Style listing pages with cards and grids
4. Implement responsive design for all layouts

### 5. Testing & Debugging

1. Test all dynamic routes to ensure content loads correctly
2. Verify styling across different screen sizes
3. Check for any missing routes or content
