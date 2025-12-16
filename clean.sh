#!/bin/sh

docker compose down
docker volume rm matcha_pgdata
rm -rf node_modules package-lock.json packages/front/node_modules packages/api/node_modules

