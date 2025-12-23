from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from app.api import auth, pages
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

# 静的ファイル
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# ルーター登録
app.include_router(auth.router)
app.include_router(pages.router)