import db from './db';

interface Note {
    id: number;
    user_id: string;
    title: string;
    content: string;
    created_at: number;
    tags: string[];
}

export function getNotes(userId: string): Note[] {
    const stmt = db.prepare(`
        SELECT n.*, GROUP_CONCAT(t.name) as tags
        FROM notes n
        LEFT JOIN note_tags nt ON n.id = nt.note_id
        LEFT JOIN tags t ON nt.tag_id = t.id
        WHERE n.user_id = ?
        GROUP BY n.id
        ORDER BY n.created_at DESC
    `);

    const rows = stmt.all(userId) as any[];
    return rows.map(row => ({
        ...row,
        tags: row.tags ? row.tags.split(',') : []
    }));
}

export function getNote(id: number, userId: string): Note | null {
    const stmt = db.prepare(`
        SELECT n.id, n.user_id, n.title, n.content, n.created_at, GROUP_CONCAT(t.name) as tags
        FROM notes n
        LEFT JOIN note_tags nt ON n.id = nt.note_id
        LEFT JOIN tags t ON nt.tag_id = t.id
        WHERE n.id = ? AND n.user_id = ?
        GROUP BY n.id
    `);

    const row = stmt.get(id, userId) as any;

    if (!row) return null;

    return {
        ...row,
        tags: row.tags ? row.tags.split(',') : []
    };
}

export function createNote(userId: string, title: string, content: string, tags: string[]): number {
    const createTransaction = db.transaction(() => {
        const stmt = db.prepare('INSERT INTO notes (user_id, title, content, created_at) VALUES (?, ?, ?, ?)');
        const info = stmt.run(userId, title, content, Date.now());
        const noteId = info.lastInsertRowid as number;

        updateTags(noteId, tags);

        return noteId;
    });

    return createTransaction();
}

export function updateNote(id: number, userId: string, title: string, content: string, tags: string[]): boolean {
    const updateTransaction = db.transaction(() => {
        const stmt = db.prepare('UPDATE notes SET title = ?, content = ? WHERE id = ? AND user_id = ?');
        const info = stmt.run(title, content, id, userId);

        if (info.changes > 0) {
            updateTags(id, tags);
            return true;
        }
        return false;
    });

    return updateTransaction();
}

export function deleteNote(id: number, userId: string): boolean {
    const stmt = db.prepare('DELETE FROM notes WHERE id = ? AND user_id = ?');
    const info = stmt.run(id, userId);
    return info.changes > 0;
}

function updateTags(noteId: number, tags: string[]) {
    // Clear existing tags for this note
    db.prepare('DELETE FROM note_tags WHERE note_id = ?').run(noteId);

    const insertTag = db.prepare('INSERT OR IGNORE INTO tags (name) VALUES (?)');
    const getTagId = db.prepare('SELECT id FROM tags WHERE name = ?');
    const linkTag = db.prepare('INSERT INTO note_tags (note_id, tag_id) VALUES (?, ?)');

    for (const tag of tags) {
        const trimmedTag = tag.trim();
        if (trimmedTag) {
            insertTag.run(trimmedTag);
            const tagRecord = getTagId.get(trimmedTag) as { id: number };
            linkTag.run(noteId, tagRecord.id);
        }
    }
}
