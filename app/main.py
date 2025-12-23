import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.api import auth
from app.db.database import engine, Base


@asynccontextmanager
async def lifespan(app: FastAPI):
    # 起動時: テーブル作成
    Base.metadata.create_all(bind=engine)
    yield
    # 終了時の処理（必要に応じて追加）


app = FastAPI(
    title="Firebase Auth App",
    description="Firebase認証を使用したログイン/ログアウトアプリ",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        os.getenv("FRONTEND_URL", "http://localhost:3000"),
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ルーター登録
app.include_router(auth.router)