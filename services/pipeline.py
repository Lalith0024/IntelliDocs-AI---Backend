import os
import time
from services.loader import load_documents
from services.embedder import embed_documents, embed_query
from services.retriever import Retriever
from services.llm import build_prompt, generate_answer


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "..", "data")

# Low threshold for small corpus — we rely on the LLM to determine relevance
# MiniLM-L6-v2 returns cosine sim 0.2-0.6 for related short docs
SIMILARITY_THRESHOLD = 0.10

# Initialize once at startup
documents = load_documents(DATA_DIR)
documents = embed_documents(documents)
retriever = Retriever(documents)


def calculate_confidence(score):
    """
    Confidence calibrated for all-MiniLM-L6-v2 cosine similarity scores.
    Score ranges observed in this corpus:
      - Strong match: 0.45+ (e.g. vehicle color query → police log)
      - Good match: 0.30-0.45 (e.g. officer arrival → police log)
      - Weak match: 0.20-0.30 (loosely related)
      - No match: < 0.20
    """
    if score >= 0.45:
        return "high"
    elif score >= 0.30:
        return "medium"
    else:
        return "low"


def run_pipeline(question: str):

    start_time = time.time()

    query_embedding = embed_query(question)
    # Search ALL documents in this small corpus
    results = retriever.search(query_embedding, top_k=len(documents))

    retrieval_time_ms = round((time.time() - start_time) * 1000, 2)

    retrieved_documents = []
    valid_docs = []

    for r in results:
        passed = r["score"] >= SIMILARITY_THRESHOLD
        doc_confidence = calculate_confidence(r["score"])

        retrieved_documents.append({
            "filename": r["source"],
            "score": round(r["score"], 4),
            "passed_threshold": passed,
            "confidence": doc_confidence,
            "content": r["content"]
        })

        if passed:
            valid_docs.append(r)

    retrieval_count = len(results)
    valid_count = len(valid_docs)

    if valid_count == 0:
        return {
            "success": False,
            "question": question,
            "answer": "This question is not related to the provided documents.",
            "confidence": "low",
            "similarity_threshold": SIMILARITY_THRESHOLD,
            "retrieval_time_ms": retrieval_time_ms,
            "retrieval_count": retrieval_count,
            "valid_count": valid_count,
            "retrieved_documents": retrieved_documents
        }

    # Compute average similarity for overall confidence
    avg_score = sum([r["score"] for r in valid_docs]) / valid_count
    confidence = calculate_confidence(avg_score)

    prompt = build_prompt(question, valid_docs)
    answer = generate_answer(prompt)

    return {
        "success": True,
        "question": question,
        "answer": answer,
        "confidence": confidence,
        "similarity_threshold": SIMILARITY_THRESHOLD,
        "retrieval_time_ms": retrieval_time_ms,
        "retrieval_count": retrieval_count,
        "valid_count": valid_count,
        "retrieved_documents": retrieved_documents
    }
