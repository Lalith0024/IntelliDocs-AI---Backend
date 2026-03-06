import json
import numpy as np
from sqlalchemy.orm import Session
from app.db.models import DocumentChunk
from app.services.rag.loader import extract_text, chunk_text
from app.services.rag.embedder import embed_texts, embed_text

def cosine_similarity(a, b):
    dot = np.dot(a, b)
    norma = np.linalg.norm(a)
    normb = np.linalg.norm(b)
    if norma == 0 or normb == 0:
        return 0.0
    return dot / (norma * normb)

def add_document_to_index(db: Session, file_path: str, filename: str, document_id: str, user_id: str):
    text = extract_text(file_path)
    if not text:
        return
    
    chunks = chunk_text(text)
    if not chunks:
        return

    embeddings = embed_texts(chunks)
    
    for i in range(len(chunks)):
        chunk_obj = DocumentChunk(
            user_id=user_id,
            document_id=document_id,
            filename=filename,
            chunk_index=str(i),
            content=chunks[i],
            embedding=json.dumps(embeddings[i])
        )
        db.add(chunk_obj)
    db.commit()

def search_documents(db: Session, query: str, user_id: str, top_k: int = 5):
    query_emb = embed_text(query)
    query_np = np.array(query_emb)
    
    chunks = db.query(DocumentChunk).filter(DocumentChunk.user_id == user_id).all()
    
    results = []
    for chunk in chunks:
        emb_np = np.array(json.loads(chunk.embedding))
        score = cosine_similarity(query_np, emb_np)
        
        # Using a balanced threshold for cosine similarity with BAAI/bge-small
        if score > 0.40:
            results.append({
                "content": chunk.content,
                "score": float(score),
                "filename": chunk.filename
            })
            
    # Sort descending by score
    results.sort(key=lambda x: x["score"], reverse=True)
    return results[:top_k]
