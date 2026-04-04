import { computeRiskScore } from '@shieldride/shared'
import { Router } from 'express'
import { z } from 'zod'
import { fail, ok } from '../http/envelope.js'
import { validateBody } from '../middleware/validate.js'
import { resolveLatestSensorReading } from '../services/sensorReadings.js'

const router = Router()

const calculateSchema = z.object({ city: z.string().min(2).max(80) })

router.post('/calculate', validateBody(calculateSchema), async (req, res) => {
  try {
    const city = req.body.city as string
    const latest = await resolveLatestSensorReading(city)
    const risk = computeRiskScore({
      rainfallMmHr: latest.rainfallMmHr,
      heatIndexC: latest.heatIndexC,
      aqiScore: latest.aqiScore,
      cancelRatePct: latest.cancelRatePct,
      platformStatus: latest.platformStatus as 'online' | 'degraded' | 'outage',
    })
    res.json(
      ok({
        weeklyPremiumRupees: risk.premiumRupees,
        city: city.trim(),
      }),
    )
  } catch (error) {
    res.status(500).json(fail('PREMIUM_CALC_FAILED', 'Unable to calculate premium', error))
  }
})

export default router
