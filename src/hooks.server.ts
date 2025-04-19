import {
	create_or_update_session,
	record_page_visit,
} from '$lib/reporting';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// Get user info from request
	const ip_address = event.getClientAddress();
	const user_agent = event.request.headers.get('user-agent');
	const referrer = event.request.headers.get('referer');

	try {
		// Track session
		const session_id = await create_or_update_session(
			ip_address,
			user_agent,
			referrer,
		);

		// Resolve the request first
		const response = await resolve(event);

		// After response is generated, record the page visit
		if (session_id) {
			const url = new URL(event.request.url);
			const slug = url.pathname;

			await record_page_visit({
				session_id,
				slug,
				request_type: 'initial',
				content_type:
					response.headers.get('content-type') || undefined,
			});
		}

		return response;
	} catch (error) {
		console.error('Error in hooks.server.ts:', error);
		// Continue with the request even if tracking fails
		return await resolve(event);
	}
};
