# 💚 Matcha
 
A full-stack dating web application where users can register, build a profile, browse matches, like/dislike other users, chat in real-time, and get notified of interactions — all from a clean, modern interface.
 
---

## Follow a chat message

When someone sends a message, the API looks up the match channel and checks whether the sender is one of its two members. An unknown channel or a different sender returns before anything is stored. For a valid sender, the use case saves the message and identifies the other member for notification. Read the [send-message use case](packages/api/src/modules/notifications/application/usecases/send-message.usecase.ts), then follow delivery into the [Socket.IO adapter](packages/api/src/modules/notifications/infrastructure/adapters/socket-io-realtime-notification.service.ts).

Facinet’s [architecture refactor](https://github.com/facinetm14/matcha/commit/fb5534fc374eb59debbfb1f3e3caebdfec0ac115) touched this use case. This is a team project by fakouyat and nfauconn, credited in the [workspace manifest](package.json).

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
   cp packages/api/.env_example packages/api/.env
   cp packages/front/env_example packages/front/.env
   # Fill in DB credentials, JWT secrets, mail settings, etc.
   ```
 
3. **Seed the database** *(first time only)*
   ```bash
   docker compose up -d db
   # Once PostgreSQL is accepting connections:
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
