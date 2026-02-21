import numpy as np

class Retriever:

    def __init__(self, documents):
        self.documents = documents
        self.embeddings = self._build_embeddings()

    def _build_embeddings(self):
        # Convert list of embeddings to a matrix for fast computation
        embeddings = np.array(
            [doc["embedding"] for doc in self.documents]
        ).astype("float32")
        
        # Normalize for cosine similarity (equivalent to dot product after normalization)
        norms = np.linalg.norm(embeddings, axis=1, keepdims=True)
        return embeddings / (norms + 1e-10)

    def search(self, query_embedding, top_k=2):
        # Normalize query embedding
        query_embedding = np.array(query_embedding).astype("float32")
        query_norm = np.linalg.norm(query_embedding)
        if query_norm > 0:
            query_embedding /= query_norm

        # Compute cosine similarities via dot product
        similarities = np.dot(self.embeddings, query_embedding)

        # Get top-k indices
        top_k = min(top_k, len(self.documents))
        indices = np.argsort(similarities)[::-1][:top_k]

        results = []
        for i in indices:
            results.append({
                "source": self.documents[i]["source"],
                "content": self.documents[i]["content"],
                "score": float(similarities[i])
            })

        return results

