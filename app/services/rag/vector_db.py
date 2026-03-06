import os
import chromadb
from app.core.config import settings

CHROMA_DATA_PATH = "data/chroma"

# Persistent Chroma Client
client = chromadb.PersistentClient(path=CHROMA_DATA_PATH)

def get_collection():
    return client.get_or_create_collection(
        name="rag_documents",
        metadata={"hnsw:space": "cosine"}
    )
