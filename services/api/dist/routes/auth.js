import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../db.js';
import { ok, fail } from '../http/envelope.js';
import { validateBody } from '../middleware/validate.js';
const router = Router();
const sendOtpSchema = z.object({ phone: z.string().regex(/^\d{10}$/) });
const verifyOtpSchema = z.object({ phone: z.string().regex(/^\d{10}$/), otp: z.string().regex(/^\d{6}$/) });
router.post('/send-otp', validateBody(sendOtpSchema), async (req, res) => {
    try {
        res.json(ok({ otpSent: true, demoOtp: '123456' }));
    }
    catch (error) {
        res.status(500).json(fail('AUTH_SEND_OTP_FAILED', 'Unable to send OTP', error));
    }
});
router.post('/verify-otp', validateBody(verifyOtpSchema), async (req, res) => {
    try {
        const { phone } = req.body;
        const worker = await prisma.worker.findUnique({
            where: { phone },
            select: { id: true, name: true, city: true, platform: true, phone: true },
        });
        const secret = process.env['JWT_SECRET'];
        if (!secret) {
            res.status(500).json(fail('SERVER_ERROR', 'JWT secret missing'));
            return;
        }
        const token = jwt.sign({ sub: worker?.id ?? `new-${phone}`, phone, role: 'worker' }, secret, { expiresIn: '7d' });
        res.json(ok({ token, worker: worker ?? null }));
    }
    catch (error) {
        res.status(500).json(fail('AUTH_VERIFY_OTP_FAILED', 'Unable to verify OTP', error));
    }
});
export default router;
