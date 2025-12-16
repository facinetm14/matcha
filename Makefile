.PHONY: up down populate-db docker-clean npm-clean clean 

up:
	docker compose up --build

down:
	docker compose down

populate-db:
	cd packages/api && npm i && npm run migrate:up && npm run seed

docker-clean:
	docker compose down -v

npm-clean:
	rm -rf node_modules package-lock.json packages/front/node_modules packages/api/node_modules

clean: docker-clean npm-clean