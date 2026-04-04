import { Prisma } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../db.js'
import { fail, ok } from '../http/envelope.js'
import { validateBody } from '../middleware/validate.js'

const router = Router()

const CITY_PINCODE: Record<string, string> = {
  Chennai: '600001',
  Mumbai: '400001',
  Delhi: '110001',
  Bengaluru: '560001',
}

const createWorkerSchema = z.object({
  phone: z.string().regex(/^\d{10}$/),
  name: z.string().min(2),
  city: z.string().min(2),
  email: z.union([z.string().email(), z.literal('')]).optional(),
  pincode: z.string().min(4).optional(),
  platform: z.enum(['zepto', 'blinkit', 'swiggy']).optional().default('zepto'),
  upiHandle: z.string().min(3),
  aadhaarLast4: z.string().regex(/^\d{4}$/).optional(),
  baselineIncomeRupees: z.number().positive().optional(),
  deviceFingerprint: z.string().optional(),
})

const patchWorkerSchema = z
  .object({
    name: z.string().min(2).optional(),
    city: z.string().min(2).optional(),
    pincode: z.string().min(4).optional(),
    upiHandle: z.string().min(3).optional(),
    email: z.union([z.string().email(), z.literal('')]).optional(),
    platform: z.enum(['zepto', 'blinkit', 'swiggy']).optional(),
  })
  .strict()

router.post('/', validateBody(createWorkerSchema), async (req, res) => {
  try {
    const { baselineIncomeRupees, email, pincode, aadhaarLast4, ...rest } = req.body
    const resolvedPin = pincode ?? CITY_PINCODE[rest.city] ?? '400001'
    const resolvedEmail = email === '' || email === undefined ? null : email
    const worker = await prisma.worker.create({
      data: {
        ...rest,
        email: resolvedEmail,
        pincode: resolvedPin,
        aadhaarLast4: aadhaarLast4 ?? '0000',
        baselineIncomePaise: Math.round((baselineIncomeRupees ?? 650) * 100),
      },
      select: { id: true, name: true, city: true, platform: true, phone: true, email: true, upiHandle: true },
    })
    res.status(201).json(ok(worker))
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      res.status(409).json(fail('DUPLICATE_PHONE', 'This number is already registered. Use Existing user to sign in.'))
      return
    }
    res.status(500).json(fail('WORKER_CREATE_FAILED', 'Unable to create worker', error))
  }
})

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
    ]
    res.json(ok(history))
  } catch (error) {
    res.status(500).json(fail('WORKER_INCOME_FAILED', 'Unable to fetch income history', error))
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const worker = await prisma.worker.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        city: true,
        platform: true,
        status: true,
        phone: true,
        email: true,
        upiHandle: true,
        pincode: true,
        baselineIncomePaise: true,
        policies: {
          where: { status: 'active' },
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { id: true, premiumAmountPaise: true, riskScore: true, status: true, premiumPaidAt: true },
        },
      },
    })
    if (!worker) {
      res.status(404).json(fail('NOT_FOUND', 'Worker not found'))
      return
    }
    res.json(ok(worker))
  } catch (error) {
    res.status(500).json(fail('WORKER_FETCH_FAILED', 'Unable to fetch worker', error))
  }
})

router.put('/:id', validateBody(patchWorkerSchema), async (req, res) => {
  try {
    const id = String(req.params['id'])
    const patch: z.infer<typeof patchWorkerSchema> = req.body
    const data: Record<string, unknown> = {}
    if (patch.name !== undefined) data['name'] = patch.name
    if (patch.city !== undefined) data['city'] = patch.city
    if (patch.pincode !== undefined) data['pincode'] = patch.pincode
    if (patch.upiHandle !== undefined) data['upiHandle'] = patch.upiHandle
    if (patch.platform !== undefined) data['platform'] = patch.platform
    if (patch.email !== undefined) data['email'] = patch.email === '' ? null : patch.email
    if (patch.city !== undefined && patch.pincode === undefined) {
      const p = CITY_PINCODE[patch.city]
      if (p) data['pincode'] = p
    }
    const worker = await prisma.worker.update({
      where: { id },
      data,
      select: { id: true, name: true, city: true, platform: true, status: true, upiHandle: true, email: true, pincode: true },
    })
    res.json(ok(worker))
  } catch (error) {
    res.status(500).json(fail('WORKER_UPDATE_FAILED', 'Unable to update worker', error))
  }
})

export default router
