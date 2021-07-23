# Dependencies Image
FROM node:12.16-alpine AS dependencies

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Builder Image
FROM dependencies AS builder
WORKDIR /usr/src/app

COPY . .

# prune uneeded dependencies inside node_modules
RUN npm install --production

# Main Image
FROM node:12.16-alpine
WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY --from=builder /usr/src/app/node_modules node_modules
COPY --from=builder /usr/src/app/src ./src
COPY --from=builder /usr/src/app/package.json ./

EXPOSE 4000

CMD ["node", "src/index.js"]
