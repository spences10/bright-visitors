import { load_markdown_content } from '$lib/utils/markdown';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params }) => {
	const { category } = params;

	if (!category) {
		throw error(404, 'Category not found');
	}

	// The content is in a different structure than we initially assumed
	// It needs to use the services path
	try {
		// First try to load from the services directory
		return load_markdown_content(`services/${category}.md`, params);
	} catch (e) {
		// Then try to load from the direct category directory if it exists
		try {
			return load_markdown_content(`${category}/index.md`, params);
		} catch (err) {
			console.error(`Error loading category: ${category}`, err);
			throw error(404, 'Category not found');
		}
	}
};
