FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN mkdir -p logs

EXPOSE 5000

ENV NODE_ENV=development

CMD ["npm", "start"]
