import { PrismaClient } from '@prisma/client';
import net from 'net';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  dbAvailableCache?: { available: boolean; timestamp: number };
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Fast circuit-breaker check (<10ms instead of 4.5s Prisma TCP timeout).
 * Caches result for 30s so portal navigation is instantaneous.
 */
export async function isDatabaseAvailable(): Promise<boolean> {
  const now = Date.now();
  if (
    globalForPrisma.dbAvailableCache &&
    now - globalForPrisma.dbAvailableCache.timestamp < 30000
  ) {
    return globalForPrisma.dbAvailableCache.available;
  }

  return new Promise<boolean>((resolve) => {
    const socket = net.createConnection({ port: 3306, host: '127.0.0.1' });
    socket.setTimeout(200);

    const finish = (available: boolean) => {
      globalForPrisma.dbAvailableCache = { available, timestamp: Date.now() };
      try {
        socket.destroy();
      } catch {}
      resolve(available);
    };

    socket.on('connect', () => finish(true));
    socket.on('error', () => finish(false));
    socket.on('timeout', () => finish(false));
  });
}
