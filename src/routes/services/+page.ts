import { load_markdown_content } from '$lib/utils/markdown';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	return load_markdown_content('services/index.md');
};
