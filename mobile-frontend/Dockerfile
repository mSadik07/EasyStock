FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install -g @expo/ngrok@^4.1.0
COPY . .
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002
CMD ["npx", "expo", "start", "--tunnel"]