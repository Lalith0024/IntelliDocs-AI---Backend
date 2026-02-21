from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

# this is for testing the embedding of a single text
text = "The car was red"
embedding = model.encode(text)


print("Embedding type:", type(embedding))
print("Embedding length:",(embedding))
print("First 5 numbers:", embedding[:5])