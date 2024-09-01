import { turso_client } from '$lib';
import type { Value } from '@libsql/client';

export const create_or_update_session = async (
	ip_address: string,
	user_agent: string | null,
	referrer: string | null,
): Promise<Value | null> => {
	const client = turso_client();
	let session_id: Value | null = null;

	try {
		let sql = `SELECT id, page_count FROM user_session WHERE ip_address = ? AND session_end IS NULL LIMIT 1`;
		let result = await client.execute({ sql, args: [ip_address] });

		if (result.rows && result.rows.length > 0) {
			session_id = result.rows[0].id;
			const new_page_count =
				typeof result.rows[0].page_count === 'number'
					? result.rows[0].page_count + 1
					: 1;
			sql = `UPDATE user_session SET page_count = ?, session_end = CURRENT_TIMESTAMP, session_duration = strftime('%s', CURRENT_TIMESTAMP) - strftime('%s', session_start) WHERE id = ?`;
			await client.execute({
				sql,
				args: [new_page_count, session_id],
			});
		} else {
			sql = `INSERT INTO user_session (ip_address, user_agent, referrer, session_start, page_count) VALUES (?, ?, ?, CURRENT_TIMESTAMP, 1)`;
			const insert_result = await client.execute({
				sql,
				args: [ip_address, user_agent, referrer],
			});
			session_id = insert_result.lastInsertRowid || null;
		}

		return session_id;
	} catch (error) {
		console.error('Error in create_or_update_session:', error);
		return null;
	}
};
