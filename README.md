# Finance Data Processing & Access Control Backend 📊

**Assignment Portal Submission**  
**Author:** Darshan Gowda C (darshangowdac2005@gmail.com)  
**Company:** Zorvyn FinTech Pvt. Ltd.  
**Role:** Backend Developer Intern  

---

## 🎯 Objective
This project is a complete and robust implementation of the "Finance Data Processing and Access Control Backend" evaluation. The architecture is cleanly divided into an enterprise-grade Node.js/Express REST API and a supplementary Vite + React frontend showcase.

## ✨ Implementation Highlights (Core Requirements)
- **User & Role Management:** Three-tier RBAC system (`viewer`, `analyst`, `admin`) utilizing JWT and bcrypt authentication.
- **Financial Records Management:** Complete CRUD capabilities with dynamic query filtering (by type, category, date limits) and strict cursor-based pagination.
- **Dashboard Summary REST APIs:** Native MongoDB Aggregation pipelines computing net balances, category breakdowns, and weekly/monthly trends natively at the database level.
- **Access Control Logic:** Scalable middleware dynamically guarding routes and ensuring actions map specifically to authorized boundaries.
- **Validation & Error Handling:** Centralized error wrappers catching promise rejections, returning clean uniform HTTP error payloads, and sanitizing Mongoose exceptions.

## 🌟 Optional Enhancements & Added Thoughtfulness
Going beyond the baseline requirements, this submission features:
1. **The Insight Engine:** Evaluates calendar week-over-week financial disparities via aggregation logic, generating human-readable alerts when specific metrics spike > 30%.
2. **Anomaly Detection System:** Mathematically scans the database to flag highly unusual transactions exceeding 2x the standard deviation threshold of expense histories.
3. **Frontend React Showcase UI:** Ships with a locally embedded Glassmorphic React dashboard specifically designed to visually demonstrate the API operations, access control, and data generation cleanly without relying exclusively on Postman.

---

## 🛠 Tech Stack

**Backend Architecture**
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose ODM)
- **Security:** JSON Web Tokens (jsonwebtoken) & bcryptjs

**Showcase UI (Frontend)**
- **Framework:** React + Vite
- **Styling:** Vanilla CSS (Tailored Design Palette)

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (Running locally on `localhost:27017` or accessible via Atlas)

### 1. Clone & Configure
```bash
git clone <repository-url>
cd "Finance dashboard"
npm install
```

Configure the environment variables:
```bash
cp .env.example .env
```
Ensure your locally generated `.env` contains:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/finance_dashboard
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
```

### 2. Start the Backend API
```bash
# Production Setup
npm start

# Development Setup
npm run dev
```
*The API Gateway will actively listen at `http://localhost:5000`.*

### 3. Start the Frontend Showcase UI
Open a secondary terminal window to boot the React view:
```bash
cd frontend
npm install
npm run dev
```
*Navigate your browser to **`http://localhost:5173`** to interact with the system.*

---

## 📁 System Architecture

```text
Finance dashboard/
├── app.js                     # Express setup & global middleware pipelines
├── server.js                  # Gateway entry point
├── config/                    # Database drivers & strict connection handling
├── controllers/               # Route handling & operational logic
├── middleware/                # JWT parsing, RBAC guards, & Error Handlers
├── models/                    # Mongoose schemas (User, Record)
├── routes/                    # API Endpoints (/auth, /users, /records, /dashboard, /insights)
├── services/                  # Complex Business Logic & MongoDB Aggregation Separation
├── utils/                     # Promisified async wrappers & token generators
└── frontend/                  # Isolated Vite+React SPA connected via Vite Proxy
```

---

## 🔐 Access Control Matrix

| System Action | Viewer | Analyst | Admin |
| :--- | :---: | :---: | :---: |
| Authenticate / View Profile | ✅ | ✅ | ✅ |
| Retrieve Financial Records | ✅ | ✅ | ✅ |
| View Base Dashboard Metrics | ✅ | ✅ | ✅ |
| View Complex Aggregated Trends| ❌| ✅ | ✅ |
| Access AI Insights / Anomalies | ❌| ✅ | ✅ |
| Create / Mutate Records | ❌ | ❌ | ✅ |
| Edit User Roles / Statuses | ❌ | ❌ | ✅ |

---

## ⚠️ Documented Assumptions & Tradeoffs

1. **Routing Focus:** Integrating the React frontend proxy avoids the necessity of enabling overly permissive CORS rules on the backend, representing a significantly safer production security design.
2. **Insight Algorithms:** Week-over-week analysis algorithms calculate based on exact ISO calendar boundaries (Monday starts) rather than raw trailing 7-day increments, mapping more accurately to standardized corporate financial auditing.
3. **Security Constraints:** Administrative users are explicitly restricted via logic from mutating or deactivating their own roles to prevent unrecoverable database lockouts.
4. **Data Isolation:** For the purpose of the functional dashboard demonstration, Records are pooled natively to generate expansive analytics; in a scalable multi-tenant environment, aggregation queries would be strictly prefixed with `{ createdBy: req.user.id }`.
