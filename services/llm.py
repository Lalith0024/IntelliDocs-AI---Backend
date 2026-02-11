import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

def build_prompt(question, documents):

    documents_text = ""

    for doc in documents:
        documents_text += f"\nSOURCE: {doc['source']}\n"
        documents_text += f"CONTENT: {doc['content']}\n"

    return f"""
You are an evidence-based AI assistant.

You MUST answer the question using ONLY the information provided in the documents below.

If the answer cannot be found in the documents, respond exactly with:
"Information not found in provided evidence."

When answering, cite the source filenames explicitly.

Question:
{question}

Documents:
{documents_text}

Answer:
"""

def generate_answer(prompt):
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
        max_tokens=800
    )

    return response.choices[0].message.content
