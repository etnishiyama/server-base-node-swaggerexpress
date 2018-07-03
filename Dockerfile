FROM node:5.11.0-slim

# Create app directory
WORKDIR mobqi

# Install app dependencies
# COPY package.json .
# For npm@5 or later, copy package-lock.json as well
COPY package.json package-lock.json ./

RUN npm install && npm ls

COPY . /mobqi

# Bundle app source
WORKDIR /mobqi
# EXPOSE 8080

