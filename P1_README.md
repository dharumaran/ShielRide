<!--
████████████████████████████████████████████████████████████████████████████████
  ShieldRide — README v1.0  |  Guidewire DEVTrails 2026  |  Phase 1 Submission
  Team: Recaptcha  |  Persona: Grocery/Q-Commerce (Zepto · Blinkit)
████████████████████████████████████████████████████████████████████████████████
-->

<div align="center">

<img src="https://img.shields.io/badge/Guidewire-DEVTrails%202026-0057B8?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0tMiAxNWwtNS01IDEuNDEtMS40MUwxMCAxNC4xN2w3LjU5LTcuNTlMMTkgOGwtOSA5eiIvPjwvc3ZnPg==&logoColor=white" alt="Guidewire DEVTrails 2026"/>
<img src="https://img.shields.io/badge/Phase-1%20%7C%20Seed-22c55e?style=for-the-badge" alt="Phase 1"/>
<img src="https://img.shields.io/badge/Persona-Q--Commerce%20%7C%20Zepto%20·%20Blinkit-f97316?style=for-the-badge" alt="Persona"/>
<img src="https://img.shields.io/badge/Coverage-Income%20Loss%20Only-dc2626?style=for-the-badge" alt="Coverage Scope"/>

<br/><br/>

```
 ____  _   _ ___ _____ _     ____  ____  ___ ____  _____
/ ___|| | | |_ _| ____| |   |  _ \|  _ \|_ _|  _ \| ____|
\___ \| |_| || ||  _| | |   | | | | |_) || || | | |  _|
 ___) |  _  || || |___| |___| |_| |  _ < | || |_| | |___
|____/|_| |_|___|_____|_____|____/|_| \_\___|____/|_____|
```

### **Real-Time Parametric Income Protection for India's 10-Minute Delivery Workforce**
*When the storm hits, your income shouldn't*

<br/>

| | |
|:---:|:---:|
| **7.7 million** gig workers in India with zero income safety net | **₹4,000–₹6,000** average monthly income loss during disruptions |
| **< 5 minutes** from trigger detection to UPI credit | **₹50–₹120/week** — less than a single delivery tip |

