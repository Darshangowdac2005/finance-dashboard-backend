💰 Finance Dashboard Backend
🚀 Overview

This project is a backend system for managing financial records with role-based access control.

Unlike basic CRUD systems, this backend includes intelligent features such as insight generation and anomaly detection to simulate real-world fintech systems.

🔥 Features
User & Role Management (Viewer, Analyst, Admin)
Financial Records CRUD
Advanced Filtering & Pagination
Dashboard APIs (summary, trends, categories)
### Intelligent Features
- Insight Engine for trend detection
- Rule-based anomaly detection with edge case handling
🛠️ Tech Stack
Node.js
Express.js
MongoDB (Mongoose)
JWT Authentication
🔐 Role Permissions
Role	Access
Viewer	Read-only
Analyst	Read + Insights
Admin	Full control
⚙️ Setup
npm install
npm run dev
📌 API Endpoints
/api/auth
/api/records
/api/dashboard
/api/insights
/api/records/anomalies
/api/dev/seed (Testing endpoint)

### Sample API Response (GET /api/insights)
```json
{
  "success": true,
  "data": {
    "insights": [
      "Your Food spending increased by 34.5% compared to last week."
    ]
  }
}
```

✨ Why This Project is Unique
While many student projects stop at basic CRUD operations, this backend introduces algorithmic evaluation to provide active value to users. Time-comparison logic simulates real product analytics, preparing it for real-world fintech scaling patterns.

💡 Key Highlight

This backend goes beyond CRUD by incorporating insight generation and anomaly detection, demonstrating real-world backend intelligence and product thinking.
