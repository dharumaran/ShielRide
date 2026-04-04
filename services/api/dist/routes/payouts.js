import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { fail, ok } from '../http/envelope.js';
import { validateBody } from '../middleware/validate.js';
const router = Router();
const manualSchema = z.object({ payoutId: z.string().min(4), action: z.enum(['approve', 'reject']) });
router.get('/', async (req, res) => {
    try {
        const workerId = String(req.query['workerId'] ?? '');
        if (!workerId) {
            res.status(400).json(fail('VALIDATION_ERROR', 'workerId query is required'));
            return;
        }
        const payouts = await prisma.payout.findMany({
            where: { workerId },
            orderBy: { createdAt: 'desc' },
            select: { id: true, triggerType: true, payoutAmountPaise: true, status: true, createdAt: true, fraudScore: true },
        });
        res.json(ok(payouts));
    }
    catch (error) {
        res.status(500).json(fail('PAYOUT_FETCH_FAILED', 'Unable to fetch payouts', error));
    }
});
router.post('/manual', validateBody(manualSchema), async (req, res) => {
    try {
        const status = req.body.action === 'approve' ? 'credited' : 'review';
        const payout = await prisma.payout.update({
            where: { id: req.body.payoutId },
            data: { status, creditedAt: status === 'credited' ? new Date() : null },
            select: { id: true, status: true, creditedAt: true },
        });
        res.json(ok(payout));
    }
    catch (error) {
        res.status(500).json(fail('PAYOUT_MANUAL_FAILED', 'Unable to process manual payout action', error));
    }
});
export default router;
