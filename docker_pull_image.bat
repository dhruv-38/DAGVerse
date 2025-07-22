:: pull_docker_images.bat
@echo off

echo Pulling Node.js 18 image...
docker pull node:18

echo Pulling Python 3.11 image...
docker pull python:3.11

echo Pulling Ethereum Solidity (solc) stable image...
docker pull ethereum/solc:stable

echo All images pulled successfully.
pause

echo Setting up mongo db
docker compose -f ./mongodb-docker-setup/docker-compose.yml up -d 

echo Mongodb setup successfully.
pause