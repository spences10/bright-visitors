import { turso_client } from '$lib/db';
import { create_or_update_session } from '$lib/reporting';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const log_request_data: Handle = async ({ event, resolve }) => {
	const start_time = Date.now();
	const response = await resolve(event);
	const end_time = Date.now();

	const ip_address = event.getClientAddress();
	const user_agent =
		event.request.headers.get('user-agent') || 'Unknown';
	const referrer = event.request.headers.get('referer') || 'Unknown';
	const url_path = event.url.pathname;
	const load_time = end_time - start_time;
	const content_type =
		response.headers.get('content-type') || 'Unknown';
	const http_method = event.request.method;
	const response_status = response.status;

	try {
		const session_id = await create_or_update_session(
			ip_address,
			user_agent,
			referrer,
		);

		if (session_id !== null) {
			const client = turso_client();
			await client.execute({
				sql: `INSERT INTO page_visits (session_id, slug, load_time, content_type, request_type) 
                      VALUES (?, ?, ?, ?, ?)`,
				args: [
					session_id,
					url_path,
					load_time,
					content_type,
					'subsequent',
				],
			});

			console.log('Request logged to database:', {
				session_id,
				ip_address,
				url_path,
				http_method,
				response_status,
			});
		} else {
			console.error('Failed to create or update session');
		}
	} catch (error) {
		console.error('Error logging request data:', error);
	}

	return response;
};

export const handle = sequence(log_request_data);
