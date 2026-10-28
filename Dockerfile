FROM node:26-slim as build

RUN mkdir -p /app
WORKDIR /app
COPY . /app

# Install all dependencies
RUN npm install
