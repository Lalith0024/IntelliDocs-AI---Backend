import faiss
import numpy as np

class Retriever:

    def __init__(self, documents):
        self.documents = documents
        self.index = self._build_index()

    def _build_index(self):
        embeddings = np.array(
            [doc["embedding"] for doc in self.documents]
        ).astype("float32")

        faiss.normalize_L2(embeddings)

        dimension = embeddings.shape[1]
        index = faiss.IndexFlatIP(dimension)
        index.add(embeddings)

        return index

    def search(self, query_embedding, top_k=2):
        query_embedding = np.array([query_embedding]).astype("float32")
        faiss.normalize_L2(query_embedding)

        scores, indices = self.index.search(query_embedding, top_k)

        results = []

        for rank, i in enumerate(indices[0]):
            results.append({
                "source": self.documents[i]["source"],
                "content": self.documents[i]["content"],
                "score": float(scores[0][rank])
            })

        return results
