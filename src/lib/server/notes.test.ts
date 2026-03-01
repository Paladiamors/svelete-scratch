import { describe, it, expect, beforeAll } from 'vitest';
import { createNote, getNote, getNotes, updateNote, deleteNote } from '$lib/server/notes';
import { createUser } from '$lib/server/auth';
import { initDb } from '$lib/server/db';

describe('Notes Logic', () => {
	let userId: string;

	beforeAll(() => {
		initDb();
		const user = createUser('notes_tester_' + Date.now(), 'password')!;
		userId = user.id;
	});

	it('should create and retrieve a note', () => {
		const title = 'Test Note';
		const content = 'This is a test note.';
		const tags = ['test', 'unit'];

		const noteId = createNote(userId, title, content, tags);
		expect(noteId).toBeGreaterThan(0);

		const note = getNote(noteId, userId);
		expect(note).not.toBeNull();
		expect(note?.title).toBe(title);
		expect(note?.content).toBe(content);
		expect(note?.tags).toEqual(expect.arrayContaining(tags));
	});

	it('should list all notes for a user', () => {
		createNote(userId, 'Note 1', 'Content 1', ['a']);
		createNote(userId, 'Note 2', 'Content 2', ['b']);

		const notes = getNotes(userId);
		expect(notes.length).toBeGreaterThanOrEqual(2);
	});

	it('should update a note', () => {
		const noteId = createNote(userId, 'Original', 'Original Content', ['old']);

		const success = updateNote(noteId, userId, 'Updated', 'Updated Content', ['new', 'tags']);
		expect(success).toBe(true);

		const note = getNote(noteId, userId);
		expect(note?.title).toBe('Updated');
		expect(note?.tags).toEqual(expect.arrayContaining(['new', 'tags']));
		expect(note?.tags).not.toContain('old');
	});

	it('should delete a note', () => {
		const noteId = createNote(userId, 'To Delete', 'Content', []);

		const success = deleteNote(noteId, userId);
		expect(success).toBe(true);

		const note = getNote(noteId, userId);
		expect(note).toBeNull();
	});
});
