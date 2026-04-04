import { computeRiskScore } from '@shieldride/shared'
import { Router } from 'express'
import { fail, ok } from '../http/envelope.js'
import { resolveLatestSensorReading } from '../services/sensorReadings.js'
import { evaluateTriggers } from '../services/triggerEngine.js'

const router = Router()

router.get('/latest', async (req, res) => {
  try {
    const city = String(req.query['city'] ?? 'Mumbai')
    const latest = await resolveLatestSensorReading(city)
    res.json(ok(latest))
  } catch (error) {
    res.status(500).json(fail('SENSOR_LATEST_FAILED', 'Unable to fetch latest sensor data', error))
  }
})

router.get('/risk', async (req, res) => {
  try {
    const city = String(req.query['city'] ?? 'Mumbai')
    const latest = await resolveLatestSensorReading(city)
    const risk = computeRiskScore({
      rainfallMmHr: latest.rainfallMmHr,
      heatIndexC: latest.heatIndexC,
      aqiScore: latest.aqiScore,
      cancelRatePct: latest.cancelRatePct,
      platformStatus: latest.platformStatus as 'online' | 'degraded' | 'outage',
    })
    res.json(ok(risk))
  } catch (error) {
    res.status(500).json(fail('SENSOR_RISK_FAILED', 'Unable to compute risk', error))
  }
})

router.get('/triggers', async (req, res) => {
  try {
    const city = String(req.query['city'] ?? 'Mumbai')
    const latest = await resolveLatestSensorReading(city)
    const triggers = evaluateTriggers({
      rainfallMmHr: latest.rainfallMmHr,
      heatIndexC: latest.heatIndexC,
      aqiScore: latest.aqiScore,
      cancelRatePct: latest.cancelRatePct,
      platformStatus: latest.platformStatus as 'online' | 'degraded' | 'outage',
      orderDensity: latest.orderDensity,
      now: new Date(),
      baselineIncomePaise: 65000,
      sustainedMinutes: {
        rainfall: latest.rainfallMmHr > 35 ? 60 : 0,
        heat: latest.heatIndexC > 42 ? 50 : 0,
        aqi: latest.aqiScore > 300 ? 190 : 0,
        outage: latest.platformStatus !== 'online' ? 100 : 0,
        demand: latest.cancelRatePct > 45 ? 130 : 0,
      },
    })
    res.json(ok(triggers))
  } catch (error) {
    res.status(500).json(fail('SENSOR_TRIGGERS_FAILED', 'Unable to evaluate triggers', error))
  }
})

export default router

