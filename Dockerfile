# Базовый образ Node.js
FROM node:20.17.0-alpine AS build

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json (или yarn.lock) в контейнер
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы проекта в контейнер
COPY . .

# Сборка приложения
RUN npm run build

# Используем nginx для сервировки собранного приложения
FROM nginx:alpine

# Копируем собранные файлы из предыдущего контейнера в nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем файл конфигурации nginx (если нужно)
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Экспонируем порт 80
EXPOSE 80

# Запуск nginx
CMD ["nginx", "-g", "daemon off;"]
