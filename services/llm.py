import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

def get_client():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY environment variable is not set")
    return OpenAI(
        api_key=api_key,
        base_url="https://api.groq.com/openai/v1"
    )

def build_prompt(question, documents):
    documents_text = ""
    for doc in documents:
        documents_text += f"\nSOURCE: {doc['source']}\n"
        documents_text += f"CONTENT: {doc['content']}\n"

    return f"""
You are an evidence-based AI assistant. 

Your goal is to provide a clear, professional answer. 
- Use **bold text** for key findings, names, dates, or specific pieces of evidence.
- Use bullet points if there are multiple facts.
- Use ONLY the information provided in the documents below.

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
    client = get_client()
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
        max_tokens=800
    )

    return response.choices[0].message.content

