import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const log_request_data: Handle = async ({ event, resolve }) => {
	const start_time = Date.now();
	const response = await resolve(event);
	const end_time = Date.now();

	const request_data = {
		ip_address:
			event.request.headers.get('x-forwarded-for') || 'Unknown',
		user_agent: event.request.headers.get('user-agent') || 'Unknown',
		accept: event.request.headers.get('accept') || 'Unknown',
		accept_language:
			event.request.headers.get('accept-language') || 'Unknown',
		referer: event.request.headers.get('referer') || 'Unknown',
		has_cookies: event.request.headers.get('cookie') ? 'Yes' : 'No',
		timestamp: new Date().toISOString(),
		url_path: event.url.pathname,
		query_params: Object.fromEntries(event.url.searchParams),
		http_method: event.request.method,
		response_status: response.status,
		process_time_ms: end_time - start_time,
	};

	console.log('Request data:');
	console.log(JSON.stringify(request_data, null, 2));

	return response;
};

export const handle = sequence(log_request_data);
