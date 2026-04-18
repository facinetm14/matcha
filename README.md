# 💚 Matcha
 
A full-stack dating web application where users can register, build a profile, browse matches, like/dislike other users, chat in real-time, and get notified of interactions — all from a clean, modern interface.
 
---

## Stack
 
| Layer | Technology |
|---|---|
| **Frontend** | React + TypeScript, Vite |
| **Backend** | Node.js + TypeScript, Express |
| **Database** | PostgreSQL 13 |
| **Cache / Real-time** | Redis 7 |
| **Containerization** | Docker + Docker Compose |
| **Monorepo** | npm workspaces (`packages/front`, `packages/api`, `packages/shared`) |
| **Code Quality** | ESLint, Prettier, Husky |

 ## Setup
 
**Prerequisites:** Docker, Docker Compose, Node.js 20+, `make`
 
1. **Clone the repo**
   ```bash
   git clone https://github.com/facinetm14/matcha.git
   cd matcha
   ```
 
2. **Configure environment variables**
   ```bash
   cp packages/api/.env.example packages/api/.env
   cp packages/front/.env.example packages/front/.env
   # Fill in DB credentials, JWT secrets, mail settings, etc.
   ```
 
3. **Seed the database** *(first time only)*
   ```bash
   make populate-db
   ```
 
---

## Run
 
```bash
# Start all services (frontend, backend, postgres, redis)
make up
 
# Stop all services
make down
 
# Full reset (volumes + node_modules)
make clean
```
