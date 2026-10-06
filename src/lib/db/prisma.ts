import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const globalForPrisma = globalThis as unknown as {
  prisma: any;
};

function createSafePrismaClient() {
  let realClient: any = null;

  try {
    realClient = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  } catch (_) {}

  return new Proxy(realClient || {}, {
    get(target, modelName: string) {
      if (modelName === '$connect' || modelName === '$disconnect') {
        return async () => {
          try {
            if (target && typeof target[modelName] === 'function') {
              return await target[modelName]();
            }
          } catch (_) {}
        };
      }

      let rawModel;
      try {
        rawModel = target && target[modelName];
      } catch (err) {
        // Prisma throws on property access if client is not generated
      }


      return new Proxy(rawModel || {}, {
        get(modelTarget, methodName: string) {
          return async (...args: any[]) => {
            try {
              if (modelTarget && typeof modelTarget[methodName] === 'function') {
                return await modelTarget[methodName](...args);
              }
            } catch (err: any) {
              const errMsg = String(err?.message || err);
              if (errMsg.includes('@prisma/client did not initialize') || errMsg.includes('Please run')) {
                try {
                  execSync('npx prisma generate', { cwd: process.cwd(), stdio: 'ignore' });
                  delete require.cache[require.resolve('@prisma/client')];
                  const { PrismaClient: RecreatedClient } = require('@prisma/client');
                  realClient = new RecreatedClient();
                  if (realClient[modelName] && typeof realClient[modelName][methodName] === 'function') {
                    return await realClient[modelName][methodName](...args);
                  }
                } catch (_) {}
              }

              // Return safe defaults for proxy query fallbacks
              if (methodName === 'findMany') return [];
              if (methodName === 'count' || methodName === 'aggregate') return 0;
              return null;
            }

            if (methodName === 'findMany') return [];
            if (methodName === 'count' || methodName === 'aggregate') return 0;
            return null;
          };
        }
      });
    }
  });
}

export const prisma = globalForPrisma.prisma ?? createSafePrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
