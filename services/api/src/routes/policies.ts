import { computeRiskScore } from '@shieldride/shared'
import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../db.js'
import { fail, ok } from '../http/envelope.js'
import { validateBody } from '../middleware/validate.js'
import { resolveLatestSensorReading } from '../services/sensorReadings.js'

const router = Router()
const createSchema = z.object({ workerId: z.string().min(4), weekStart: z.string().datetime() })
const paySchema = z.object({ upiRef: z.string().min(4) })

router.post('/', validateBody(createSchema), async (req, res) => {
  try {
    const worker = await prisma.worker.findUnique({
      where: { id: req.body.workerId },
      select: { id: true, city: true },
    })
    if (!worker) {
      res.status(404).json(fail('NOT_FOUND', 'Worker not found'))
      return
    }
    const existingActive = await prisma.policy.findFirst({
      where: { workerId: worker.id, status: 'active' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        premiumAmountPaise: true,
        riskScore: true,
        status: true,
        weekStart: true,
        weekEnd: true,
        premiumPaidAt: true,
      },
    })
    if (existingActive) {
      res.status(200).json(ok(existingActive))
      return
    }
    const latest = await resolveLatestSensorReading(worker.city)
    const risk = computeRiskScore({
      rainfallMmHr: latest.rainfallMmHr,
      heatIndexC: latest.heatIndexC,
      aqiScore: latest.aqiScore,
      cancelRatePct: latest.cancelRatePct,
      platformStatus: latest.platformStatus as 'online' | 'degraded' | 'outage',
    })
    const weekStart = new Date(req.body.weekStart)
    const weekEnd = new Date(weekStart)
    weekEnd.setUTCDate(weekEnd.getUTCDate() + 7)

    const policy = await prisma.policy.create({
      data: {
        workerId: req.body.workerId,
        weekStart,
        weekEnd,
        premiumAmountPaise: risk.premiumPaise,
        riskScore: risk.riskScore,
        status: 'active',
      },
      select: { id: true, premiumAmountPaise: true, riskScore: true, status: true, weekStart: true, weekEnd: true },
    })
    res.status(201).json(ok(policy))
  } catch (error) {
    res.status(500).json(fail('POLICY_CREATE_FAILED', 'Unable to create policy', error))
  }
})

router.get('/:id', async (req, res) => {
  try {
    const policy = await prisma.policy.findUnique({
      where: { id: String(req.params['id']) },
      select: { id: true, workerId: true, premiumAmountPaise: true, riskScore: true, status: true, premiumPaidAt: true },
    })
    if (!policy) {
      res.status(404).json(fail('NOT_FOUND', 'Policy not found'))
      return
    }
    res.json(ok(policy))
  } catch (error) {
    res.status(500).json(fail('POLICY_FETCH_FAILED', 'Unable to fetch policy', error))
  }
})

router.post('/:id/pay', validateBody(paySchema), async (req, res) => {
  try {
    const policy = await prisma.policy.update({
      where: { id: String(req.params['id']) },
      data: { premiumPaidAt: new Date(), status: 'active' },
      select: { id: true, premiumPaidAt: true, status: true },
    })
    res.json(ok({ ...policy, upiRef: req.body.upiRef }))
  } catch (error) {
    res.status(500).json(fail('POLICY_PAYMENT_FAILED', 'Unable to apply policy payment', error))
  }
})

export default router

