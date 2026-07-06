# 🩸 LifeLink - Blood Donation Coordination Platform

LifeLink is a full-stack web application that connects blood donors and hospitals through a role-based platform. Hospitals can create blood requests, while eligible donors can accept and complete them in real time.

---

## Live Demo

Frontend: https://lifelink-kfsz.onrender.com

Backend API: https://lifelink44.vercel.app/

---

## Features

### Authentication
- JWT Authentication (SimpleJWT)
- Role-Based Access Control (Donor / Hospital)

### Blood Request Management
- Hospitals create blood requests
- Donors view matching requests
- Accept requests
- Mark requests as completed

### Backend
- Django REST Framework
- PostgreSQL (Neon)
- Django Signals
- RESTful API

### Frontend
- React (Vite)
- Tailwind CSS
- React Router

### Deployment
- Dockerized Backend
- Dockerized Frontend
- Docker Compose
- Environment Variable Configuration

---

## Tech Stack

### Backend
- Django
- Django REST Framework
- PostgreSQL (Neon)
- Gunicorn
- SimpleJWT

### Frontend
- React
- Vite
- Tailwind CSS

### DevOps
- Docker
- Docker Compose

---

## Project Structure

```text
LifeLink/
│
├── backend/
│   ├── users/
│   ├── donors/
│   ├── hospitals/
│   ├── blood_requests/
│   ├── Dockerfile
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   └── ...
│
├── docker-compose.yml
├── docker-compose.dev.yml
└── README.md
```

---

## Architecture

```
Browser
      │
      ▼
React (Docker)
      │
      ▼
Django REST API (Docker)
      │
      ▼
Neon PostgreSQL
```

---

## Run Locally (Docker)

### Development

```bash
docker compose -f docker-compose.dev.yml up --build
```

This starts:

- React (Vite)
- Django Development Server

with hot reload enabled.

### Production

```bash
docker compose up --build
```

This starts the application using the production configuration.

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/users/register/ | POST | Register User |
| /api/users/login/ | POST | Login |
| /api/requests/create/ | POST | Create Blood Request |
| /api/requests/list/ | GET | List Requests |
| /api/requests/{id}/accept/ | POST | Accept Request |
| /api/requests/{id}/complete/ | POST | Complete Request |

---

## Future Improvements

- Automated Testing
- GitHub Actions (CI/CD)
- Redis Caching
- Logging
- Email Notifications
- Location-Based Matching

---

## Why I Built This

LifeLink was built to simplify coordination between hospitals and blood donors through a secure, role-based platform. The project focuses on REST API design, authentication, Docker-based deployment, and scalable backend architecture.
