# 🚀 Rankify AI-SEO Tracker

A modern, full-stack AI-powered SEO optimization and tracking platform built using the MERN stack, featuring secure HTTP-only cookie authentication, automated website audits, real-time keyword tracking, and intelligent AI-driven report creation.

---

### 🌐 Live Link

* **Live Application:** [https://rankify-ai-seo.vercel.app](https://rankify-ai-seo.vercel.app)

---

### 📊 Core Features & Capabilities

* **🌐 Website SEO Analyzer Tool:** Deeply inspects and scores target websites using automated scraping and heuristic evaluation.
* **🔒 Secure Authentication System:** User registration, password hashing with bcrypt, login, and protected routes using HTTP-only cookies, cookie-parser, and JSON Web Tokens (JWT).
* **🤖 AI-Powered SEO Report Creator:** Embeds Google Gemini AI (`@google/genai`) to automatically synthesize performance audits and generate intelligent, actionable optimization reports.
* **📈 Monitor Keyword Rankings:** Tracks active search engine keyword positions over time with historical performance logs.
* **⚡ Automation & Background Jobs:** Powered by Cheerio for page parsing and node-cron for scheduled daily updates.
* **💻 Modern UI/UX:** Responsive admin dashboard built with React, Vite, and Tailwind CSS, featuring robust API communication via Axios and notifications with Sonner.

---

### 🛠 Tech Stack & Deployment

* **Frontend:** React, Vite, Tailwind CSS, Lucide React, React Router Dom, Sonner, Axios (Deployed on Vercel)
* **Backend & API:** Node.js, Express, JWT, Bcrypt, Cheerio, Google Gemini AI (`@google/genai`), Node-cron, Mongoose (Deployed on Render)
* **Database & Storage:** MongoDB & Mongoose (NoSQL Database)

---

### 📁 Folder Structure

```text
Rankify-AI-SEO/
├── client/                 # Frontend (React + Vite)
├── server/                 # Backend (Node.js + Express)
└── README.md