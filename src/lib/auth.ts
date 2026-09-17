import crypto from 'crypto';

const SECRET_KEY = process.env.SESSION_SECRET || 'gamevui24h_secure_jwt_secret_key_2026_hokiet';

export interface SessionPayload {
  userId: string;
  username: string;
  email: string | null;
  role: string;
  exp: number;
}

/**
 * Hashes a plaintext password using native Node.js crypto.scrypt with a random 16-byte salt.
 * Returns formatted string "salt:derivedKey"
 */
export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
}

/**
 * Verifies a plaintext password against a stored "salt:derivedKey" hash.
 * Uses crypto.timingSafeEqual to defend against timing attacks.
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  return new Promise((resolve) => {
    const parts = storedHash.split(':');
    if (parts.length !== 2) return resolve(false);

    const [salt, key] = parts;
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return resolve(false);
      try {
        const keyBuffer = Buffer.from(key, 'hex');
        const isMatch = crypto.timingSafeEqual(keyBuffer, derivedKey);
        resolve(isMatch);
      } catch {
        resolve(false);
      }
    });
  });
}

/**
 * Creates a signed session token containing the user payload.
 * Encoded as: base64(payload).signature
 */
export function createSessionToken(data: Omit<SessionPayload, 'exp'>): string {
  const payload: SessionPayload = {
    ...data,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days expiration
  };

  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(payloadStr)
    .digest('base64url');

  return `${payloadStr}.${signature}`;
}

/**
 * Verifies and decodes a signed session token. Returns null if invalid or expired.
 */
export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const [payloadStr, signature] = token.split('.');
    if (!payloadStr || !signature) return null;

    const expectedSignature = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(payloadStr)
      .digest('base64url');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }

    const payloadJson = Buffer.from(payloadStr, 'base64url').toString('utf-8');
    const payload: SessionPayload = JSON.parse(payloadJson);

    if (Date.now() > payload.exp) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}
