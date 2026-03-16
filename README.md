# 🩺 HealthTracker — Personal Health Journal

A health tracking platform built with a 3-tier architecture — React frontend, Node.js backend, and PostgreSQL database.

![Tech Stack](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Tech Stack](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js)
![Tech Stack](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql)

---

> [!IMPORTANT]
> **Looking for deployment instructions?**
> Switch to the [`dev`](../../tree/dev) branch for Docker, Kubernetes (EKS Auto Mode), Terraform, CI/CD with GitHub Actions, container security scanning, and full deployment docs.
>
> ```bash
> git checkout dev
> ```

---

## ✨ Features

- 📋 Log health entries (workouts, meals, symptoms, wellness notes)
- ✏️ Edit your existing entries
- 🗑️ Delete entries
- 💬 Comment on entries
- 🌿 Clean dark UI with green/teal health theme

## 🏗️ Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │────▶│   Backend    │────▶│  PostgreSQL   │
│   (React +   │◀────│  (Node.js +  │◀────│              │
│    Nginx)    │     │   Express)   │     │              │
│   Port 80    │     │  Port 5000   │     │  Port 5432   │
└──────────────┘     └──────────────┘     └──────────────┘
```

## 📁 Project Structure

```
Healthtracker/
├── frontend/          # React (Vite) frontend
├── backend/           # Node.js Express API
└── README.md
```

## 🌿 Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Application source code only |
| `dev`  | Full DevSecOps — Docker, Kubernetes (EKS), Terraform, CI/CD, security scanning, deployment docs |

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/posts` | Get all entries |
| GET | `/api/posts/:id` | Get single entry with comments |
| POST | `/api/posts` | Create a new entry |
| PUT | `/api/posts/:id` | Update an entry |
| DELETE | `/api/posts/:id` | Delete an entry |
| GET | `/api/comments/post/:postId` | Get comments for an entry |
| POST | `/api/comments` | Create a comment |
| DELETE | `/api/comments/:id` | Delete a comment |
