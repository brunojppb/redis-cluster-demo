FROM node:14 as build

RUN mkdir -p /app
WORKDIR /app
COPY . /app

# Install all dependencies
RUN npm install
