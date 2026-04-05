# 💰 Finance Dashboard Backend

## 🚀 Overview

This project is a backend system for managing financial records with role-based access control.

Unlike basic CRUD systems, this backend introduces intelligent features such as insight generation and anomaly detection to simulate real-world fintech systems.

---

## 🔥 Features

### Core Features

* User & Role Management (Viewer, Analyst, Admin)
* Financial Records CRUD (Create, Read, Update, Delete)
* Advanced Filtering & Pagination
* Dashboard APIs (Summary, Trends, Category Breakdown)

### 🧠 Intelligent Features

* **Insight Engine** → Detects spending trends using time-based comparison
* **Anomaly Detection** → Flags unusual expenses using rule-based logic with edge case handling

---

## 🏗️ Architecture

The backend follows a layered architecture:

* **Routes** → Define API endpoints
* **Controllers** → Handle request & response logic
* **Services** → Contain business logic (insights, anomaly detection)
* **Models** → Define database schemas

This separation ensures scalability, maintainability, and clean code structure.

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication

---

## 🔐 Role Permissions

| Role    | Access           |
| ------- | ---------------- |
| Viewer  | Read-only access |
| Analyst | Read + Insights  |
| Admin   | Full control     |

---

## ⚙️ Setup

```bash
git clone https://github.com/Darshangowdac2005/finance-backend-nodejs
cd finance-backend-nodejs
npm install
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

---

## 📌 API Endpoints

* `/api/auth` → Authentication & user management
* `/api/records` → Financial records CRUD
* `/api/dashboard` → Summary, trends, category analytics
* `/api/insights` → Intelligent financial insights
* `/api/records/anomalies` → Detect unusual transactions
* `/api/dev/seed` → Seed test data (for development)

---

## 📊 Sample API Response

### GET `/api/insights`

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

---

## ✨ Why This Project is Unique

While many backend projects stop at basic CRUD operations, this system introduces **algorithmic intelligence** to provide meaningful insights:

* Time-based trend analysis
* Rule-based anomaly detection
* Real-world financial behavior simulation

This reflects real fintech backend patterns where systems actively assist users rather than just store data.

---

## 💡 Key Highlight

> This backend goes beyond CRUD by incorporating rule-based financial intelligence including anomaly detection and trend-based insights, demonstrating real-world backend design and product thinking.

---

## 🚀 Future Improvements

* Authentication enhancements (refresh tokens)
* Rate limiting & security improvements
* API documentation (Swagger)
* Deployment (Render / Railway)
* Unit & integration testing

---

## 👨‍💻 Author

Darshan Gowda
