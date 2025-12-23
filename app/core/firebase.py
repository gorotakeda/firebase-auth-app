import firebase_admin
from firebase_admin import auth, credentials
from fastapi import HTTPException, Request
from functools import lru_cache


@lru_cache
def initialize_firebase():
    """Firebase Admin SDKを初期化"""
    if not firebase_admin._apps:
        cred = credentials.Certificate("/app/fir-auth-app-5db66-firebase-adminsdk-fbsvc-d0e970d08c.json")
        firebase_admin.initialize_app(cred)
    return firebase_admin.get_app()


def verify_token(id_token: str) -> dict:
    """Firebaseトークンを検証してユーザー情報を返す"""
    initialize_firebase()
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except auth.InvalidIdTokenError:
        raise HTTPException(status_code=401, detail="無効なトークンです")
    except auth.ExpiredIdTokenError:
        raise HTTPException(status_code=401, detail="トークンの有効期限が切れています")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"認証エラー: {str(e)}")


def get_current_user_from_cookie(request: Request) -> dict | None:
    """Cookieからトークンを取得してユーザー情報を返す"""
    token = request.cookies.get("firebase_token")
    if not token:
        return None
    try:
        return verify_token(token)
    except HTTPException:
        return None