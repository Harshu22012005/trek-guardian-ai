# 🚀 Xplorevo – Adventure Guardian AI

### India’s First Real-Time Truth, Health & Fraud Safety Engine for Travellers

---

## 🧭 Overview

Adventure tourism in India is experiencing a massive surge, driven by social media inspiration, affordable travel options, and a growing curiosity for remote mountain regions. Yet this rise comes with significant and often overlooked safety challenges. Countless travellers rely on reels, trek posters, or influencer vlogs that may be outdated, exaggerated, or knowingly misleading — resulting in wrong expectations, underpreparedness, and serious medical risks. Simultaneously, scam operators and fake travel agencies have found new ways to exploit unsuspecting hikers through fraudulent UPI IDs, edited invoices, and deceptive websites.

Adventure Guardian AI was created to address all these issues in one unified system. It doesn’t just warn travellers — it verifies facts, predicts dangers, and flags fraud using real-time AI analysis, geodata, weather intelligence, and behavioural pattern insights. Whether someone is checking if a reel is real, evaluating if their fitness level is compatible with a high-altitude trek, or confirming if a payment request is genuine, this platform acts as a reliable safety companion.

The platform generates a single Verified Trek Score (0–100), helping users make informed decisions before committing time, money, and health to their adventure.

**Adventure Guardian AI**, built under Xplorevo, acts as a digital safety companion that verifies:

* ✔ Whether online trek/reel information is accurate
* ✔ Whether a traveler is medically at risk
* ✔ Whether a payment, agent, UPI ID, or invoice is suspicious

All three systems together generate a **Verified Trek Score (0–100)** — a single number that tells travelers if their trip is safe.

---

## 🎯 Problem We’re Solving

Indian travelers face **three major risks**:

### 1️⃣ Misinformation Epidemic

Reels often exaggerate difficulty, hide real weather, crop dangerous patches, or use outdated footage.

### 2️⃣ Hidden Health Dangers

AMS, dehydration, exhaustion, hypothermia — most are predictable with correct data.

### 3️⃣ Fraud & Financial Scams

Fake operators, fake UPI IDs, edited invoices, phishing pages — causing huge preventable losses.

👉 There is **no unified platform** that verifies information, predicts risks, and flags fraud.

---

## 💡 Our Solution — Adventure Guardian AI

A full-stack AI‑powered safety engine that delivers:

---

## 🔍 1. Misinformation Scanner

Upload a reel screenshot or trek poster → system verifies:

* Route accuracy via elevation/geodata
* Weather authenticity
* Edited / AI-generated sky
* Overcrowding
* Fake/unknown guides
* Difficulty mismatch

**Output:**

* **Truth Score (0–100)**
* Explanation of misleading elements

---

## 🩺 2. Health Risk Predictor

Input: altitude, duration, fitness level, temperature.

Predicts:

* AMS risk
* Fatigue probability
* Hydration need
* Weather-related danger

**Output:**

* **Health Score (0–100)**
* Personalized safety suggestions

---

## 🛡 3. Fraud & Scam Detector

Upload invoice / UPI ID / website / phone number.

Checks:

* Invalid UPI formatting
* Scam keywords
* Fake invoice patterns
* Suspicious pricing
* Phone identity metadata
* Domain/website validity

**Output:**

* **Fraud Score (0–100)**
* Safe / Unsafe Badge

---

## ⭐ FINAL RESULT — Verified Trek Score

A combined score of:

* ✔ Truth Score
* ✔ Health Score
* ✔ Fraud Score

→ Provides one **final safety score** (0–100) for the trek.

---

## 🛠 Tech Stack

### **Frontend**

* React.js
* TailwindCSS
* React Router
* Axios
* Framer Motion

### **Backend**

* Node.js + Express
* REST API architecture
* Gemini API (server‑side)
* JWT Authentication *(optional)*
* Multer for file uploads

### **AI Layer**

* Google Gemini 1.5 Flash / Pro
* Vision analysis
* Text reasoning
* Fraud pattern detection
* Misinformation scoring logic

### **Free External APIs** *(Zero billing)*

| Purpose              | API                | Cost |
| -------------------- | ------------------ | ---- |
| Weather              | OpenWeatherMap     | Free |
| Elevation            | OpenTopoData       | Free |
| Routing              | OpenStreetMap      | Free |
| UPI/Phone validation | Custom rule engine | Free |
| Image metadata       | EXIF-js            | Free |

---

## 🧪 Demo Data (For Hackathon Testing)

### **Misinformation Demo**

* Fake reel screenshot with incorrect weather
* Trek poster with boosted contrast
* Old route photo (2019)

### **Health Demo**

* Trek altitude: **5200m**
* Temperature: **–8°C**
* Beginner-level trekker

### **Fraud Demo**

* Fake UPI ID: `@yblx`
* Edited invoice (PNG)
* Phishing travel website

---

## 🏗 System Architecture

```
Frontend (React)
      ↓
Backend (Node.js + Express)
      ↓
AI Layer (Gemini API)
      ↓
External Free APIs (OpenWeather, OpenTopoData, OSM)
```

---

## ⚙ Setup Instructions (Local Development)

### 1. Clone repo

```bash
git clone https://github.com/xplorevo/adventure-guardian-ai.git
cd adventure-guardian-ai
```

### 2. Install backend

```bash
cd backend
npm install
```

### 3. Add Gemini API Key

Create a `.env` file:

```
GEMINI_API_KEY=YOUR_KEY_HERE
```

### 4. Start backend

```bash
npm start
```

### 5. Install & start frontend

```bash
cd ../frontend
npm install
npm run dev
```

---

## 📦 API Routes (Backend)

### **POST /misinfo**

* Accepts image upload
* Calls Gemini Vision
* Cross-checks weather + elevation

### **POST /health**

* Accepts trek form data
* Uses elevation + weather API
* Returns Health Score

### **POST /fraud**

* Accepts text or invoice file
* Extracts metadata
* Gemini fraud analysis

### **GET /trek-score**

* Combines Truth + Health + Fraud scores
* Returns final Verified Trek Score

---

## 📊 Scoring Logic

### **Truth Score — 40% Weight**

* Weather mismatch
* Edited image probability
* Route deviation
* Overcrowding

### **Health Score — 40% Weight**

* AMS probability
* Temperature stability
* Fatigue risk
* Hydration deficit

### **Fraud Score — 20% Weight**

* UPI pattern validation
* Invoice authenticity
* Scam indicators