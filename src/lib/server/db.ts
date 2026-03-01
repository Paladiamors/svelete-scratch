import Database from 'better-sqlite3';

const db = new Database('sqlite.db', { verbose: console.log });

export function initDb() {
  const userTable = `
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT UNIQUE,
            password_hash TEXT
        );
    `;

  const sessionTable = `
        CREATE TABLE IF NOT EXISTS sessions (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            expires_at INTEGER,
            FOREIGN KEY(user_id) REFERENCES users(id)
        );
    `;

  const noteTable = `
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            title TEXT,
            content TEXT,
            created_at INTEGER,
            FOREIGN KEY(user_id) REFERENCES users(id)
        );
    `;

  const tagTable = `
        CREATE TABLE IF NOT EXISTS tags (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE
        );
    `;

  const noteTagTable = `
        CREATE TABLE IF NOT EXISTS note_tags (
            note_id INTEGER,
            tag_id INTEGER,
            PRIMARY KEY (note_id, tag_id),
            FOREIGN KEY(note_id) REFERENCES notes(id) ON DELETE CASCADE,
            FOREIGN KEY(tag_id) REFERENCES tags(id) ON DELETE CASCADE
        );
    `;

  db.exec(userTable);
  db.exec(sessionTable);
  db.exec(noteTable);
  db.exec(tagTable);
  db.exec(noteTagTable);
}

export default db;
