from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from database import init_db, get_connection
import sqlite3

app = FastAPI()

# Init DB on startup
@app.on_event("startup")
def startup():
    init_db()

# --- Models ---
class IdeaIn(BaseModel):
    text: str

class ExpansionIn(BaseModel):
    expansion_output: str

# --- Routes ---
@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/idea")
def save_idea(idea: IdeaIn):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO ideas (text) VALUES (?)", (idea.text,))
        conn.commit()
        idea_id = cursor.lastrowid
        conn.close()
        return {"id": idea_id, "text": idea.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/ideas")
def get_ideas():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM ideas ORDER BY created_at DESC")
        rows = cursor.fetchall()
        conn.close()
        return [dict(row) for row in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/idea/{idea_id}/expansion")
def save_expansion(idea_id: int, expansion: ExpansionIn):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE ideas SET expansion_output = ? WHERE id = ?",
            (expansion.expansion_output, idea_id)
        )
        conn.commit()
        conn.close()
        return {"id": idea_id, "saved": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Serve frontend — must be last
app.mount("/", StaticFiles(directory="static", html=True), name="static")
