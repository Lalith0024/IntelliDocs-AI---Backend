import os 
import sys
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

# global config 

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "..", "data")

model = SentenceTransformer("all-MiniLM-L6-v2")

# --------------------------------------

# [step 1 load the data and convert it into array of objects where each object contains the content and source]

def load_documents(data_dir):
    documents = []

    for filename in os.listdir(data_dir):
        if filename.endswith(".txt"):
            file_path = os.path.join(data_dir, filename)

            with open(file_path, "r", encoding="utf-8") as file:
                content = file.read().strip()

            document = {
                "content": content,
                "source": filename
            }

            documents.append(document)

    return documents


# ---------------------------------------------------

# step 2: [we are converting the text into numbers usig sentence transormers which is konwn as embedding done by prebuilt transofrmer models]


def embed_documents(documents):
    for doc in documents:
        embedding = model.encode(doc["content"])
        doc["embedding"] = embedding

    return documents


#   ---------------------------------------


# step 3: [we are going to create a vector database using faiss and store the embeddings in it for later retrieval]

def build_faiss_index(documents):
    embeddings = np.array([doc["embedding"] for doc in documents]).astype("float32")

    dimension = embeddings.shape[1]

    index = faiss.IndexFlatL2(dimension)
    index.add(embeddings)

    return index

# NOte: this function converts list of embedings to numpy matrix
        # creates a faiss index and adds the embedings to the index 



# now based on the above functions we will load the documents, embed them and build the faiss index for later retrieval of similar documents based on query embeddings.


def search(index, documents, query, top_k=2):
    query_embedding = model.encode(query)
    query_embedding = np.array([query_embedding]).astype("float32")

    distances, indices = index.search(query_embedding, top_k)

    results = []

    for rank, i in enumerate(indices[0]):
        results.append({
            "source": documents[i]["source"],
            "content": documents[i]["content"],
            "distance": distances[0][rank]
        })

    return results


if __name__ == "__main__":

    documents = load_documents(DATA_DIR)
    documents = embed_documents(documents)
    index = build_faiss_index(documents)

    
    # query = "What color was the car?"
    query = "I love you"

    results = search(index, documents, query, top_k=2)

    THRESHOLD = 1.5  #adjust this later 

    print("\nQuery:", query)
    print("\nTop Results:\n")

    for result in results:

        if result["distance"] > THRESHOLD:
            print("⚠ Low confidence result")
        else:
            print("✓ Relevant result")

        print("SOURCE:", result["source"])
        print("Distance:", result["distance"])
        print("Preview:", result["content"][:100], "...")
        print("-" * 60)









