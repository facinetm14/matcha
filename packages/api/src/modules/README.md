# API module discovery map

This folder is the backend boundary map.

## How to discover the system quickly

1. Open `module-registry.ts` to see all active modules and their load order.
2. Open each `<module>/module.ts` file to find route prefix and entry adapter.
3. Navigate from router -> controller -> use case -> outbound ports -> adapters.

## Current active modules

- `auth`: authentication, registration, session lifecycle
- `users`: profile, discovery, interactions, media metadata
- `notifications`: chat channels and notification flows

## Incremental hexagonal target

For each module, organize code by these boundaries:

- `domain/`: entities and pure business rules
- `application/`: use cases and port interfaces
- `infrastructure/`: adapter implementations (db, cache, email, external APIs)
- `interface/`: inbound adapters (http, socket, event handlers)

## Contract for new modules

- Add `<module>/module.ts` with a `ApiModuleDescriptor` export.
- Register it in `module-registry.ts`.
- Keep route mounting and module concerns inside module boundaries.
- Do not import infrastructure adapters directly from controllers.
