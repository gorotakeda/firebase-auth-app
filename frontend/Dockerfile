FROM node:20-alpine

WORKDIR /app

# 依存関係インストール
COPY package*.json ./
RUN npm ci

# ソースコピー
COPY . .

# 開発環境用
EXPOSE 3000
CMD ["npm", "run", "dev"]
