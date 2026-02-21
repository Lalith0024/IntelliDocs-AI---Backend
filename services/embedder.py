from fastembed import TextEmbedding

# Load once (singleton-style)
# Fastembed is much lighter than sentence-transformers and uses ONNX runtime
model = TextEmbedding(model_name="BAAI/bge-small-en-v1.5")

def embed_documents(documents):
    # Fastembed's embed method returns an iterator of embeddings
    contents = [doc["content"] for doc in documents]
    embeddings = list(model.embed(contents))
    for i, doc in enumerate(documents):
        doc["embedding"] = embeddings[i]
    return documents

def embed_query(query):
    # model.embed returns an iterator, we take the first one
    return list(model.embed([query]))[0]

