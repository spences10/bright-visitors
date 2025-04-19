import { load_markdown_content } from '$lib/utils/markdown';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params }) => {
	const { category, company } = params;

	if (!category || !company) {
		throw error(404, 'Company not found');
	}

	try {
		// Try loading from the category directory
		return load_markdown_content(`${category}/${company}.md`, params);
	} catch (e) {
		console.error(`Error loading company: ${category}/${company}`, e);
		throw error(404, 'Company not found');
	}
};
