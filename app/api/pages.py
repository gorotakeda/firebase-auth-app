from fastapi import APIRouter, Request, Depends
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import User
from app.core.firebase import get_current_user_from_cookie
from app.core.config import get_settings

router = APIRouter()
templates = Jinja2Templates(directory="app/templates")


@router.get("/", response_class=HTMLResponse)
async def home(request: Request):
    """ホームページ（ログインフォーム）"""
    user = get_current_user_from_cookie(request)
    if user:
        return RedirectResponse(url="/dashboard", status_code=302)

    settings = get_settings()
    return templates.TemplateResponse(
        "login.html",
        {
            "request": request,
            "firebase_api_key": settings.firebase_api_key,
        }
    )


@router.get("/dashboard", response_class=HTMLResponse)
async def dashboard(request: Request, db: Session = Depends(get_db)):
    """ダッシュボード（認証済みユーザー向け）"""
    firebase_user = get_current_user_from_cookie(request)
    if not firebase_user:
        return RedirectResponse(url="/", status_code=302)

    user = db.query(User).filter(User.id == firebase_user["uid"]).first()
    if not user:
        return RedirectResponse(url="/", status_code=302)

    return templates.TemplateResponse(
        "dashboard.html",
        {
            "request": request,
            "user": user,
        }
    )