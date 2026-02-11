import sys
import os

# Add project root to Python path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, ".."))
sys.path.append(PROJECT_ROOT)

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from services.pipeline import run_pipeline
from services.loader import load_documents


app = FastAPI(title="Evidence Intelligence API")

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = os.path.join(PROJECT_ROOT, "data")

# In-memory query log for analytics
query_log: list[dict] = []


class QueryRequest(BaseModel):
    question: str


@app.post("/api/query")
def query_endpoint(request: QueryRequest):
    result = run_pipeline(request.question)

    # Log the query for analytics
    query_log.append({
        "question": request.question,
        "success": result["success"],
        "confidence": result["confidence"],
        "retrieval_time_ms": result["retrieval_time_ms"],
        "retrieval_count": result["retrieval_count"],
        "valid_count": result["valid_count"],
    })

    return result


@app.get("/api/files")
def list_files():
    """List all .txt source files in the data directory with metadata."""
    files = []
    for filename in sorted(os.listdir(DATA_DIR)):
        if filename.endswith(".txt"):
            filepath = os.path.join(DATA_DIR, filename)
            stat = os.stat(filepath)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            files.append({
                "filename": filename,
                "size_bytes": stat.st_size,
                "line_count": content.count("\n") + 1,
                "preview": content[:200].strip(),
                "type": "TXT",
            })
    return {"files": files, "total": len(files)}


@app.get("/api/files/{filename}")
def get_file_content(filename: str):
    """Return the full content of a specific .txt source file."""
    # Security: only allow .txt files in data dir
    if not filename.endswith(".txt"):
        raise HTTPException(status_code=400, detail="Only .txt files are supported")

    filepath = os.path.join(DATA_DIR, filename)

    if not os.path.isfile(filepath):
        raise HTTPException(status_code=404, detail=f"File '{filename}' not found")

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    stat = os.stat(filepath)
    return {
        "filename": filename,
        "content": content,
        "size_bytes": stat.st_size,
        "line_count": content.count("\n") + 1,
    }


@app.get("/api/stats")
def get_stats():
    """Return query analytics from the in-memory log."""
    total_queries = len(query_log)

    if total_queries == 0:
        return {
            "total_queries": 0,
            "avg_latency_ms": 0,
            "success_rate": 0,
            "confidence_distribution": {"high": 0, "medium": 0, "low": 0},
            "recent_queries": [],
        }

    avg_latency = round(
        sum(q["retrieval_time_ms"] for q in query_log) / total_queries, 2
    )
    success_count = sum(1 for q in query_log if q["success"])
    success_rate = round((success_count / total_queries) * 100, 1)

    confidence_dist = {"high": 0, "medium": 0, "low": 0}
    for q in query_log:
        confidence_dist[q["confidence"]] = confidence_dist.get(q["confidence"], 0) + 1

    return {
        "total_queries": total_queries,
        "avg_latency_ms": avg_latency,
        "success_rate": success_rate,
        "confidence_distribution": confidence_dist,
        "recent_queries": query_log[-10:][::-1],  # Last 10, newest first
    }
