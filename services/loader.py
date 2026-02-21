import os

def load_documents(data_dir):
    documents = []

    for filename in os.listdir(data_dir):
        if filename.endswith(".txt"):
            file_path = os.path.join(data_dir, filename)

            with open(file_path, "r", encoding="utf-8") as file:
                content = file.read().strip()

            documents.append({
                "content": content,
                "source": filename
            })

    return documents
