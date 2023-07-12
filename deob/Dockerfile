FROM node:18

RUN mkdir -p /app
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 50001

CMD ["node", "app.js", "server"]
