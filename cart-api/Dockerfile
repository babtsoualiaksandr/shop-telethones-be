FROM node:12-alpine AS base

# создание директории приложения
WORKDIR /app

# установка зависимостей
# символ астериск ("*") используется для того чтобы по возможности 
# скопировать оба файла: package.json и package-lock.json
COPY package*.json ./

RUN npm install

WORKDIR /app
COPY . .
RUN npm run build
# Если вы создаете сборку для продакшн
# RUN npm ci --only=production
FROM node:12-alpine AS application
COPY --from=base /app/package*.json ./
RUN npm install --only=production
RUN npm install pm2 -g
COPY --from=base /app/dist ./dist

# копируем исходный код
USER node
ENV PORT=4000

EXPOSE 4000
CMD [ "pm2-runtime", "dist/main.js" ]
