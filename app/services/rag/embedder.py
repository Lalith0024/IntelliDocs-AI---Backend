from fastembed import TextEmbedding

# Initialize embedding model (runs locally)
# Using the recommended default model that balances speed and quality
_embedding_model = TextEmbedding("BAAI/bge-small-en-v1.5") 

def embed_text(text: str) -> list[float]:
    """Generate embedding for a single string."""
    # List generator, we get the first one
    embeddings = list(_embedding_model.embed([text]))
    return embeddings[0].tolist()

def embed_texts(texts: list[str]) -> list[list[float]]:
    """Generate embeddings for multiple strings."""
    embeddings = list(_embedding_model.embed(texts))
    return [e.tolist() for e in embeddings]
