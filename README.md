# Firebase Auth App

Firebase Authenticationを使用したログイン/ログアウト機能を持つWebアプリケーション。

## 技術スタック

### フロントエンド
- **Next.js 16** - Reactフレームワーク
- **TypeScript** - 型安全な開発
- **Tailwind CSS** - ユーティリティファーストCSS
- **Firebase SDK** - クライアント側認証

### バックエンド
- **Python 3.12**
- **FastAPI** - 高速なWebフレームワーク
- **Uvicorn** - ASGIサーバー
- **SQLAlchemy** - ORM
- **Pydantic** - データバリデーション

### データベース
- **PostgreSQL 16** - リレーショナルデータベース

### 認証
- **Firebase Authentication** - メール/パスワード認証

### インフラ
- **Docker** - コンテナ化
- **Docker Compose** - マルチコンテナ管理

## アーキテクチャ

フロントエンドとバックエンドを分離した構成:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │     │   Backend       │     │   Database      │
│   (Next.js)     │────▶│   (FastAPI)     │────▶│   (PostgreSQL)  │
│   :3000         │     │   :8000         │     │   :5432         │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │
         ▼
┌─────────────────┐
│   Firebase      │
│   Auth          │
└─────────────────┘
```

## プロジェクト構成

```
firebase-auth-app/
├── app/                    # バックエンド (FastAPI)
│   ├── api/
│   │   └── auth.py         # 認証API
│   ├── core/
│   │   ├── config.py       # 環境設定
│   │   └── firebase.py     # Firebase初期化
│   ├── db/
│   │   ├── database.py     # DB接続
│   │   └── models.py       # モデル定義
│   ├── main.py             # アプリケーションエントリーポイント
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/               # フロントエンド (Next.js)
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx        # ログインページ
│   │   │   └── dashboard/
│   │   │       └── page.tsx    # ダッシュボード
│   │   ├── components/     # UIコンポーネント
│   │   ├── contexts/       # React Context
│   │   └── lib/            # ユーティリティ
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml
```

## セットアップ

### 必要条件
- Docker / Docker Compose
- Firebaseプロジェクト（認証設定済み）

### 環境変数

`.env`ファイルを作成し、以下を設定:

```env
FIREBASE_API_KEY=your_firebase_api_key
```

### Firebase認証情報

Firebase Admin SDKのサービスアカウントキー（JSONファイル）をプロジェクトルートに配置してください。

### 起動

```bash
docker-compose up --build
```

- フロントエンド: http://localhost:3000
- バックエンドAPI: http://localhost:8000

## 機能

- メール/パスワードでのログイン
- 新規ユーザー登録
- ログイン状態の保持（Cookie）
- ユーザー情報のデータベース保存
- ダッシュボード表示
- ログアウト

## API

| エンドポイント | メソッド | 説明 |
|---------------|---------|------|
| `/auth/login` | POST | ログイン処理 (JSON) |
| `/auth/logout` | POST | ログアウト処理 |
| `/auth/me` | GET | 現在のユーザー情報取得 |
