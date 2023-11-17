FROM node:14-alpine

# устанавливаем простой HTTP-сервер для статики
RUN npm config set strict-ssl false
RUN npm install -g http-server --unsafe-perm

# делаем каталог 'app' текущим рабочим каталогом
WORKDIR /app

# копируем оба 'package.json' и 'package-lock.json' (если есть)
COPY package*.json ./

# устанавливаем зависимости проекта
RUN npm install --registry=https://registry.npm.taobao.org

# копируем файлы и каталоги проекта в текущий рабочий каталог (т.е. в каталог 'app')
COPY . .

# собираем приложение для production с минификацией
RUN npx browserslist@latest --update-db
RUN npm run build

EXPOSE 8080
CMD [ "http-server", "dist" ]
