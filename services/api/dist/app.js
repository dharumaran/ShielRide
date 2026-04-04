import './db.js';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { logger } from './logger.js';
import { fail, ok } from './http/envelope.js';
import adminRoutes from './routes/admin.js';
import authRoutes from './routes/auth.js';
import payoutsRoutes from './routes/payouts.js';
import policiesRoutes from './routes/policies.js';
import sensorsRoutes from './routes/sensors.js';
import workersRoutes from './routes/workers.js';
function parseCorsOrigins() {
    const raw = process.env['CORS_ORIGIN']?.trim();
    if (!raw)
        return true;
    const list = raw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    return list.length ? list : true;
}
export function createApp() {
    const app = express();
    if (process.env['VERCEL'] === '1' || process.env['NODE_ENV'] === 'production') {
        app.set('trust proxy', 1);
    }
    app.use(cors({
        origin: parseCorsOrigins(),
        credentials: true,
    }));
    app.use(express.json({ limit: '1mb' }));
    app.use(rateLimit({
        windowMs: 60_000,
        limit: 240,
        standardHeaders: true,
        legacyHeaders: false,
        // In-memory store is ineffective on serverless; rely on edge/WAF in production or Redis later.
        skip: () => process.env['VERCEL'] === '1',
    }));
    app.use(morgan('tiny', {
        stream: { write: (msg) => logger.info(msg.trim()) },
    }));
    app.get('/health', (_req, res) => {
        res.json(ok({ status: 'ok' }, { ts: new Date().toISOString() }));
    });
    app.use('/api/auth', authRoutes);
    app.use('/api/workers', workersRoutes);
    app.use('/api/policies', policiesRoutes);
    app.use('/api/sensors', sensorsRoutes);
    app.use('/api/payouts', payoutsRoutes);
    app.use('/api/admin', adminRoutes);
    app.use((req, res) => {
        res.status(404).json(fail('NOT_FOUND', `No route for ${req.method} ${req.path}`));
    });
    app.use((err, _req, res, _next) => {
        logger.error({ err }, 'unhandled error');
        res.status(500).json(fail('SERVER_ERROR', 'Unexpected server error'));
    });
    return app;
}
