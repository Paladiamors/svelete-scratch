import db from './db';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { generateKeyPair, exportJWK, SignJWT, jwtVerify, importJWK } from 'jose';

const SALT_ROUNDS = 10;

const JWKS_PATH = 'jwks.json';

let cachedPrivateKey: any = null;
let cachedPublicKey: any = null;

async function getKeys() {
  if (cachedPrivateKey && cachedPublicKey) {
    return { privateKey: cachedPrivateKey, publicKey: cachedPublicKey };
  }

  let privateJwk, publicJwk;
  if (fs.existsSync(JWKS_PATH)) {
    const jwks = JSON.parse(fs.readFileSync(JWKS_PATH, 'utf8'));
    privateJwk = jwks.private;
    publicJwk = jwks.public;
  } else {
    const { publicKey, privateKey } = await generateKeyPair('RS256', { extractable: true });
    privateJwk = await exportJWK(privateKey);
    publicJwk = await exportJWK(publicKey);
    privateJwk.alg = 'RS256';
    publicJwk.alg = 'RS256';
    fs.writeFileSync(
      JWKS_PATH,
      JSON.stringify({ private: privateJwk, public: publicJwk }, null, 2)
    );
  }
  cachedPrivateKey = await importJWK(privateJwk, 'RS256');
  cachedPublicKey = await importJWK(publicJwk, 'RS256');

  return { privateKey: cachedPrivateKey, publicKey: cachedPublicKey };
}

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
  const user = stmt.get(username) as
    | { id: string; username: string; password_hash: string }
    | undefined;

  if (user && bcrypt.compareSync(password, user.password_hash)) {
    return { id: user.id, username: user.username };
  }
  return null;
}

export async function createSession(userId: string): Promise<string> {
  const { privateKey } = await getKeys();

  // Session expires in 15 mins
  const expiresAtDate = new Date(Date.now() + 15 * 60 * 1000);
  const expiresAt = expiresAtDate.getTime();

  const sessionId = await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: 'RS256' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(privateKey);

  const stmt = db.prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)');
  stmt.run(sessionId, userId, expiresAt);
  return sessionId;
}

export async function getSession(sessionId: string): Promise<User | null> {
  const { publicKey } = await getKeys();

  try {
    await jwtVerify(sessionId, publicKey);
  } catch (e) {
    return null;
  }

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
