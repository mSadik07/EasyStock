FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002
CMD ["npx", "expo", "start", "--tunnel"]