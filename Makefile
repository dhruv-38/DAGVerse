# Makefile

.PHONY: all pull-images up down restart

all: pull-images up

pull-images:
	@echo "Pulling Docker images for Node.js, Python, and Solidity..."
	chmod +x docker_pull_images.sh
	./docker_pull_images.sh

up:
	@echo "Starting MongoDB and Mongo Express with Docker Compose..."
	docker compose -f ./mongodb-docker-setup/docker-compose.yml up -d 

down:
	@echo "Stopping and removing MongoDB and Mongo Express containers..."
	docker compose -f ./mongodb-docker-setup/docker-compose.yml down

restart: down up
	@echo "Restarted MongoDB and Mongo Express containers."

