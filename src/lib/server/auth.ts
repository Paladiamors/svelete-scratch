import db from './db';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const SALT_ROUNDS = 10;

export interface User {
    id: string;
    username: string;
}

export function createUser(username: string, password: string): User | null {
    try {
        const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS);
        const userId = uuidv4();
        const stmt = db.prepare('INSERT INTO users (id, username, password_hash) VALUES (?, ?, ?)');
        stmt.run(userId, username, hashedPassword);
        return { id: userId, username };
    } catch (error) {
        // Likely unique constraint violation
        return null;
    }
}

export function verifyUser(username: string, password: string): User | null {
    const stmt = db.prepare('SELECT id, username, password_hash FROM users WHERE username = ?');
    const user = stmt.get(username) as { id: string, username: string, password_hash: string } | undefined;

    if (user && bcrypt.compareSync(password, user.password_hash)) {
        return { id: user.id, username: user.username };
    }
    return null;
}

export function createSession(userId: string): string {
    const sessionId = uuidv4();
    // Session expires in 7 days
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
    const stmt = db.prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)');
    stmt.run(sessionId, userId, expiresAt);
    return sessionId;
}

export function getSession(sessionId: string): User | null {
    const stmt = db.prepare(`
        SELECT u.id, u.username
        FROM sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.id = ? AND s.expires_at > ?
    `);
    const user = stmt.get(sessionId, Date.now()) as User | undefined;
    return user || null;
}

export function deleteSession(sessionId: string) {
    const stmt = db.prepare('DELETE FROM sessions WHERE id = ?');
    stmt.run(sessionId);
}
