import { config } from 'dotenv';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '@prisma/client';
// This file lives in `src/`; `.env` is one level up (services/api).
const apiDir = dirname(fileURLToPath(import.meta.url));
const envPath = join(apiDir, '..', '.env');
// npm / Docker often pre-set DATABASE_URL (e.g. host `postgres`). Local `.env` must win.
const parsed = config({ path: envPath, override: true });
if (parsed.error) {
    console.error('[shieldride] dotenv failed:', envPath, parsed.error.message);
}
else if (!existsSync(envPath)) {
    console.error('[shieldride] missing env file:', envPath);
}
export const prisma = new PrismaClient();
