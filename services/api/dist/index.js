import { createApp } from './app.js';
import { prisma } from './db.js';
import { logger } from './logger.js';
const app = createApp();
const port = Number(process.env['PORT'] ?? 3001);
app.listen(port, () => {
    logger.info({ port }, 'api listening');
    prisma
        .$connect()
        .then(() => logger.info('prisma connected'))
        .catch((err) => logger.error({ err }, 'prisma connect failed'));
});
