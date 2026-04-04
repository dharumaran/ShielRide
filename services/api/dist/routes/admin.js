import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { fail, ok } from '../http/envelope.js';
import { validateBody } from '../middleware/validate.js';
import { computeCar } from '../services/carService.js';
const router = Router();
const aiPromptSchema = z.object({ prompt: z.string().min(8) });
router.get('/overview', async (_req, res) => {
    try {
        const [activeWorkers, payoutsToday, fraudQueue, avgPayout] = await Promise.all([
            prisma.worker.count({ where: { status: 'active' } }),
            prisma.payout.count({
                where: {
                    createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
                },
            }),
            prisma.fraudFlag.count({ where: { reviewStatus: 'pending' } }),
            prisma.payout.aggregate({ _avg: { payoutAmountPaise: true } }),
        ]);
        const car = computeCar({
            premiumPoolPaise: 2_500_000,
            seedBufferPaise: 1_500_000,
            triggerRate: 0.22,
            avgPayoutPaise: Math.round(avgPayout._avg.payoutAmountPaise ?? 45_000),
            activeWorkers,
        });
        res.json(ok({ activeWorkers, payoutsToday, fraudQueue, car }));
    }
    catch (error) {
        res.status(500).json(fail('ADMIN_OVERVIEW_FAILED', 'Unable to load overview metrics', error));
    }
});
router.get('/fraud-queue', async (_req, res) => {
    try {
        const flags = await prisma.fraudFlag.findMany({
            where: { reviewStatus: 'pending' },
            orderBy: { createdAt: 'desc' },
            select: { id: true, workerId: true, payoutId: true, scoreB: true, scoreG: true, scoreL: true, scoreTotal: true, reviewStatus: true },
        });
        res.json(ok(flags));
    }
    catch (error) {
        res.status(500).json(fail('ADMIN_FRAUD_QUEUE_FAILED', 'Unable to load fraud queue', error));
    }
});
router.get('/car', async (_req, res) => {
    try {
        const activeWorkers = await prisma.worker.count({ where: { status: 'active' } });
        const avgPayout = await prisma.payout.aggregate({ _avg: { payoutAmountPaise: true } });
        const car = computeCar({
            premiumPoolPaise: 2_500_000,
            seedBufferPaise: 1_500_000,
            triggerRate: 0.22,
            avgPayoutPaise: Math.round(avgPayout._avg.payoutAmountPaise ?? 45000),
            activeWorkers,
        });
        res.json(ok(car));
    }
    catch (error) {
        res.status(500).json(fail('ADMIN_CAR_FAILED', 'Unable to compute CAR', error));
    }
});
router.get('/workers', async (_req, res) => {
    try {
        const workers = await prisma.worker.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                city: true,
                platform: true,
                status: true,
                baselineIncomePaise: true,
                policies: {
                    where: { status: 'active' },
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    select: { premiumAmountPaise: true, riskScore: true },
                },
            },
        });
        res.json(ok(workers));
    }
    catch (error) {
        res.status(500).json(fail('ADMIN_WORKERS_FAILED', 'Unable to load workers', error));
    }
});
router.get('/payouts', async (_req, res) => {
    try {
        const payouts = await prisma.payout.findMany({
            orderBy: { createdAt: 'desc' },
            take: 100,
            select: {
                id: true,
                triggerType: true,
                triggerValue: true,
                payoutAmountPaise: true,
                status: true,
                fraudScore: true,
                fraudComponents: true,
                createdAt: true,
                worker: { select: { name: true, city: true, platform: true } },
            },
        });
        res.json(ok(payouts));
    }
    catch (error) {
        res.status(500).json(fail('ADMIN_PAYOUTS_FAILED', 'Unable to load payouts', error));
    }
});
router.post('/ai', validateBody(aiPromptSchema), async (req, res) => {
    try {
        const apiKey = process.env['ANTHROPIC_API_KEY'];
        if (!apiKey) {
            res
                .status(503)
                .json(fail('AI_UNAVAILABLE', 'ANTHROPIC_API_KEY is not configured on the API server'));
            return;
        }
        const system = 'You are ShieldRide AI risk analyst for India\'s gig economy parametric insurance. Be concise (3-4 sentences), data-driven, and actionable. Use ₹ for currency. No markdown.';
        const r = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 1024,
                system,
                messages: [{ role: 'user', content: req.body.prompt }],
            }),
        });
        if (!r.ok) {
            const t = await r.text();
            res.status(502).json(fail('AI_UPSTREAM_ERROR', 'Anthropic request failed', { status: r.status, body: t }));
            return;
        }
        const body = (await r.json());
        const text = body.content?.find((c) => c.type === 'text')?.text ?? '';
        res.json(ok({ text }));
    }
    catch (error) {
        res.status(500).json(fail('ADMIN_AI_FAILED', 'Unable to complete AI request', error));
    }
});
router.put('/fraud/:id', async (req, res) => {
    try {
        const action = String(req.body?.action ?? '');
        const reviewStatus = action === 'approve' ? 'cleared' : action === 'reject' ? 'confirmed' : null;
        if (!reviewStatus) {
            res.status(400).json(fail('VALIDATION_ERROR', 'Action must be approve or reject'));
            return;
        }
        const updated = await prisma.fraudFlag.update({
            where: { id: req.params.id },
            data: { reviewStatus, reviewedAt: new Date(), reviewedBy: 'admin-demo' },
            select: { id: true, reviewStatus: true, reviewedAt: true, reviewedBy: true },
        });
        res.json(ok(updated));
    }
    catch (error) {
        res.status(500).json(fail('ADMIN_FRAUD_REVIEW_FAILED', 'Unable to update fraud review', error));
    }
});
export default router;
