import { load_markdown_content } from '$lib/utils/markdown';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const { slug } = params;

	if (!slug) {
		throw error(404, 'Resource not found');
	}

	try {
		return load_markdown_content(`resources/${slug}.md`, params);
	} catch (e) {
		console.error(`Error loading resource: ${slug}`, e);
		throw error(404, 'Resource not found');
	}
};
