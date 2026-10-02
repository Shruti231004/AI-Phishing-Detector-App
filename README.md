# 🛡️ ScamScan - AI-Powered Phishing Detector & Cyber Defense Console

An intelligent, multi-layered phishing detection web application built for students, academic institutions, and modern organizations. Designed and developed for the **AI + Cyber Defense** initiative at **TCS Tech Day @ Vidyavardhini College of Engineering & Technology (VCET)**.

---

## 📌 Problem Statement & Context
Students frequently receive formal-looking emails and messages regarding **scholarships, examination fees, hackathons, internships, and placement recruitment**. Attackers increasingly leverage AI-generated templates to impersonate trusted authorities (college administration, placement cells, scholarship portals, banks).

**ScamScan** inspects suspicious communications in real time, classifies them as **Safe**, **Suspicious**, or **High Risk**, breaks down highlighted threat vectors, and provides a clear **Recommended Safe Next Action** to prevent data harvesting, financial fraud, and credential loss.

---

## ⚡ Key Features & Verification Architecture

ScamScan combines multiple independent verification layers into a unified cybersecurity analysis pipeline:

```
[ Incoming Message & Sender Email ]
               │
               ▼
   ┌───────────────────────┐
   │    Verifier Agent     │ ◄── Real-time terminal log sequence
   └───────────┬───────────┘
               │
 ┌─────────────┼─────────────┬───────────────────────────┐
 │             │             │                           │
 ▼             ▼             ▼                           ▼
[ Layer 1 ]   [ Layer 2 ]   [ Layer 3 ]                 [ Layer 4 ]
Naive Bayes   Trusted       Context-Aware               URL Reputation &
AI Classifier Domain        Heuristic Rules             Google Safe
(Client-Side) Registry      (Negation-Aware Engine)     Browsing Lookup
 │             │             │                           │
 └─────────────┴──────┬──────┴───────────────────────────┘
                      ▼
        [ Composite Risk Assessment ]
         • Dual Animated Visual Gauges (Risk Pts + AI Probability)
         • Safe / Suspicious / High Risk Status Badge
         • Highlighted Red Flags (Matched wording + Explanation)
         • Contextual Recommended Safe Next Action
```

### 1. 🧠 Client-Side Naive Bayes ML Classifier
- Runs native natural-language probability estimation directly in the browser.
- Pre-trained on an academic and student-centric corpus of phishing attacks vs. legitimate institutional communications.
- Operates 100% offline with zero external API dependencies required for core classification.

### 2. 🏛️ Trusted Domain Registry
- Cross-references the sender's actual email domain against organizations claimed in the message body.
- Detects domain spoofing, typosquatting (e.g., number substitution like `0` for `o`), lookalike hyphens, and free webmail impersonation (`@gmail.com` claiming to be VCET or TCS).
- Verified entities include **Vidyavardhini College (`vcet.edu.in`, `vvcoe.ac.in`)**, **TCS (`tcs.com`)**, **Infosys**, **Wipro**, **National Scholarship Portal (`scholarships.gov.in`)**, **SBI**, **HDFC**, **UGC**, and **AICTE**.

### 3. 🎯 Context-Aware & Negation-Handling Heuristic Engine
- Analyzes psychological coercion vectors:
  - **Urgency & Time Pressure** (*"within 24 hours"*, *"act now"*, *"expiring"*)
  - **Financial Demand & Fee Penalties** (*"pay ₹"*, *"registration fee"*, *"deposit"*)
  - **Credential Harvesting** (*"OTP"*, *"PIN"*, *"CVV"*, *"net banking password"*)
  - **Unrealistic Reward Traps** (*"congratulations"*, *"won free iPad"*, *"cash prize"*)
  - **Threat of Consequence** (*"account suspended"*, *"admission cancelled"*)
- **Negation Context Checking:** Uses a look-behind window to distinguish security advisories (*"Never share your OTP"*, *"No registration fee is charged"*) from actual threats, eliminating false positives on official notices.

### 4. 🌐 External Threat Intelligence (URLhaus & Google Safe Browsing)
- Extracts hyperlinks and URL shorteners (`bit.ly`, `tinyurl`).
- Supports the **URLhaus (abuse.ch)** API to check live threat feeds for reported malware and phishing distribution endpoints.
- Generates direct domain verification links to the **Google Safe Browsing Transparency Report**.

---

## 🛠️ Tech Stack
- **Framework:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language:** JavaScript (ESNext / JSX)
- **Styling:** Custom CSS3 with Dark Cyber-Defense Theme & Glassmorphism
- **Machine Learning:** Client-Side Naive Bayes Classifier (Zero-latency tokenization & log-odds prediction)
- **APIs Supported:** abuse.ch URLhaus API, Google Safe Browsing Transparency Report

---

## 🚀 Quickstart & Local Installation

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm (v9.0.0 or higher)

### 1. Clone the Repository
```bash
git clone https://github.com/Shruti231004/AI-Phishing-Detector-App.git
cd AI-Phishing-Detector-App
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your web browser.

### 4. Build for Production
```bash
npm run build
```
Generates an optimized static bundle in the `/dist` directory.

---

## 🧪 Built-in Test Cases (Loadable Templates)

| Template Name | Threat Vectors Present | Expected Verdict |
| :--- | :--- | :--- |
| **⚠️ Scholarship Scam** | Free provider claiming official authority, fee demand, OTP request, unverified link | **HIGH RISK** |
| **⚠️ Tuition Fee Scam** | `@gmail.com` impersonating VCET, suspension threat, unofficial UPI ID | **HIGH RISK** |
| **⚠️ Placement Scam** | Security deposit demand, 24h deadline, URL shortener (`bit.ly`) | **HIGH RISK** |
| **⚠️ Lucky Winnings Scam** | Unrealistic reward, OTP capture, countdown urgency | **HIGH RISK** |
| **✓ Official College Notice** | Official `@vcet.edu.in` domain, ERP portal directive, cautionary advisory | **SAFE** |

---

## 🔑 Optional Configuration (.env)

The core application works out-of-the-box offline. If you have an abuse.ch community Auth-Key for live automated URL scanning, create a `.env` file in the root directory:

```env
VITE_URLHAUS_AUTH_KEY=your_abuse_ch_auth_key_here
```
*(Get a free Auth-Key at [https://auth.abuse.ch/](https://auth.abuse.ch/))*

---

## 📂 Project Structure

```
AI-Phishing-Detector-App/
├── index.html                   # HTML entry point with cyber-defense typography
├── vite.config.js               # Vite build configuration
├── package.json                 # Dependencies and npm scripts
├── src/
│   ├── main.jsx                 # React root mount
│   ├── App.jsx                  # Main application state and coordinator
│   ├── App.css                  # SaaS dashboard styling, neon accents, gauge animations
│   ├── components/
│   │   ├── Sidebar.jsx          # Brand details & live AI model metrics widget
│   │   ├── ScannerInput.jsx     # Input text area, email input, sample templates
│   │   ├── TerminalConsole.jsx  # Animated Verifier Agent diagnostic log console
│   │   └── ResultsPanel.jsx     # Dual gauges, domain status, red flags, safe actions
│   └── utils/
│       ├── aiClassifier.js      # Naive Bayes ML classifier implementation & training corpus
│       ├── domainRegistry.js    # Trusted institutional domain mappings & validation logic
│       ├── rulesEngine.js       # Heuristic keyword rules with negation context window
│       └── webSearchVerifier.js # URLhaus API client & Safe Browsing URL generator
└── README.md
```

---

## 📜 License
This project was developed for educational, demonstration, and cyber defense research purposes. Open for academic exploration and review.
