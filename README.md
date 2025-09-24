# Job Listing Web App (MERN + Puppeteer)

A **Full-Stack Job Listing Platform** built with the **MERN Stack** and a custom **web scraper** using Puppeteer. This project allows users to **create, view, search, filter, sort, and delete jobs**, while also scraping live jobs from ActuaryList.

-----

## ✨ Features

  - 🔹 **MERN Stack** (MongoDB, Express, React, Node.js)
  - 🔹 **RESTful APIs** with validation and error handling
  - 🔹 **Filtering, sorting, and pagination** for jobs
  - 🔹 **Frontend UI** built with React, Vite, and Tailwind CSS
  - 🔹 **Toast notifications** for success and errors
  - 🔹 **Puppeteer Scraper** for fetching external job listings
  - 🔹 **Environment variables support** with `.env`
  - 🔹 Centralized error handler and reusable validators

-----

## 📂 Project Structure

```
repo/
├── client/ # React (Vite) frontend
│ └── src/
│ ├── components/ # UI components
│ ├── pages/ # Pages (Jobs list, New job form)
│ ├── services/ # API service layer
│ └── App.jsx
│
└── server/ # Express backend
├── config/ # DB connection
├── controllers/ # Job controllers (CRUD)
├── middleware/ # Error & validation middleware
├── models/ # Mongoose Job model
├── routes/ # Job routes
├── scraper/ # Puppeteer scraper
├── validators/ # Express-validator schemas
└── server.js # App entry point
```

-----

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/job-listing-app.git
cd job-listing-app
```

### 2️⃣ Setup Backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` directory:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.0.1:27017/jobsdb
NODE_ENV=development
SCRAPE_SECRET=12345
```

Run the backend in dev mode:

```bash
npm run dev
```

### 3️⃣ Setup Frontend

```bash
cd ../client
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`.
The API runs at `http://localhost:5000/api/jobs`.

-----

## 🔗 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/jobs` | Get all jobs (with filters) |
| `GET` | `/api/jobs/:id` | Get a job by ID |
| `POST` | `/api/jobs` | Create a new job |
| `PUT` | `/api/jobs/:id` | Update a job (replace) |
| `PATCH` | `/api/jobs/:id` | Update a job (partial) |
| `DELETE` | `/api/jobs/:id` | Delete a job |
| `POST` | `/api/jobs/scrape` | Trigger scraper (with token) |

-----

## 🖥️ Frontend Preview

**Job List Page** → View jobs with filters, search, sort, and pagination.

**Add Job Popup** → Create new jobs with validation.

**Scraper Button** → Fetch the latest jobs from ActuaryList.

**Toast Notifications** for success and errors.

-----

## 🕷️ Scraper (Puppeteer)

Scrape jobs from ActuaryList:

Run the scraper manually:

```bash
cd server
npm run scrape
```

Run the scraper via API (protected with a token):

```
POST http://localhost:5000/api/jobs/scrape?token=12345
```

-----

## 🧪 Testing with Postman

A Postman collection is available at:

```
server/postman/jobs_api.json
```

**Steps:**

1.  Import the JSON file into Postman.
2.  Set environment variables:
      - `baseUrl` = `http://localhost:5000`
      - `jobId` = `<after creating a job>`
3.  Run the CRUD requests directly.

-----

## 🛠️ Tech Stack

**Frontend:** React (Vite), Tailwind CSS, React-Toastify
**Backend:** Node.js, Express.js, MongoDB, Mongoose
**Validation:** `express-validator`
**Scraping:** Puppeteer
**Dev Tools:** Nodemon, Morgan

-----

## 👨‍💻 Author

**Bilal Ahmad**
📞 +92 313 4432915