import { error } from '@sveltejs/kit';
import type { Component } from 'svelte';

export interface MarkdownContent {
	metadata: {
		title: string;
		description?: string;
		date?: string;
		tags?: string[];
		published?: boolean;
		[key: string]: any;
	};
	default: Component;
}

export async function load_markdown_content(
	path: string,
	params?: Record<string, string>,
) {
	try {
		const post = (await import(`../copy/${path}`)) as MarkdownContent;

		return {
			content: post.default,
			frontmatter: {
				...post.metadata,
				slug: params?.slug || '',
			},
		};
	} catch (e) {
		console.error(`Error loading markdown content: ${path}`, e);
		throw error(404, 'Content not found');
	}
}
