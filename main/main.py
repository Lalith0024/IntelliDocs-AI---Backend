import sys
import os

# Add project root to Python path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, ".."))
sys.path.append(PROJECT_ROOT)

from fastapi import FastAPI
from pydantic import BaseModel
from services.pipeline import run_pipeline


app = FastAPI(title="Evidence Intelligence API")


class QueryRequest(BaseModel):
    question: str


@app.post("/api/query")
def query_endpoint(request: QueryRequest):
    return run_pipeline(request.question)
