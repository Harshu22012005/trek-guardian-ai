🚀 Xplorevo – Adventure Guardian AI
India’s First Real-Time Truth, Health & Fraud Safety Engine for Travellers
(Hackathon Edition – Full‑Stack Web App)

🧭 Overview
Adventure travel in India is booming — but so are scams, misleading reels, unsafe routes, and preventable health emergencies.
Adventure Guardian AI, built under Xplorevo, solves this by acting as a digital safety companion that checks:

✔ Whether online trek/reel information is accurate

✔ Whether a traveler is medically at risk on a given route

✔ Whether a payment, agent, UPI ID, or invoice is suspicious

All three systems combine to generate a Verified Trek Score (0–100) — a single number that tells travelers if their trip is safe.

This README explains the entire build: tech stack, APIs, architecture, deployment, demo data, and how to run the project.

🎯 Problem We’re Solving
Indian travelers face three major risks:

1️⃣ Misinformation Epidemic
Reels often exaggerate difficulty, hide real weather, crop dangerous patches, or show outdated routes.

2️⃣ Hidden Health Dangers
Most cases of AMS, exhaustion, dehydration, and hypothermia are predictable — but travelers don’t get warnings early.

3️⃣ Fraud & Financial Scams
Fake operators, fake UPI IDs, edited invoices, and WhatsApp fraud groups cause massive avoidable losses.

👉 There is no unified platform that verifies information, predicts risks, and flags fraud.

💡 Our Solution — Adventure Guardian AI
A full-stack AI-powered safety engine that provides:

🔍 1. Misinformation Scanner
Upload a reel screenshot or trek poster → instantly verifies:

Route accuracy (via elevation/geodata)

Weather authenticity

Edited / AI‑generated sky

Overcrowding detection

Fake guide recognition

Difficulty mismatch

Output:

Truth Score (0–100)

“Misleading because…” explanation

🩺 2. Health Risk Predictor
Enter trek altitude, duration, fitness level → predicts:

AMS risk

Exhaustion/fatigue probability

Hydration requirement

Weather-related danger

Recovery/fitness recommendation

Output:

Health Score (0–100)

Personalized safety suggestions

🛡 3. Fraud & Scam Detector
Upload invoice/UPI ID/website/phone number:

Checks:

Fake UPI formatting

Scam keywords

Duplicate invoice patterns

Pricing manipulation

Phone reputation metadata

Domain validity

Output:

Fraud Score (0–100)

Safe/Unsafe Badge

⭐ FINAL RESULT — Verified Trek Score
A combined AI score of:

✔ Truth
✔ Health
✔ Fraud

→ One final number telling the user whether to proceed or avoid.

🛠 Tech Stack (Used in Actual Implementation)
Frontend
React.js

TailwindCSS

React Router

Axios

Framer Motion (for smooth animations)

Backend
Node.js + Express

REST API architecture

Gemini API calls handled server‑side

JWT Authentication (Optional)

Multer (for file uploads)

AI Layer
Google Gemini 1.5 Flash / Pro

Vision analysis

Text reasoning

Fraud pattern detection

Misinformation scoring logic

Free External APIs
Used because they require zero billing / free keys:

Purpose	API	Cost
Weather check	OpenWeatherMap Free API	Free
Elevation/Altitude	OpenTopoData API	Free
Map Routing	OpenStreetMap Data	Free
UPI/Phone validation	Custom rule engine (no paid API)	Free
Image metadata	EXIF-js	Free
🧪 Demo Data You Should Include
Since we’re using Gemini + free APIs, we will use demo samples for consistency:

Misinformation demo
Fake reel screenshot with wrong weather

Trek poster with boosted contrast

Old route photo from 2019

Health demo
Trek altitude: 5200m

Temperature: -8°C

Beginner‑level trekker

Fraud demo
Fake UPI: @yblx

Edited invoice PNG

Phishing travel website

🏗 System Architecture (Simple + Hackathon‑Optimized)
Frontend (React)
      ↓
Backend (Node.js + Express)
      ↓
AI Layer (Gemini API)
      ↓
External Free APIs
(OpenWeather, OpenTopoData, OSM)
⚙ Setup Instructions (Local Development)
1. Clone repo
git clone https://github.com/xplorevo/adventure-guardian-ai.git
cd adventure-guardian-ai
2. Install backend
cd backend
npm install
3. Add Gemini API Key
Create .env:

GEMINI_API_KEY=YOUR_KEY_HERE
4. Start backend
npm start
5. Install & start frontend
cd ../frontend
npm install
npm run dev
📦 API Routes (Backend)
POST /misinfo
Accepts image upload
Calls Gemini Vision
Cross-checks weather + elevation
POST /health
Accepts form data

Uses elevation + weather API
Returns Health Score
POST /fraud
Accepts text or invoice file
Extracts metadata + Gemini analysis
GET /trek-score
Compiles all three scores
Returns final Verified Trek Score

📊 Scoring Logic
Truth Score — 40% weight
Weather mismatch
Edited image probability
Route deviation
Overcrowding

Health Score — 40% weight
AMS probability
Temperature stability
Fatigue risk
Hydration deficit

Fraud Score — 20% weight
UPI pattern
Invoice authenticity
Scam indicator flags
