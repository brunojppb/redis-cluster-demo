FROM node:24-slim as build

RUN mkdir -p /app
WORKDIR /app
COPY . /app

# Install all dependencies
RUN npm install
