# ShieldRide

**Phase 3 README**

Parametric income protection for India's quick-commerce workforce, built for the realities of Zepto and Blinkit riders: low weekly premiums, explainable pricing, real-time trigger monitoring, fraud-aware claims, and insurer-grade visibility.

[Pitch Deck](https://canva.link/fraof2yd9zqsmav)

## The Pitch

India's gig economy is growing fast, but income protection has not kept pace. A delivery rider can lose a day's earnings to heavy rain, extreme heat, hazardous AQI, platform outages, or sudden demand collapse, yet traditional insurance products are slow, opaque, and poorly matched to weekly cash-flow realities.

ShieldRide is our answer: a mobile-first parametric protection platform that converts disruption signals into fast, transparent payouts. Instead of making riders file complex claims after the damage is already done, we monitor external triggers continuously, price protection with an explainable weekly model, and route payouts through an automated claim pipeline with anti-spoofing controls.

This is not just a concept demo. The product experience already spans:

- onboarding with OTP and worker profile capture
- AI-assisted premium explanation
- policy activation with Guidewire sync
- live trigger monitoring across cities
- instant payout simulation and claim orchestration
- fraud scoring with feature-level explanations
- support chat for rider education
- insurer console for CAR, alpha recalibration, and fraud review

## Why It Matters

ShieldRide is designed for a workforce that cannot wait 15 to 45 days for reimbursement. Riders need:

- low-friction onboarding
- small, weekly premiums instead of annual commitments
- clear formulas instead of black-box pricing
- trigger-driven payouts instead of manual paperwork
- fairness protections when fraud controls are involved

That is why the platform is built around three product principles:

1. **Transparency over opacity**  
   We show the pricing formula, the risk breakdown, and the fraud decisioning signals.

2. **Automation with fairness**  
   We automate detection and payout, but suspicious cases are held for review rather than silently denied.

3. **Operational realism**  
   The demo includes Guidewire-style integration, portfolio controls, payout timing, and measurable platform targets.

## What Phase 3 Adds

Phase 3 turns the earlier concept into a more complete, judge-ready and insurer-aware system.

- A full product journey from landing page to active policy
- A richer command center with live disruption status and payout history
- A dedicated fraud demo that connects ML scoring directly into claims flow
- An insurer console with worker-level analysis, capital adequacy visibility, and recalibration controls
- A stronger narrative around explainability, anti-spoofing, and business viability

In short, Phase 3 is where ShieldRide feels less like a prototype and more like a product.

## Product Walkthrough

### 1. Landing Experience

The home page communicates the entire thesis quickly:

- who the user is: Zepto and Blinkit riders
- what goes wrong: weather, AQI, outages, and demand volatility
- what ShieldRide does: protect income automatically

It also introduces a key differentiation: **Demand-Volatility Protection**, our moat within the parametric model.

### 2. Onboarding and Quote

The onboarding flow is structured to stay lightweight for mobile users:

- phone OTP verification
- worker profile capture
- Aadhaar eKYC mock checkpoint
- AI risk quote with visible premium formula
- UPI sandbox payment and policy activation

The pricing model is explicit in the UI:

`P_w = P_base × (1 + alpha × R_w)`

The resulting weekly premium is clamped into an affordable rider band, keeping the experience aligned with gig-worker economics rather than annual insurance norms.

### 3. Command Center

The dashboard is the rider's live protection console. It shows:

- earnings protected through payouts
- nearest live disruption in the rider's city
- instant payout simulation
- policy status and Guidewire sync
- weekly risk score and component breakdown
- trigger monitor cards
- income timeline with payout overlays
- payout history

This is where the product proves that it is not static insurance paperwork. It is an active, event-aware safety layer.

### 4. Trigger Monitoring

ShieldRide continuously evaluates five parametric triggers:

- heavy rainfall
- extreme heat
- severe AQI
- platform outage
- order collapse / demand volatility

The disruptions view exposes city-wise scanning, trigger thresholds, monitor cadence, and scan logs so that both judges and operators can see the detection loop in action.

### 5. Claims and Payout Flow

The claims system demonstrates a zero-touch path:

- trigger detected
- cross-validation
- eligibility check
- fraud score
- payout amount and reserve check
- UPI payout call
- settlement confirmation
- user notification

The interface animates this timeline so the payout path is visible, not hidden. That matters in a demo because speed is part of the value proposition.

### 6. Fraud Defense

Fraud is handled through a multi-signal score rather than naive GPS-only validation.

The scoring surface is:

`F_w = 0.40 × B + 0.35 × G + 0.25 × L`

Where:

- `B` = behavioral signals
- `G` = geo and network consistency
- `L` = linkage and identity confidence

The fraud demo lets judges manipulate behavior, device, geo, and claim-frequency signals live. It returns:

- a risk score
- a low / medium / high risk band
- explanation text
- feature contributions
- automatic claim trigger on high-risk preset for end-to-end visibility

This makes the ML layer understandable and integrated, rather than decorative.

### 7. Support and Trust

The rider support chat converts product logic into plain language:

- why a payout happened
- what triggers a claim
- how weekly premiums move
- how the fraud system works

This is important because explainability is not only a compliance feature. It is also a trust feature.

### 8. Insurer Console

The admin console shifts from rider experience to insurer operations. It includes:

- portfolio worker count
- total premiums collected
- expected loss
- alpha coefficient
- CAR visualization
- fraud review queue
- model performance metrics
- worker-level policy and claims analysis
- Sunday alpha recalibration flow

This is how ShieldRide demonstrates that it can serve both sides of the insurance system:
the protected worker and the underwriting operator.

## Technical Architecture

ShieldRide is built as a full-stack web product with a mobile-first delivery model.

### Frontend

- Next.js app-router experience in `src/app`
- responsive web UI with mobile navigation
- dashboard, onboarding, claims, fraud demo, policy, chat, and admin surfaces
- PWA registration through service-worker support

### Backend and APIs

- route handlers under `src/app/api`
- policy activation endpoints
- dashboard aggregation endpoints
- claims simulation and retrieval endpoints
- trigger scan and monitor-status endpoints
- AI explanation endpoints for risk and fraud
- admin endpoints for portfolio and worker analytics

### Data and Persistence

- Supabase integration for workers, policies, and claims
- seed-backed fallback flows so the demo remains operable
- Postgres included in Docker-based local setup

### Guidewire Integration

ShieldRide includes a mock Guidewire service with visible flows for:

- `POST /policy`
- `POST /claim`
- `GET /claim/{id}`
- `POST /payout`

The product already wires policy activation and payout simulation into this mock service, making the integration story visible in logs and on-screen states.

### ML and Explainability

- persisted fraud model artifact in `src/ml/fraud-model.json`
- live `/api/fraud-score` endpoint
- contribution-level response with human-readable labels
- AI explanation layers for pricing and fraud narratives

A key design choice is that deterministic pricing and scoring logic remain first-class, while LLMs are used to explain decisions in plain language.

### Trigger Intelligence

The trigger engine evaluates live or fallback external conditions, including:

- weather-linked rainfall and heat indicators
- air quality scans
- outage and disruption monitoring
- demand-volatility signals

The trigger-monitor and auto-scan APIs expose monitor state, last run timestamps, and scan cycles, which makes the engine legible during demos.

## Anti-Spoofing and Fairness

ShieldRide is intentionally built around the idea that no single signal should be trusted in isolation. Fraud review considers:

- order velocity and behavioral drift
- GPS versus weather-cell consistency
- IP / ASN and city alignment
- device fingerprint stability
- UPI linkage uniqueness
- geo-cluster and device-switch anomalies

But the operational design is just as important as the model:

- suspicious claims are **held**, not silently rejected
- the user can still receive a clear status
- manual review remains part of the workflow for higher-risk cases

That combination of automation and soft-fail fairness is central to the product thesis.

## Business and Insurance Viability

ShieldRide is not framed as "consumer fintech with insurance vibes." It is positioned as a real insurance-operating surface for income protection.

Key viability ideas carried into the system:

- weekly premium band aligned to gig-worker cash flow
- active monitoring instead of reactive claims handling
- visible capital adequacy through CAR
- alpha recalibration based on observed loss experience
- internal metrics for latency, trigger lag, fraud precision, recall, and payout timing

This matters because a strong product story alone is not enough. The platform must also demonstrate underwriting discipline and operational control.

## Demo-Ready Highlights

If you are reviewing ShieldRide quickly, these are the strongest proof points:

- live onboarding to policy activation
- explainable premium formula in-app
- five-trigger parametric monitoring
- instant payout pipeline visualization
- end-to-end fraud scoring with claim hook
- Guidewire mock sync for policy, claim, and payout
- insurer console with CAR and fraud queue

## Repository Guide

- `README.md` - Phase 3 pitch and default project overview
- `P1_README.md` - preserved original Phase 1 README
- `P2_README.md` - Phase 2 documentation
- `DEMO_RUNBOOK.md` - fast judge-demo instructions
- `src/app` - frontend routes and API handlers
- `src/components` - shared UI components
- `src/lib` - pricing, trigger, fraud, Guidewire, and support logic
- `mock_guidewire` - local mock integration service
- `supabase` - schema and seed data
- `docker-compose.yml` - local multi-service startup

## Links

- [Pitch Deck](https://canva.link/fraof2yd9zqsmav)
- [Demo Runbook](./DEMO_RUNBOOK.md)
- [Phase 1 README](./P1_README.md)
- [Phase 2 README](./P2_README.md)

## Closing

ShieldRide is our vision for insurance that matches the rhythm of gig work: weekly, explainable, event-driven, and fast.

Where traditional products ask riders to absorb the shock first and file paperwork later, ShieldRide is built to detect the shock, validate it intelligently, and respond in minutes.

That is the Phase 3 story:

- a stronger product
- a clearer insurance thesis
- a more defensible technical architecture
- and a much more compelling path from demo to deployable system
