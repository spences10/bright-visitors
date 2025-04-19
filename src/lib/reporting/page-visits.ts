import { turso_client } from '$lib';
import type { Value } from '@libsql/client';

export interface PageVisitData {
	session_id: Value;
	slug: string;
	load_time?: number;
	request_type?: 'initial' | 'subsequent' | 'resource';
	content_type?: string;
	request_order?: number;
	time_since_last_request?: number;
}

export const record_page_visit = async (
	data: PageVisitData,
): Promise<Value | null> => {
	const client = turso_client();
	let visit_id: Value | null = null;

	try {
		// Record the page visit
		const sql = `
      INSERT INTO page_visits (
        session_id, 
        slug, 
        load_time, 
        request_type, 
        content_type, 
        request_order, 
        time_since_last_request
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

		const result = await client.execute({
			sql,
			args: [
				data.session_id,
				data.slug,
				data.load_time || null,
				data.request_type || 'initial',
				data.content_type || null,
				data.request_order || null,
				data.time_since_last_request || null,
			],
		});

		visit_id = result.lastInsertRowid || null;

		// Update the page analytics
		await update_page_analytics(data.slug);

		return visit_id;
	} catch (error) {
		console.error('Error in record_page_visit:', error);
		return null;
	}
};

export const update_page_analytics = async (
	slug: string,
): Promise<void> => {
	const client = turso_client();

	try {
		// Check if analytics record exists for this slug
		const check_sql = `
      SELECT id FROM page_analytics 
      WHERE slug = ? 
      LIMIT 1
    `;

		const check_result = await client.execute({
			sql: check_sql,
			args: [slug],
		});

		if (check_result.rows && check_result.rows.length > 0) {
			// Update existing record
			const update_sql = `
        UPDATE page_analytics 
        SET 
          pageviews = pageviews + 1, 
          last_updated = CURRENT_TIMESTAMP
        WHERE slug = ?
      `;

			await client.execute({
				sql: update_sql,
				args: [slug],
			});
		} else {
			// Create new record
			const insert_sql = `
        INSERT INTO page_analytics (
          slug, 
          pageviews, 
          visits, 
          uniques, 
          last_updated
        )
        VALUES (?, 1, 1, 1, CURRENT_TIMESTAMP)
      `;

			await client.execute({
				sql: insert_sql,
				args: [slug],
			});
		}
	} catch (error) {
		console.error('Error in update_page_analytics:', error);
	}
};
