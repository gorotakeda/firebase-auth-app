# Firebase Auth App

Firebase Authenticationを使用したログイン/ログアウト機能を持つWebアプリケーション。

## 技術スタック

### バックエンド
- **Python 3.12**
- **FastAPI** - 高速なWebフレームワーク
- **Uvicorn** - ASGIサーバー
- **SQLAlchemy** - ORM
- **Pydantic** - データバリデーション

### データベース
- **PostgreSQL 16** - リレーショナルデータベース

### 認証
- **Firebase Authentication** - Google認証等のソーシャルログイン

### フロントエンド
- **Jinja2** - テンプレートエンジン
- **HTMX** - 動的なHTML更新

### インフラ
- **Docker** - コンテナ化
- **Docker Compose** - マルチコンテナ管理

## プロジェクト構成

```
firebase-auth-app/
├── app/
│   ├── api/          # APIエンドポイント
│   │   ├── auth.py   # 認証API
│   │   └── pages.py  # ページルーティング
│   ├── core/         # コア設定
│   │   ├── config.py # 環境設定
│   │   └── firebase.py # Firebase初期化
│   ├── db/           # データベース
│   │   ├── database.py # DB接続
│   │   └── models.py # モデル定義
│   ├── static/       # 静的ファイル
│   ├── templates/    # HTMLテンプレート
│   └── main.py       # アプリケーションエントリーポイント
├── docker-compose.yml
├── Dockerfile
└── requirements.txt
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

アプリケーションは http://localhost:8000 で起動します。

## 機能

- Googleアカウントでのログイン
- ログイン状態の保持（Cookie）
- ユーザー情報のデータベース保存
- ダッシュボード表示
- ログアウト

## API

| エンドポイント | メソッド | 説明 |
|---------------|---------|------|
| `/` | GET | ログインページ |
| `/dashboard` | GET | ダッシュボード |
| `/auth/login` | POST | ログイン処理 |
| `/auth/logout` | POST | ログアウト処理 |
| `/auth/me` | GET | 現在のユーザー情報取得 |
