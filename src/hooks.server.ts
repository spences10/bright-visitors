import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

let last_request_time: { [key: string]: number } = {};
let request_count: { [key: string]: number } = {};

const log_request_data: Handle = async ({ event, resolve }) => {
	const start_time = Date.now();
	const response = await resolve(event);
	const end_time = Date.now();

	const ip_address =
		event.request.headers.get('x-forwarded-for') || 'Unknown';
	const current_time = Date.now();
	const time_since_last_request = last_request_time[ip_address]
		? current_time - last_request_time[ip_address]
		: null;
	last_request_time[ip_address] = current_time;

	request_count[ip_address] = (request_count[ip_address] || 0) + 1;

	const request_data = {
		ip_address,
		user_agent: event.request.headers.get('user-agent') || 'Unknown',
		referrer: event.request.headers.get('referer') || 'Unknown',
		url_path: event.url.pathname,
		load_time: end_time - start_time,
		request_type:
			request_count[ip_address] === 1 ? 'initial' : 'subsequent',
		content_type: response.headers.get('content-type') || 'Unknown',
		request_order: request_count[ip_address],
		time_since_last_request,
		headers: Object.fromEntries(event.request.headers),
		timestamp: new Date().toISOString(),
		query_params: Object.fromEntries(event.url.searchParams),
		http_method: event.request.method,
		response_status: response.status,
	};

	// to the db eventually
	console.log('Request data:', JSON.stringify(request_data, null, 2));

	return response;
};

export const handle = sequence(log_request_data);