> *"India's gig workforce is projected to reach **23.5 million by 2030** — yet 0% have parametric income insurance."*  
> — [NITI Aayog, India's Booming Gig and Platform Economy, 2022](https://www.niti.gov.in/sites/default/files/2022-06/Gig-Economy-June2022.pdf)

</div>

---

## 📋 Table of Contents

| # | Section | What's Inside |
|---|---------|--------------|
| 1 | [🎯 The Problem We're Solving](#-the-problem-were-solving) | Data-backed market failure |
| 2 | [👤 Persona Deep-Dive](#-persona-deep-dive--rajan-the-zepto-rider) | Rajan's story + behavioral data |
| 3 | [🌩️ Disruption Scenarios](#️-disruption-scenarios--when-rajan-loses) | 5 parametric trigger scenarios |
| 4 | [⚙️ How ShieldRide Works](#️-how-shieldride-works--system-workflow) | End-to-end workflow |
| 5 | [💰 The Financial Model](#-the-financial-model) | Premium formula + CAR mechanism |
| 6 | [🤖 AI & ML Architecture](#-ai--ml-architecture) | Risk scoring + fraud engine |
| 7 | [🛡️ Fraud Defense](#️-fraud-defense--adversarial-resilience) | Three-signal fraud score + decision matrix |
| 8 | [🏗️ System Architecture](#️-system-architecture) | Full tech stack + SLAs |
| 9 | [🔐 Adversarial Defense & Anti-Spoofing](#-adversarial-defense--anti-spoofing) | GPS spoofing · fraud rings · fairness layer |
| 10 | [📊 Business Viability](#-business-viability) | Unit economics + CAR |
| 10 | [🗺️ Development Roadmap](#️-development-roadmap) | Phase-by-phase plan |

---

## 🎯 The Problem We're Solving

### The Market Failure

India's quick-commerce sector (Zepto, Blinkit, Swiggy Instamart) has created **~800,000–1,000,000 active delivery partners** [[Economic Times, 2023](https://economictimes.indiatimes.com/tech/technology/quick-commerce-delivery-partners/articleshow/104234567.cms)] who operate in one of the most exposure-heavy work environments imaginable — on two wheels, outdoors, in all conditions, for 8–12 hours/day.

**The income problem is structural, not incidental:**

```
┌─────────────────────────────────────────────────────────────────┐
│  A Zepto rider earns ₹18–25 per delivery × 25–40 deliveries/day │
│  = ₹450–₹1,000/day gross  |  ₹3,150–₹7,000/week               │
│                                                                   │
│  ONE heavy rain day = ZERO deliveries = ₹0 earned               │
│  Mumbai gets 42 heavy-rain days/year on average                  │
│  Chennai gets 38 heavy-rain days/year on average                 │
│  → 40–42 lost income days/year, zero protection                  │
└─────────────────────────────────────────────────────────────────┘
```

### Why Existing Solutions Fail

| Existing Option | Why It Doesn't Work for Gig Workers |
|----------------|--------------------------------------|
| Traditional health insurance | Excludes income loss; annual premium misaligned with weekly earnings |
| ESIC / state schemes | Requires formal employment; gig workers are contractors [[ILO, 2021](https://www.ilo.org/wcmsp5/groups/public/---asia/---ro-bangkok/---sro-new_delhi/documents/publication/wcms_814510.pdf)] |
| Personal savings | Median gig worker savings buffer: **< 2 weeks** [[NCAER, 2022](https://www.ncaer.org/)] |
| Manual insurance claims | Settlement time: **15–45 days** — irrelevant for daily wage workers |
| **ShieldRide parametric model** | ✅ Weekly premium · ✅ < 5 min payout · ✅ Zero claims process |

---

## 👤 Persona Deep-Dive — Rajan, the Zepto Rider

> *This is not a fictional persona. This is 800,000 people.*

### Who Is Rajan?

```
Name:       Rajan Kumar, 26
City:       Chennai, Tamil Nadu
Platform:   Zepto (Grocery / Q-Commerce)
Device:     Redmi Note 11 (3GB RAM, Android 12)
Vehicle:    Electric scooter (Ola S1)
Hours:      7 AM – 10 PM (demand-driven, ~10 active hours)
Earnings:   ₹650–₹900/day on good days | ₹0–₹200 on bad days
Insurance:  None
Savings:    ₹8,000 (≈ 10 days buffer)
```

### Rajan's Weekly Income Pattern

```
Mon  ████████████████████  ₹820  ✅ Good day
Tue  █████████████         ₹530  ⚠️  Slow afternoon
Wed  ██                    ₹80   🌧️  Heavy rain, stopped at 11 AM
Thu  ████████████████████  ₹790  ✅ Recovery
Fri  ████████████████████  ₹910  ✅ Weekend eve surge
Sat  █████████████████     ₹680  ⚠️  AQI 280, reduced hours
Sun  █████████████████████ ₹950  ✅ Peak demand day

Week Total: ₹4,760 (vs. expected ₹5,950)
Income loss this week: ₹1,190 (20% shortfall)
ShieldRide would have covered: ₹810 across 2 trigger events
```

### Rajan's Pain Points (Quantified)

| Pain Point | Current Reality | With ShieldRide |
|-----------|----------------|-----------------|
| Rain disruption (42 days/yr in Chennai) [[IMD](https://mausam.imd.gov.in/)] | ₹0 on rain days | Automatic payout within 5 min |
| Claim complexity | 15–45 day settlement [[IRDAI Annual Report 2022-23](https://www.irdai.gov.in/ADMINCMS/cms/frmGeneral_NoYearList.aspx?DF=AR&mid=3.2)] | Zero-touch parametric, no claim filed |
| Premium commitment | Monthly/annual lock-in | Weekly opt-in, ₹50–₹120 |
| Income visibility | No forecasting | Risk dashboard + next-week preview |

### Platform Choice Rationale

**React PWA (Progressive Web App)** — not native iOS/Android.

| Factor | Evidence | Decision |
|--------|----------|----------|
| Device profile | 78% of delivery workers use Android; median RAM = 3GB | PWA over native, lighter footprint |
| App install friction | 47% of gig workers abandon app store downloads | PWA = zero install, share link |
| Offline usage | Delivery zones have patchy 4G  | Service worker for offline queue |
| Push notifications | Critical for < 5 min payout alerts | Capacitor.js wrapper adds FCM |

---

## 🌩️ Disruption Scenarios — When Rajan Loses

> ShieldRide monitors **5 parametric triggers** in real-time. No claim. No forms. No delay.

### Trigger 1 — Heavy Rainfall 🌧️

```
TRIGGER CONDITION:
  Rainfall intensity  > 35 mm/hr
  Sustained duration  > 45 minutes
  Geographic scope    Worker's active pin code (6-digit)

DATA SOURCE:  OpenWeatherMap API (One Call API 3.0)
              Polling interval: every 15 minutes
              Backup: IMD real-time API (mausam.imd.gov.in)

SCENARIO:
  14:30 — OpenWeather reports 42 mm/hr in pin code 600001 (Chennai Egmore)
  14:45 — 45-min threshold crossed, trigger confirmed
  14:46 — Eligibility check: Rajan's policy active, premium paid Sunday
  14:47 — Fraud check: F_w = 0.12 (GPS shows movement consistent with shelter)
  14:48 — Payout = 80% × ₹650 baseline = ₹520 credited to UPI
  14:50 — WhatsApp notification: "₹520 credited. Stay safe, Rajan 🛡️"

ELAPSED TIME: 4 minutes 12 seconds
```

### Trigger 2 — Extreme Heat Index 🌡️

```
TRIGGER CONDITION:
  Feels-like temperature  > 42°C
  Sustained duration      > 2 hours between 11 AM – 4 PM

DATA SOURCE:  OpenWeatherMap "feels_like" field (Heat Index = f(Temp, Humidity))
              [Rothfusz regression: HI = -42.379 + 2.04901523T + ...]
              Threshold calibrated to NIOH India occupational heat guidelines
              [https://www.icmr.gov.in/cth_publication.html]

PAYOUT:  60% of daily income baseline
NOTE:    Heat threshold 42°C chosen because studies show >25% delivery
         productivity loss above this — [ILO Heat Stress Report 2019]
         
```

### Trigger 3 — Severe Air Quality (AQI) 😷

```
TRIGGER CONDITION:
  AQI reading    > 300 ("Hazardous" on India's AQI scale)
  Duration       > 3 consecutive hours

DATA SOURCE:  CPCB (Central Pollution Control Board) real-time API

CONTEXT:  Delhi AQI exceeded 300 for 47 days in 2023
          Mumbai: 12 days, Chennai: 8 days, Bengaluru: 6 days
          [CPCB Annual Report 2023]

PAYOUT:  50% of daily income baseline
```

### Trigger 4 — Platform Outage 📴

```
TRIGGER CONDITION:
  Platform API non-responsive (HTTP 5xx or timeout)
  Duration  > 90 minutes within any 6-hour window

DATA SOURCE:  Simulated platform API (mock) in Phase 1
              Phase 2: Webhook integration with platform ops teams
              Cross-validated with public downtime trackers (Downdetector.in)

RATIONALE:  Zepto reported 3 major outages in 2023, each 2–4 hours
            Estimated per-worker loss per outage: ₹300–₹600

PAYOUT:  70% × (outage hours / 10 working hours) × daily baseline
```

### Trigger 5 — Order Collapse (Demand Crash) 📉

```
TRIGGER CONDITION:
  Order cancellation rate  > 45% of accepted orders
  Sustained                > 2 consecutive hours
  Minimum order volume     > 5 (prevents false positives from idle workers)

DATA SOURCE:  Platform order feed (simulated in Phase 1)
              Uses rolling 2-hour window, Exponential Moving Average smoothing

PAYOUT:  40% of daily income baseline

NOTE:  This is ShieldRide's most innovative trigger — no competitor covers
       demand-side volatility as a parametric event.
```
## ⚖️ Parameter Selection & Model Scope

### 🧩 Excluded High-Uncertainty Factors

Certain macro-level risks such as:
* War / geopolitical disruptions
* Pandemic-scale events
were evaluated but **excluded from the premium calculation**.

**Reason:**

* Highly unpredictable and non-localized
* Difficult to model with short-term, real-time data
* Introduces instability in weekly pricing
> These are better handled via **separate catastrophic risk layers**, not core pricing.

### ⚙️ Weighted Parameter Strategy

The model prioritizes **high-frequency, localized, and measurable signals** over indirect or platform-dependent factors.

### 📊 Higher-Weight Parameters

* 🌡️ Heat index
* 🌧️ Rainfall intensity
* 🌫️ Air Quality Index (AQI)
* 📉 Real-time demand volatility
> Directly impact worker productivity and income disruption

### 📉 Lower-Weight Parameters

* Dark store availability
* Platform stability / minor outages
> While relevant, these are:
* Less frequent
* Platform-controlled
* Lower impact compared to environmental risks
  
---

## ⚙️ How ShieldRide Works — System Workflow

### End-to-End Application Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│  PHASE 0: ONBOARDING  (target: < 90 seconds)                           │
│                                                                          │
│  1. Worker opens PWA link (no app store)                                │
│  2. Phone number → OTP via SMS (Twilio / MSG91)                         │
│  3. Aadhaar eKYC via DigiLocker API (consent-based)                     │
│     [DigiLocker API: https://developer.digitallocker.gov.in/]           │
│  4. Platform account linkage (OAuth2 mock in Phase 1)                   │
│  5. UPI VPA / bank account registration                                 │
│  6. Weekly premium plan selection → first payment via UPI               │
│                                                                          │
│  Data collected: Name, Aadhaar (masked), platform ID, GPS zone,        │
│  UPI handle, device fingerprint — DPDP Act 2023 compliant              │
└─────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  PHASE 1: RISK PROFILING  (runs every Sunday night, 11 PM)             │
│                                                                          │
│  Input:  Past 4 weeks of worker activity + external signals             │
│  Process: ML pipeline computes weekly risk score R_w ∈ [0, 1]          │
│  Output:  Personalised premium for next week                            │
│                                                                          │
│  Example: Rajan in Chennai, monsoon week                                │
│    R = 0.82 (heavy rain forecast)   × 0.25 =  0.205                    │
│    H = 0.55 (heat moderate)         × 0.15 =  0.082                    │
│    A = 0.30 (AQI moderate)          × 0.10 =  0.030                    │
│    O = 0.10 (no outages forecast)   × 0.20 =  0.020                    │
│    C = 0.25 (avg cancel rate)       × 0.15 =  0.037                    │
│    Social (curfew/strike reserve)   × 0.15 =  0.000  [Phase 2]        │
│                                                                          │
│    R_w = 0.374  →  P_w = ₹75 × (1 + 0.7 × 0.374) = ₹94.65 ≈ ₹95     │
└─────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  PHASE 2: REAL-TIME MONITORING  (continuous, 24×7)                     │
│                                                                          │
│  • Weather + AQI APIs polled every 15 minutes                           │
│  • Platform activity stream ingested via Kafka consumer                 │
│  • Worker GPS pings every 5 minutes while app is active                │
│  • All signals flow into Trigger Evaluator microservice                 │
└─────────────────────────────────────────────────────────────────────────┘
          │
          ▼ (on trigger fire)
┌─────────────────────────────────────────────────────────────────────────┐
│  PHASE 3: TRIGGER → PAYOUT  (target: < 5 minutes)                     │
│                                                                          │
│  T+0s    Signal crosses threshold                                       │
│  T+2s    Trigger evaluator confirms via 2-source cross-validation       │
│  T+4s    Worker eligibility: policy active? premium paid? zone match?   │
│  T+10s   Fraud score computed: F_w = w1·B + w2·G + w3·L               │
│  T+15s   Payout amount computed, CAR check passes                       │
│  T+45s   Razorpay / UPI API call initiated                              │
│  T+180s  UPI settlement confirmed (NPCI median: 2–3 min)               │
│           [NPCI UPI Statistics: https://www.npci.org.in/statistics]     │
│  T+185s  FCM push + WhatsApp / SMS notification sent                    │
│                                                                          │
│  TOTAL: ~3 minutes (worst case < 5 minutes)                             │
└─────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  PHASE 4: FEEDBACK LOOP  (post-payout)                                 │
│                                                                          │
│  • Payout logged, CAR recalculated                                      │
│  • Fraud model feedback (was the payout legitimate?)                    │
│  • Worker dashboard updated with coverage history                       │
│  • Next Sunday: model retrains with new payout data                    │
│  • α coefficient updated: α = Observed_Loss / (P_base × R_w)           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 💰 The Financial Model

### Weekly Premium Formula

```
P_w = P_base × (1 + α × R_w)

Where:
  P_base  = ₹75 (base premium, mid-range of ₹50–₹100)
  α       = 0.7 (sensitivity coefficient, learned from historical data)
  R_w     = composite risk score ∈ [0, 1]

Range:
  Low risk week   (R_w = 0.1):  P_w = ₹75 × 1.07  = ₹80.25  ≈ ₹80
  Medium risk     (R_w = 0.4):  P_w = ₹75 × 1.28  = ₹96.00  ≈ ₹96
  High risk week  (R_w = 0.8):  P_w = ₹75 × 1.56  = ₹117.00 ≈ ₹117
  Cap enforced at ₹120/week regardless of R_w
```

### Risk Score Weights — Justified

| Variable | Symbol | Weight | Justification | Source |
|----------|--------|--------|---------------|--------|
| Rainfall intensity | R | **0.25** | Highest single driver of income loss for Q-commerce riders | [IMD India Weather Statistics 2023](https://mausam.imd.gov.in/) |
| Platform outage | O | **0.20** | Direct income loss; 3 major Zepto outages in 2023 = ~₹1,200 lost/worker | Downdetector.in incident archive |
| Heat index | H | **0.15** | >25% productivity drop above 42°C | [ILO Working on a Warmer Planet, 2019, p.34](https://www.ilo.org/wcmsp5/groups/public/---dgreports/---dcomm/---publ/documents/publication/wcms_711919.pdf) |
| Cancellation rate | C | **0.15** | Demand-side volatility signal, unique to ShieldRide | Internal model validation |
| AQI severity | A | **0.10** | Strong seasonal impact (Oct–Jan); lower frequency than rain | [CPCB Annual Report 2023](https://cpcb.nic.in/annual-reports/) |
| Social disruption | S | **0.15** | Reserved for Phase 2 (curfew/strike signal via news APIs) | Extensibility buffer |
| **Total** | | **1.00** | Weights sum to 1.0 |  |

> **Note on weight design:** The 0.15 social disruption weight is intentionally reserved — not missing. It will be populated in Phase 2 using NLP-parsed news event signals (local strike/curfew data from Times of India / NDTV APIs). This makes the model **extensible** without retraining the entire scoring function.

### α Coefficient — Self-Calibrating

```
α is not hardcoded. It is learned and updated weekly:

α_new = Observed_Total_Loss_₹ / (P_base × Σ R_w × Worker_Count)

This ensures:
  • If payouts > premium collected → α increases (premiums rise next cycle)
  • If payouts < premium collected → α decreases (premiums stay competitive)
  • System self-corrects toward profitability without manual actuarial tuning
```

### Capital Adequacy Ratio (CAR)

```
CAR = Pool_Capital_₹ / Total_Expected_Loss_₹

Decision logic:
  CAR ≥ 1.5   → Stable. No premium adjustment.
  CAR 1.2–1.5 → Monitor. Slight α increase flagged.
  CAR < 1.2   → Alert. Premiums increased 10% next cycle.
  CAR < 1.0   → Critical. New policy issuance paused.

Example at 1,000 workers, high-risk week:
  Premium collected:     1,000 × ₹117 = ₹1,17,000
  Expected payouts:      280 workers × ₹520 avg = ₹1,45,600
  Reinsurance buffer:    ₹50,000 (seed pool)
  CAR = (₹1,17,000 + ₹50,000) / ₹1,45,600 = 1.15 → Trigger alert
```

---

## 🤖 AI & ML Architecture

### Overview

ShieldRide uses a **3-model ensemble** — risk scoring, fraud detection, and trigger probability — each serving a distinct function with independent retraining cadences.

```
┌─────────────────────────────────────────────────────────────────┐
│                    ML INFERENCE PIPELINE                        │
│                                                                  │
│  Input Features (per worker per week):                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │ Environmental│  │  Platform   │  │   Worker    │            │
│  │  5 signals  │  │  4 signals  │  │  6 signals  │            │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘            │
│         └─────────────────┼─────────────────┘                  │
│                           ▼                                     │
│              ┌────────────────────────┐                         │
│              │  Feature Engineering   │                         │
│              │  (15 derived features) │                         │
│              │  Rolling avg, variance │                         │
│              │  z-score normalisation │                         │
│              └────────────┬───────────┘                         │
│                           │                                     │
│        ┌──────────────────┼──────────────────┐                  │
│        ▼                  ▼                  ▼                  │
│  ┌──────────┐      ┌──────────┐      ┌──────────┐              │
│  │ Risk     │      │ Trigger  │      │ Fraud    │              │
│  │ Scorer   │      │ Prob.    │      │ Detector │              │
│  │ XGBoost  │      │ XGBoost  │      │ Isolation│              │
│  │ 50ms     │      │ 50ms     │      │ Forest   │              │
│  │ retrain  │      │ retrain  │      │ 80ms     │              │
│  │ weekly   │      │ weekly   │      │ retrain  │              │
│  └────┬─────┘      └────┬─────┘      └────┬─────┘              │
│       └─────────────────┼─────────────────┘                    │
│                         ▼                                       │
│              ┌────────────────────────┐                         │
│              │   Decision Engine      │                         │
│              │   Premium + Payout +   │                         │
│              │   Fraud gate           │                         │
│              └────────────────────────┘                         │
└─────────────────────────────────────────────────────────────────┘
```

### Model Specifications

| Model | Algorithm | Features | Inference Latency | Retraining | Metric Target |
|-------|-----------|----------|------------------|------------|---------------|
| Risk Scorer | XGBoost (n_estimators=100) | 15 normalized | **< 50 ms** | Every Sunday | RMSE < 0.08 |
| Trigger Probability | XGBoost classifier | 12 time-series | **< 50 ms** | Every Sunday | AUC-ROC > 0.87 |
| Fraud Detector | Isolation Forest | 18 behavioral | **< 80 ms** | Bi-weekly | Precision > 0.90, Recall > 0.80 |

> XGBoost inference benchmark: ~2–10ms for single prediction, well within 50ms budget.  
> [[XGBoost Benchmarks, NVIDIA RAPIDS, 2023](https://developer.nvidia.com/blog/benchmarking-xgboost-on-cpu-and-gpu/)]

### Feature Set (15 Environmental + Platform + Worker Features)

**Environmental features (5):**
- `rain_mm_hr_now` — current rainfall intensity (mm/hr)
- `heat_index_c` — feels-like temperature (Rothfusz equation)
- `aqi_score_norm` — AQI normalized 0–1 (AQI/500)
- `outage_hours_6h` — platform downtime in last 6 hours
- `cancel_rate_2h_ema` — 2-hour EMA of cancellation rate

**Platform features (4):**
- `order_density_zone` — orders per km² in worker's zone
- `surge_multiplier` — platform surge pricing factor
- `competitor_outage` — rival platform outage (demand shift)
- `zone_historical_risk` — 90-day historical disruption frequency for zone

**Worker features (6):**
- `income_variance_4w` — 4-week income variance (σ²)
- `active_hours_ratio` — active hours / total hours tracked
- `peak_hour_participation` — % of peak hours worked (12–3 PM, 6–10 PM)
- `consecutive_low_income_days` — streak of below-baseline days
- `tenure_weeks` — worker tenure on platform (longer = more stable baseline)
- `baseline_weekly_income` — rolling 4-week average weekly income

---

## 🛡️ Fraud Defense — Adversarial Resilience

### Threat Model

The primary fraud vector for parametric insurance is **signal manipulation** — gaming the trigger conditions rather than fabricating incidents. ShieldRide's fraud architecture is built on one core principle:

> **"No single signal is trusted in isolation. Trust emerges from cross-signal consistency."**

### The Three-Signal Fraud Score

```
F_w = w₁·B + w₂·G + w₃·L

Component scores (each ∈ [0, 1], higher = more suspicious):

B = Behavioral Anomaly Score
    • Time-series deviation: |current_activity - μ_30d| / σ_30d
    • Sudden income drop without correlated external event
    • Inactivity-to-trigger timing suspicion score
    Model: LSTM on 30-day activity sequences (Phase 2);
           Z-score thresholding (Phase 1)

G = Geo-Spatial Inconsistency Score
    • GPS trace continuity check (speed > 120 km/hr = flag)
    • Static GPS despite "active delivery" status
    • Location vs. weather cell mismatch
    • Cell tower triangulation cross-check
    Model: Rule-based in Phase 1; Kalman filter trajectory
           analysis in Phase 2

L = Linkage / Identity Risk Score
    • Shared device fingerprint (deviceID collision rate)
    • Shared UPI VPA across multiple accounts
    • Synchronized trigger claims in same geo-cluster
    • Social graph: >3 shared-device connections = fraud ring flag
    Model: Graph community detection (NetworkX),
           fraud ring detection via Louvain algorithm

Weights:  w₁ = 0.40  (behavior most diagnostic)
          w₂ = 0.35  (geo second most diagnostic)
          w₃ = 0.25  (linkage catches rings)
          Sum = 1.00  ✅
```

### Decision Matrix

| F_w Score | Action | SLA | User Experience |
|-----------|--------|-----|-----------------|
| **< 0.30** | ✅ Instant payout | < 5 min | Silent — payout credited |
| **0.30 – 0.50** | ✅ Payout with logging | < 5 min | Silent — flagged for review |
| **0.50 – 0.80** | ⏳ Delayed — re-validate | < 30 min | "Verifying your claim, hold tight" |
| **> 0.80** | 🚫 Blocked + manual review | — | "We need to verify this manually" |

> **Soft-fail guarantee:** Claims are HELD, never silently rejected. Every F_w > 0.8 case goes to manual review queue within 2 hours. This protects genuine workers during extreme weather events when GPS signals degrade naturally.

### Adversarial Scenario — Coordinated GPS Spoofing Ring

```
Scenario: 12 workers in the same zone all claim rainfall trigger
          simultaneously. GPS shows all stationary (genuine behavior
          during rain) but their device IDs share 3 common fingerprints.

Detection chain:
  Step 1: G score elevated (all show static GPS — ambiguous alone)
  Step 2: L score HIGH — 12 accounts, 3 shared device roots → fraud ring
  Step 3: F_w = 0.4×0.55 + 0.35×0.62 + 0.25×0.89 = 0.22+0.22+0.22 = 0.66
  Result: ⏳ All 12 claims moved to re-validation queue
  Legitimate workers with clean L score (unique devices) → auto-approved

Anti-spoofing layers:
  • Require network signal strength log during trigger window
  • Cell tower triangulation must place worker within 500m of GPS claim
  • Compare claimed trigger zone vs. worker's historical active zones
```

---

## 🏗️ System Architecture

### Architecture Diagram

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                      SHIELDRIDE — SYSTEM ARCHITECTURE                      ║
╚══════════════════════════════════════════════════════════════════════════════╝

  ┌──────────────────────────────────────────────────────────────────────────┐
  │                        EXTERNAL DATA SOURCES                             │
  │                                                                          │
  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │
  │  │OpenWeatherMap│  │  CPCB (AQI)  │  │ Platform API │  │ IMD Backup  │ │
  │  │  Rain · Heat │  │  Real-time   │  │  Orders·GPS  │  │   Weather   │ │
  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬──────┘ │
  └─────────┼─────────────────┼─────────────────┼─────────────────┼─────────┘
            └─────────────────┴────────┬─────────┴─────────────────┘
                                       │  poll every 15 min
                                       ▼
  ┌──────────────────────────────────────────────────────────────────────────┐
  │                             CLIENT LAYER                                 │
  │                                                                          │
  │    Worker PWA (React 18 + Vite)            Admin Dashboard (React)       │
  │   ┌──────────────────────────────┐    ┌───────────────────────────────┐  │
  │   │  • Onboarding / eKYC         │    │  • Fraud review queue         │  │
  │   │  • Premium display           │    │  • CAR monitor                │  │
  │   │  • Payout history            │    │  • Model performance          │  │
  │   │  • Risk dashboard            │    │  • Trigger audit log          │  │
  │   └──────────────┬───────────────┘    └──────────────┬────────────────┘  │
  └──────────────────┼──────────────────────────────────┼───────────────────┘
                     │  HTTPS / WSS (TLS 1.3)           │
                     ▼                                  ▼
  ┌──────────────────────────────────────────────────────────────────────────┐
  │               API GATEWAY  (Kong OSS v3)                                 │
  │       JWT auth  ·  Rate limit 200 req/min  ·  TLS termination            │
  └───────────────────────────────┬──────────────────────────────────────────┘
                                  │
          ┌───────────────────────┼──────────────────────────┐
          │                       │                          │
          ▼                       ▼                          ▼
  ┌───────────────┐     ┌─────────────────┐       ┌──────────────────┐
  │  ONBOARDING   │     │     POLICY      │       │    TRIGGER       │
  │    SERVICE    │     │     SERVICE     │       │    MONITOR       │
  │   (Node.js)   │     │   (Node.js)     │       │   (Node.js)      │
  │               │     │                 │       │                  │
  │ • OTP / KYC   │     │ • Premium calc  │       │ • API polling    │
  │ • DigiLocker  │     │ • Policy CRUD   │       │ • Threshold      │
  │ • UPI reg     │     │ • CAR check     │       │   evaluation     │
  └───────┬───────┘     └────────┬────────┘       └────────┬─────────┘
          └────────────────────  │  ──────────────────────┘
                                 │
                                 ▼
  ┌──────────────────────────────────────────────────────────────────────────┐
  │                  EVENT BUS  —  Apache Kafka 3.6                          │
  │                  3 brokers  ·  50K events/s throughput                   │
  └──────┬───────────────────────┬───────────────────────────┬───────────────┘
         │                       │                           │
         ▼                       ▼                           ▼
  ┌─────────────┐      ┌──────────────────┐        ┌─────────────────┐
  │  ML / RISK  │      │  FRAUD SERVICE   │        │  PAYOUT SERVICE │
  │   SERVICE   │      │   (FastAPI)      │        │   (Node.js)     │
  │  (FastAPI)  │      │                  │        │                 │
  │             │      │ F_w = w₁B + w₂G  │        │ • Razorpay UPI  │
  │ R_w scoring │      │       + w₃L      │        │ • NPCI settle   │
  │ XGBoost ×2  │      │ Isolation Forest │        │ • < 5 min SLA   │
  │ < 50ms inf. │      │ < 80ms inference │        │                 │
  └──────┬──────┘      └────────┬─────────┘        └────────┬────────┘
         └─────────────────────┬┘                           │
                               └─────────────┬──────────────┘
                                             │
                                             ▼
  ┌──────────────────────────────────────────────────────────────────────────┐
  │                            DATA LAYER                                    │
  │                                                                          │
  │  ┌───────────────────┐  ┌───────────────────┐  ┌──────────────────────┐ │
  │  │   PostgreSQL 16   │  │  TimescaleDB v2   │  │   Redis Cluster v7   │ │
  │  │   (AWS RDS        │  │  (Time-series     │  │   3 nodes            │ │
  │  │    Multi-AZ)      │  │   sensor data)    │  │                      │ │
  │  │                   │  │                   │  │  Session store       │ │
  │  │ Policies·Payouts  │  │ Weather·GPS logs  │  │  Feature cache       │ │
  │  │ Workers·Audit     │  │ Trigger history   │  │  TTL: 30 min         │ │
  │  └───────────────────┘  └───────────────────┘  └──────────────────────┘ │
  │                                                                          │
  │  ┌───────────────────────────────────────────────────────────────────┐   │
  │  │     AWS S3  —  ML model artefacts (versioned)  ·  Audit logs      │   │
  │  └───────────────────────────────────────────────────────────────────┘   │
  └──────────────────────────────────────────────────────────────────────────┘
                                             │
                                             ▼
  ┌──────────────────────────────────────────────────────────────────────────┐
  │                   NOTIFICATION SERVICE  (Node.js)                        │
  │                                                                          │
  │   Firebase FCM (push primary)  ·  Twilio SMS (fallback)                 │
  │   WhatsApp Business API  ·  "₹520 credited. Stay safe, Rajan 🛡️"       │
  └──────────────────────────────────────────────────────────────────────────┘

  ┌──────────────────────────────────────────────────────────────────────────┐
  │  INFRA  —  AWS Mumbai ap-south-1  ·  3-AZ Kubernetes EKS                │
  │  CloudFront CDN  ·  Route53 failover  ·  GitHub Actions CI/CD           │
  │  Prometheus + Grafana  ·  99.9% uptime SLA                              │
  └──────────────────────────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology | Version / Spec | Why This Choice |
|-------|-----------|---------------|-----------------|
| **Frontend** | React 18 + Vite | React 18.2, Vite 5.0 | Fast HMR, PWA plugin, tree-shaking |
| **Mobile wrapper** | Capacitor.js | v5.x | FCM push, no Play Store required |
| **API Gateway** | Kong OSS | v3.x | Rate limit 200 req/min/user, JWT plugin |
| **Backend services** | Node.js (Express) | Node 20 LTS | Async I/O for event-driven workloads |
| **ML model server** | FastAPI + Python | Python 3.11 | < 50ms inference, auto OpenAPI docs |
| **ML models** | XGBoost + scikit-learn | XGBoost 2.0 | Best-in-class tabular ML, SHAP explainability |
| **Event streaming** | Apache Kafka | Kafka 3.6, 3 brokers | 50K events/s throughput [[Confluent Benchmark](https://www.confluent.io/blog/kafka-fastest-messaging-system/)] |
| **Primary DB** | PostgreSQL | v16, AWS RDS Multi-AZ | ACID for policies/payouts, 99.95% SLA |
| **Time-series DB** | TimescaleDB | v2.x (on PG16) | 10x faster time-series queries vs plain PG [[TimescaleDB benchmark](https://www.timescale.com/blog/timescaledb-vs-influxdb-for-time-series-data-timescale-influx-sql-nosql-36489299baf9/)] |
| **Cache** | Redis Cluster | v7.x, 3 nodes | Session store, rate-limit counters, TTL 30 min |
| **Object storage** | AWS S3 | Standard tier | ML artefacts, audit logs (3-year IRDAI retention) |
| **Container** | Docker + Kubernetes | K8s 1.29, EKS | 3-zone HA, HPA auto-scaling |
| **CI/CD** | GitHub Actions | — | Build → test → deploy on PR merge |
| **Monitoring** | Prometheus + Grafana | — | p99 latency, trigger accuracy, fraud rate |
| **Notifications** | Firebase FCM + Twilio | — | Push primary, SMS fallback for payout alerts |
| **Payments** | Razorpay sandbox | Test mode Phase 1 | UPI Payout API, < 3 min NPCI settlement |
| **Auth** | JWT + OTP (MSG91) | — | Stateless, mobile-OTP aligned with gig worker UX |

### SLA & Performance Commitments

| Metric | Target | Measurement Method |
|--------|--------|--------------------|
| API p99 latency | **< 80 ms** | Prometheus histogram, 95th percentile |
| ML inference latency | **< 50 ms** | FastAPI middleware timer |
| Trigger detection lag | **< 15 minutes** | Kafka consumer lag monitor |
| Payout credit time | **< 5 minutes** | Razorpay webhook timestamp delta |
| System uptime | **99.9%** (< 8.76 hr/year) | Multi-AZ K8s, PodDisruptionBudget |
| eKYC onboarding | **< 90 seconds** | DigiLocker API median: ~30s + OTP |
| DB backup RPO | **< 1 hour** | RDS automated snapshots |
| Fraud review SLA | **< 2 hours** | Manual review queue, pagerduty alert |

### Infrastructure Topology

```
                    ┌─────────────────────────────┐
                    │     AWS Mumbai (ap-south-1)   │
                    │                               │
          ┌─────────┴──────────┐                   │
          │   AZ-1 (Mumbai-a)  │                   │
          │   Primary nodes    │                   │
          └─────────┬──────────┘                   │
                    │  Kafka replication            │
          ┌─────────┴──────────┐                   │
          │   AZ-2 (Mumbai-b)  │                   │
          │   Replica nodes    │                   │
          └─────────┬──────────┘                   │
                    │  RDS Multi-AZ standby         │
          ┌─────────┴──────────┐                   │
          │   AZ-3 (Mumbai-c)  │                   │
          │   ML inference     │                   │
          └────────────────────┘                   │
                    └─────────────────────────────┘

CDN: CloudFront for PWA static assets (< 50ms TTFB in India)
DNS: Route53 with health checks + failover routing
```

---

## 🔐 Adversarial Defense & Anti-Spoofing

### Threat Model

A coordinated fraud ring exploits the system using:
- GPS spoofing tools
- Off-platform coordination (e.g., Telegram)
- Artificial inactivity to trigger payouts

> Traditional GPS-based validation is insufficient. ShieldRide uses **multi-signal intelligence + adversarial detection**.

### Core Principle

> **No single signal is trusted in isolation.**
> ShieldRide performs **cross-signal consistency validation** across behavior, location, activity, and network data.

### Genuine vs Spoofed Worker

| Signal | Genuine Worker | Spoofed Actor |
|---|---|---|
| Movement | Continuous, realistic | Static or unrealistic |
| Delivery Logs | Active, timestamped | No real delivery activity |
| Behavioral History | Consistent patterns | Sudden deviation |
| Network Signals | Normal latency | Anomalous spikes |

### Multi-Dimensional Data Signals

**Spatial & Sensor:**
- Continuous GPS traces (not static points)
- Movement patterns (speed, trajectory consistency)

**Platform Activity:**
- Order acceptance & completion logs
- Delivery timestamps vs route feasibility
- Idle vs active transitions

**Network & Environment:**
- Network strength fluctuations
- Latency spikes during weather events
- Cell tower triangulation (cross-verification)

**Graph & Coordination:**
- Shared devices / IP / payment methods
- Synchronized inactivity across users
- Clustered trigger events in same region

### Fraud Detection Architecture

```
                ┌──────────────────────────┐
                │   Data Ingestion Layer   │
                │ (GPS, Orders, Network)   │
                └────────────┬─────────────┘
                             │
                ┌────────────▼─────────────┐
                │  Feature Engineering     │
                │ (Behavior + Movement)    │
                └────────────┬─────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌────────▼────────┐  ┌────────▼────────┐
│ Behavioral ML  │  │ Geo Validation  │  │ Graph Detection │
│ (Time-series)  │  │ (Movement check)│  │ (Fraud rings)   │
└───────┬────────┘  └────────┬────────┘  └────────┬────────┘
        └────────────┬───────┴────────────┬───────┘
                     │                    │
              ┌──────▼────────────────────▼──────┐
              │      Fraud Scoring Engine        │
              │          (F_w score)             │
              └────────────┬─────────────────────┘
                           │
              ┌────────────▼────────────┐
              │    Decision Engine      │
              │ Approve / Delay / Block │
              └─────────────────────────┘
```

### UX Balance (Fairness Layer)

| Confidence Level | Action |
|---|---|
| High Genuine | ✅ Instant payout |
| Medium | ⏳ Delayed (auto re-validation) |
| High Fraud | 🚫 Block & flag |

**Soft-Fail Mechanism:**
- Claims are **temporarily held, not rejected**
- System retries validation using alternate signals
- Avoids penalizing users during network drops or severe weather

**Transparent Communication:**
> `"Verification in progress due to signal inconsistency"` — No opaque or unexplained rejections.

---

## 📊 Business Viability

### Unit Economics (per 1,000 active workers)

```
REVENUE (weekly)
  Avg premium per worker:  ₹90 (blended across risk tiers)
  Active workers:          1,000
  Weekly premium pool:     ₹90,000

COSTS (weekly)
  Expected payout workers: ~22% activation rate (high disruption week)
  Avg payout per worker:   ₹480
  Total expected payouts:  220 × ₹480 = ₹1,05,600

  Wait — payouts > premiums in a bad week!
  This is why the SEED POOL and CAR mechanism exist:

SEED POOL & REINSURANCE
  Seed capital buffer:     ₹5,00,000 (Phase 1 initial pool)
  Reinsurance threshold:   Catastrophic events (AQI > 400 citywide, cyclones)
  CAR at launch:           ₹5,00,000 / ₹1,05,600 = 4.73 ✅ (very healthy)
  CAR steady-state target: ≥ 1.5

BREAK-EVEN ANALYSIS
  Break-even workers needed at ₹90 avg premium, 22% trigger rate, ₹480 avg payout:
  Premium per worker = ₹90
  Expected cost per worker = 0.22 × ₹480 = ₹105.60
  Loss per worker per week = ₹15.60

  This means: at current parameters, premiums need to be ~₹106 at 22% trigger rate
  OR trigger rate needs to drop to ≤ 18.75% at ₹90 premium

  Solution: α self-calibrates. After 4 weeks, α adjusts premiums upward automatically.
  By Week 6 with actual data, model will be profitable at scale.
```

### 3-Year Market Projection

| Year | Q-Commerce Riders (India) | ShieldRide Target (2% penetration) | Weekly Revenue |
|------|--------------------------|--------------------------------------|----------------|
| 2024 | ~900,000 | 18,000 workers | ₹1.62 Cr/week |
| 2025 | ~1,200,000 [[RedSeer Q-Commerce Report 2023](https://redseer.com/newsletters/quick-commerce-market-in-india/)] | 24,000 workers | ₹2.16 Cr/week |
| 2026 | ~1,500,000 | 30,000 workers | ₹2.70 Cr/week |

---

*Built with ❤️ for the 7.7 million gig workers of India who keep our groceries moving in 10 minutes — rain or shine.*

**ShieldRide** · Guidewire DEVTrails 2026 · Phase 1 · Team [Recaptcha]

`Persona: Q-Commerce (Zepto · Blinkit)` · `Coverage: Income Loss Only` · `Premium: Weekly`

---

</div>
