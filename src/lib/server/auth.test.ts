import { describe, it, expect, beforeAll } from 'vitest';
import { createUser, verifyUser, createSession, getSession, deleteSession } from '$lib/server/auth';
import { initDb } from '$lib/server/db';

describe('Authentication Logic', () => {
    beforeAll(() => {
        initDb();
    });

    it('should create and verify a user', () => {
        const username = 'testuser_' + Date.now();
        const password = 'password123';

        const user = createUser(username, password);
        expect(user).not.toBeNull();
        expect(user?.username).toBe(username);

        const verifiedUser = verifyUser(username, password);
        expect(verifiedUser).not.toBeNull();
        expect(verifiedUser?.id).toBe(user?.id);

        const invalidUser = verifyUser(username, 'wrongpassword');
        expect(invalidUser).toBeNull();
    });

    it('should handle duplicate users', () => {
        const username = 'duplicate_' + Date.now();
        createUser(username, 'p1');
        const user2 = createUser(username, 'p2');
        expect(user2).toBeNull();
    });

    it('should create, retrieve, and delete sessions', () => {
        const username = 'session_test_' + Date.now();
        const user = createUser(username, 'pass')!;

        const sessionId = createSession(user.id);
        expect(sessionId).toBeDefined();

        const sessionUser = getSession(sessionId);
        expect(sessionUser).not.toBeNull();
        expect(sessionUser?.id).toBe(user.id);

        deleteSession(sessionId);
        const deletedSessionUser = getSession(sessionId);
        expect(deletedSessionUser).toBeNull();
    });
});
