# Linkasa

> Learn BISINDO the fun way.

---

## About

A gamified platform for learning BISINDO, inspired by Duolingo. Users start by mastering flashcards, then complete levels through interactive visual exercises, and finally test their skills with timed quizzes to climb the leaderboard.

---

## Tech Stack

* **Frontend:** React + Vite
* **Backend:** Node.js + Express
* **Database:** PostgreSQL + Prisma ORM
* **Containerization:** Docker & Docker Compose

---

## Features

* Learn with Flashcards.
* Practice with visual exercises and unlock the next level.
* Community forum for users to share tips and ask questions.
* JWT-based authentication with session management via HTTP-only cookies.

---

## Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/en/) (version X or higher)
* [Docker](https://www.docker.com/get-started) & Docker Compose (if using containerization)
* PostgreSQL (if running locally without Docker)

---

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/nathanielalex/linkasa-main.git
   cd linkasa-main
   ```

2. Setup environment variables:

   Create `.env` files in both `/backend` and `/frontend` (or wherever needed). See the [Environment Variables](#environment-variables) section for details.

3. Install dependencies:

   **Backend:**

   ```bash
   cd linkasa-backend
   npm install
   ```

   **Frontend:**

   ```bash
   cd ../linkasa-frontend
   npm install
   ```

---

### Running the App

#### Running Locally (without Docker)

* Start the backend server:

  ```bash
  cd linkasa-backend
  npm run dev
  ```

* Start the frontend server:

  ```bash
  cd ../linkasa-frontend
  npm run dev
  ```

* Your app should be running on `http://localhost:5173` (or whatever port you use).

#### Running with Docker

* Build and run containers:

  ```bash
  docker-compose up --build
  ```

* This will start the backend, frontend, and PostgreSQL containers.

---

## Database

### Prisma Setup

* Migrate the database schema:

  ```bash
  cd linkasa-backend
  npx prisma migrate dev --name init
  ```

* Generate Prisma client:

  ```bash
  npx prisma generate
  ```

---

## Docker

* `docker-compose.yml` is configured to spin up the frontend, backend, and PostgreSQL database.

* Make sure your environment variables for database connection in Docker containers are set properly.

---

## Environment Variables

### Backend (`linkasa-backend/.env`)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname?schema=public
PORT=4000
JWT_SECRET=your_jwt_secret
```

### Frontend (`linkasa-frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
VITE_IMG_URL=http://localhost:5000
```

---

## Scripts

### Backend

| Script          | Description                                       |
| --------------- | ------------------------------------------------- |
| `npm run dev`   | Start backend in development mode with hot reload |
| `npm run build` | Build backend for production                      |
| `npm start`     | Run production server                             |
| `npm run seed`  | Seed database                                     |

### Frontend

| Script            | Description                               |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Start frontend in development mode (Vite) |
| `npm run build`   | Build frontend for production             |
| `npm run preview` | Preview production build locally          |

---
