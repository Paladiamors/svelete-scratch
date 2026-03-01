import { describe, it, expect, beforeAll } from 'vitest';
import db, { initDb } from '$lib/server/db';

describe('Database Setup', () => {
	beforeAll(() => {
		initDb();
	});

	it('should create tables correctly', () => {
		const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
		const tableNames = tables.map((t: any) => t.name);

		expect(tableNames).toContain('users');
		expect(tableNames).toContain('sessions');
		expect(tableNames).toContain('notes');
		expect(tableNames).toContain('tags');
		expect(tableNames).toContain('note_tags');
	});
});
