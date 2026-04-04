import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { fail, ok } from '../http/envelope.js';
import { validateBody } from '../middleware/validate.js';
const router = Router();
const createWorkerSchema = z.object({
    phone: z.string().regex(/^\d{10}$/),
    name: z.string().min(2),
    city: z.string().min(2),
    pincode: z.string().min(4),
    platform: z.enum(['zepto', 'blinkit', 'swiggy']),
    upiHandle: z.string().min(3),
    aadhaarLast4: z.string().regex(/^\d{4}$/),
    baselineIncomeRupees: z.number().positive(),
    deviceFingerprint: z.string().optional(),
});
router.post('/', validateBody(createWorkerSchema), async (req, res) => {
    try {
        const { baselineIncomeRupees, ...rest } = req.body;
        const worker = await prisma.worker.create({
            data: {
                ...rest,
                baselineIncomePaise: Math.round(baselineIncomeRupees * 100),
            },
            select: { id: true, name: true, city: true, platform: true, phone: true },
        });
        res.status(201).json(ok(worker));
    }
    catch (error) {
        res.status(500).json(fail('WORKER_CREATE_FAILED', 'Unable to create worker', error));
    }
});
// Register static path segments before `/:id` to avoid router edge cases.
router.get('/:id/income', async (_req, res) => {
    try {
        const history = [
            { day: 'Mon', incomePaise: 82000 },
            { day: 'Tue', incomePaise: 76000 },
            { day: 'Wed', incomePaise: 8000 },
            { day: 'Thu', incomePaise: 68000 },
            { day: 'Fri', incomePaise: 74000 },
            { day: 'Sat', incomePaise: 79000 },
            { day: 'Sun', incomePaise: 71000 },
        ];
        res.json(ok(history));
    }
    catch (error) {
        res.status(500).json(fail('WORKER_INCOME_FAILED', 'Unable to fetch income history', error));
    }
});
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const worker = await prisma.worker.findUnique({
            where: { id },
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
                    select: { id: true, premiumAmountPaise: true, riskScore: true, status: true, premiumPaidAt: true },
                },
            },
        });
        if (!worker) {
            res.status(404).json(fail('NOT_FOUND', 'Worker not found'));
            return;
        }
        res.json(ok(worker));
    }
    catch (error) {
        res.status(500).json(fail('WORKER_FETCH_FAILED', 'Unable to fetch worker', error));
    }
});
router.put('/:id', async (req, res) => {
    try {
        const worker = await prisma.worker.update({
            where: { id: req.params.id },
            data: req.body,
            select: { id: true, name: true, city: true, platform: true, status: true },
        });
        res.json(ok(worker));
    }
    catch (error) {
        res.status(500).json(fail('WORKER_UPDATE_FAILED', 'Unable to update worker', error));
    }
});
export default router;
