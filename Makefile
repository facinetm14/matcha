.PHONY: up down clean run api-setup docker-clean npm-clean

up:
	docker compose up --build

populate-db:
	cd packages/api && npm i && npm run migrate:up && npm run seed

down:
	docker compose down

docker-clean:
	docker compose down -v

npm-clean:
	rm -rf node_modules package-lock.json packages/front/node_modules packages/api/node_modules

clean: docker-clean npm-clean