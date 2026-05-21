"""
CMS API — авторизация, контент, услуги, портфолио, заявки.
Все операции для админ-панели и публичного сайта.
"""
import json
import os
import hashlib
import secrets
import psycopg2
from datetime import datetime

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "t_p29052039_signage_website_proj")

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id, X-Admin-Token",
}

# Простое хранилище сессий в памяти (достаточно для одного экземпляра)
_sessions: dict[str, str] = {}


def resp(status: int, body: dict) -> dict:
    return {"statusCode": status, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps(body, ensure_ascii=False, default=str)}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def hash_pwd(pwd: str) -> str:
    return hashlib.sha256(pwd.encode()).hexdigest()


def check_auth(event: dict) -> bool:
    token = event.get("headers", {}).get("X-Admin-Token", "")
    return token in _sessions.values()


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    path = event.get("path", "/")
    body = {}
    if event.get("body"):
        try:
            body = json.loads(event["body"])
        except Exception:
            pass

    # ── AUTH ──────────────────────────────────────────────
    if path == "/login" and method == "POST":
        username = body.get("username", "")
        password = body.get("password", "")
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"SELECT id FROM {SCHEMA}.admins WHERE login=%s AND pwd_hash=%s", (username, hash_pwd(password)))
        row = cur.fetchone()
        conn.close()
        if not row:
            return resp(401, {"error": "Неверный логин или пароль"})
        token = secrets.token_hex(32)
        _sessions[username] = token
        return resp(200, {"token": token})

    if path == "/logout" and method == "POST":
        token = event.get("headers", {}).get("X-Admin-Token", "")
        _sessions = {k: v for k, v in _sessions.items() if v != token}
        return resp(200, {"ok": True})

    # ── SET PASSWORD (первый запуск) ──────────────────────
    if path == "/set-password" and method == "POST":
        username = body.get("username", "")
        new_pwd = body.get("password", "")
        secret_key = body.get("secret_key", "")
        if secret_key != os.environ.get("ADMIN_SETUP_KEY", ""):
            return resp(403, {"error": "Нет доступа"})
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"UPDATE {SCHEMA}.admins SET pwd_hash=%s WHERE login=%s", (hash_pwd(new_pwd), username))
        conn.commit()
        conn.close()
        return resp(200, {"ok": True})

    # Все остальные маршруты требуют авторизации
    if not check_auth(event):
        # Публичные GET-маршруты
        if method == "GET" and path in ("/content", "/services", "/portfolio"):
            pass  # разрешаем
        elif method == "POST" and path == "/orders":
            pass  # форма заказа публична
        else:
            return resp(401, {"error": "Требуется авторизация"})

    # ── CONTENT ───────────────────────────────────────────
    if path == "/content" and method == "GET":
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"SELECT section, section_key, value FROM {SCHEMA}.site_content ORDER BY section, section_key")
        rows = cur.fetchall()
        conn.close()
        result: dict = {}
        for section, key, value in rows:
            result.setdefault(section, {})[key] = value
        return resp(200, result)

    if path == "/content" and method == "PUT":
        if not check_auth(event):
            return resp(401, {"error": "Требуется авторизация"})
        section = body.get("section")
        key = body.get("key")
        value = body.get("value", "")
        if not section or not key:
            return resp(400, {"error": "Нужны section и key"})
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"INSERT INTO {SCHEMA}.site_content (section, section_key, value) VALUES (%s,%s,%s) "
            f"ON CONFLICT (section, section_key) DO UPDATE SET value=%s, updated_at=NOW()",
            (section, key, value, value)
        )
        conn.commit()
        conn.close()
        return resp(200, {"ok": True})

    # ── SERVICES ──────────────────────────────────────────
    if path == "/services" and method == "GET":
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"SELECT id, num, icon, title, description, is_hot, sort_order FROM {SCHEMA}.services ORDER BY sort_order")
        cols = ["id", "num", "icon", "title", "description", "is_hot", "sort_order"]
        rows = [dict(zip(cols, r)) for r in cur.fetchall()]
        conn.close()
        return resp(200, rows)

    if path == "/services" and method == "POST":
        if not check_auth(event):
            return resp(401, {"error": "Требуется авторизация"})
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"INSERT INTO {SCHEMA}.services (num,icon,title,description,is_hot,sort_order) VALUES (%s,%s,%s,%s,%s,%s) RETURNING id",
            (body.get("num",""), body.get("icon","Star"), body.get("title",""), body.get("description",""), body.get("is_hot", False), body.get("sort_order",99))
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        conn.close()
        return resp(201, {"id": new_id})

    if path.startswith("/services/") and method == "PUT":
        if not check_auth(event):
            return resp(401, {"error": "Требуется авторизация"})
        sid = path.split("/")[-1]
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"UPDATE {SCHEMA}.services SET num=%s,icon=%s,title=%s,description=%s,is_hot=%s,sort_order=%s WHERE id=%s",
            (body.get("num",""), body.get("icon","Star"), body.get("title",""), body.get("description",""), body.get("is_hot",False), body.get("sort_order",99), sid)
        )
        conn.commit()
        conn.close()
        return resp(200, {"ok": True})

    if path.startswith("/services/") and method == "DELETE":
        if not check_auth(event):
            return resp(401, {"error": "Требуется авторизация"})
        sid = path.split("/")[-1]
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"DELETE FROM {SCHEMA}.services WHERE id=%s", (sid,))
        conn.commit()
        conn.close()
        return resp(200, {"ok": True})

    # ── PORTFOLIO ─────────────────────────────────────────
    if path == "/portfolio" and method == "GET":
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"SELECT id, title, tag, year, image_url, sort_order FROM {SCHEMA}.portfolio ORDER BY sort_order")
        cols = ["id", "title", "tag", "year", "image_url", "sort_order"]
        rows = [dict(zip(cols, r)) for r in cur.fetchall()]
        conn.close()
        return resp(200, rows)

    if path == "/portfolio" and method == "POST":
        if not check_auth(event):
            return resp(401, {"error": "Требуется авторизация"})
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"INSERT INTO {SCHEMA}.portfolio (title,tag,year,image_url,sort_order) VALUES (%s,%s,%s,%s,%s) RETURNING id",
            (body.get("title",""), body.get("tag",""), body.get("year",""), body.get("image_url",""), body.get("sort_order",99))
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        conn.close()
        return resp(201, {"id": new_id})

    if path.startswith("/portfolio/") and method == "PUT":
        if not check_auth(event):
            return resp(401, {"error": "Требуется авторизация"})
        pid = path.split("/")[-1]
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"UPDATE {SCHEMA}.portfolio SET title=%s,tag=%s,year=%s,image_url=%s,sort_order=%s WHERE id=%s",
            (body.get("title",""), body.get("tag",""), body.get("year",""), body.get("image_url",""), body.get("sort_order",99), pid)
        )
        conn.commit()
        conn.close()
        return resp(200, {"ok": True})

    if path.startswith("/portfolio/") and method == "DELETE":
        if not check_auth(event):
            return resp(401, {"error": "Требуется авторизация"})
        pid = path.split("/")[-1]
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"DELETE FROM {SCHEMA}.portfolio WHERE id=%s", (pid,))
        conn.commit()
        conn.close()
        return resp(200, {"ok": True})

    # ── ORDERS ────────────────────────────────────────────
    if path == "/orders" and method == "POST":
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"INSERT INTO {SCHEMA}.orders (name,phone,order_type,description,file_url) VALUES (%s,%s,%s,%s,%s) RETURNING id",
            (body.get("name",""), body.get("phone",""), body.get("type",""), body.get("description",""), body.get("file_url",""))
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        conn.close()
        return resp(201, {"id": new_id, "ok": True})

    if path == "/orders" and method == "GET":
        if not check_auth(event):
            return resp(401, {"error": "Требуется авторизация"})
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"SELECT id, name, phone, order_type, description, file_url, status, created_at FROM {SCHEMA}.orders ORDER BY created_at DESC")
        cols = ["id", "name", "phone", "type", "description", "file_url", "status", "created_at"]
        rows = [dict(zip(cols, r)) for r in cur.fetchall()]
        conn.close()
        return resp(200, rows)

    if path.startswith("/orders/") and method == "PUT":
        if not check_auth(event):
            return resp(401, {"error": "Требуется авторизация"})
        oid = path.split("/")[-1]
        new_status = body.get("status", "new")
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"UPDATE {SCHEMA}.orders SET status=%s WHERE id=%s", (new_status, oid))
        conn.commit()
        conn.close()
        return resp(200, {"ok": True})

    if path.startswith("/orders/") and method == "DELETE":
        if not check_auth(event):
            return resp(401, {"error": "Требуется авторизация"})
        oid = path.split("/")[-1]
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"DELETE FROM {SCHEMA}.orders WHERE id=%s", (oid,))
        conn.commit()
        conn.close()
        return resp(200, {"ok": True})

    return resp(404, {"error": "Маршрут не найден"})
