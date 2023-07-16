FROM --platform=linux/amd64 amd64/node:18-slim

RUN mkdir -p /app
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

CMD ["node", "app.js", "server"]
