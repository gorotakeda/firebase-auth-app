from fastapi import APIRouter, Depends, Request, Response, Form, Header
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from app.db.database import get_db
from app.db.models import User
from app.core.firebase import verify_token, get_current_user_from_cookie

router = APIRouter(prefix="/auth", tags=["auth"])


class LoginRequest(BaseModel):
    id_token: str


class LoginResponse(BaseModel):
    status: str
    message: str
    redirect_url: str


async def process_login(id_token: str, response: Response, db: Session) -> dict:
    """共通のログイン処理"""
    firebase_user = verify_token(id_token)

    user = db.query(User).filter(User.id == firebase_user["uid"]).first()

    if user:
        user.last_login_at = func.now()
        user.display_name = firebase_user.get("name")
        user.photo_url = firebase_user.get("picture")
    else:
        user = User(
            id=firebase_user["uid"],
            email=firebase_user.get("email", ""),
            display_name=firebase_user.get("name"),
            photo_url=firebase_user.get("picture"),
            last_login_at=func.now(),
        )
        db.add(user)

    db.commit()

    response.set_cookie(
        key="firebase_token",
        value=id_token,
        httponly=True,
        secure=False,  # 本番環境ではTrueに
        samesite="lax",
        max_age=3600,
    )

    return {"status": "success", "message": "ログインしました", "redirect_url": "/dashboard"}


@router.post("/login", response_model=LoginResponse)
async def login_json(
    request: LoginRequest,
    response: Response,
    db: Session = Depends(get_db),
):
    """ログイン処理 (JSON形式) - Next.js用"""
    return await process_login(request.id_token, response, db)


@router.post("/login/form")
async def login_form(
    response: Response,
    id_token: str = Form(...),
    db: Session = Depends(get_db),
):
    """ログイン処理 (Form形式) - HTMX用"""
    result = await process_login(id_token, response, db)
    response.headers["HX-Redirect"] = result["redirect_url"]
    return result


@router.post("/logout")
async def logout(response: Response):
    """ログアウト処理: Cookieを削除"""
    response.delete_cookie("firebase_token")
    return {"status": "success", "message": "ログアウトしました"}


@router.get("/me")
async def get_current_user(request: Request, db: Session = Depends(get_db)):
    """現在のユーザー情報を取得"""
    firebase_user = get_current_user_from_cookie(request)
    if not firebase_user:
        return {"authenticated": False}

    user = db.query(User).filter(User.id == firebase_user["uid"]).first()
    if not user:
        return {"authenticated": False}

    return {
        "authenticated": True,
        "user": {
            "id": user.id,
            "email": user.email,
            "display_name": user.display_name,
            "photo_url": user.photo_url,
        }
    }