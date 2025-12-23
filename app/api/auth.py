from fastapi import APIRouter, Depends, Request, Response, Form
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.database import get_db
from app.db.models import User
from app.core.firebase import verify_token, get_current_user_from_cookie

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login")
async def login(
    response: Response,
    id_token: str = Form(...),
    db: Session = Depends(get_db),
):
    """ログイン処理: Firebaseトークンを検証してユーザー情報を保存"""
    # トークン検証
    firebase_user = verify_token(id_token)

    # ユーザー情報をDBに保存/更新
    user = db.query(User).filter(User.id == firebase_user["uid"]).first()

    if user:
        # 既存ユーザーの更新
        user.last_login_at = func.now()
        user.display_name = firebase_user.get("name")
        user.photo_url = firebase_user.get("picture")
    else:
        # 新規ユーザーの作成
        user = User(
            id=firebase_user["uid"],
            email=firebase_user.get("email", ""),
            display_name=firebase_user.get("name"),
            photo_url=firebase_user.get("picture"),
            last_login_at=func.now(),
        )
        db.add(user)

    db.commit()

    # Cookieにトークンを保存
    response.set_cookie(
        key="firebase_token",
        value=id_token,
        httponly=True,
        secure=False,  # 本番環境ではTrueに
        samesite="lax",
        max_age=3600,  # 1時間
    )

    # HTMXレスポンス: ダッシュボードにリダイレクト
    response.headers["HX-Redirect"] = "/dashboard"
    return {"status": "success", "message": "ログインしました"}


@router.post("/logout")
async def logout(response: Response):
    """ログアウト処理: Cookieを削除"""
    response.delete_cookie("firebase_token")
    response.headers["HX-Redirect"] = "/"
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