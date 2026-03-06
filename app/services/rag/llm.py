import os
from groq import Groq
from app.core.config import settings

def get_client():
    if settings.GROQ_API_KEY:
        return ("groq", Groq(api_key=settings.GROQ_API_KEY))
    elif settings.OPENAI_API_KEY:
        from openai import OpenAI
        return ("openai", OpenAI(api_key=settings.OPENAI_API_KEY))
    else:
        return (None, None)

def generate_answer(question: str, docs: list[dict], user_name: str = "Friend") -> str:
    provider, client = get_client()

    if not client:
        return "Please configure either GROQ_API_KEY or OPENAI_API_KEY in your .env file."

    # Immediate handling for productivity/off-topic questions
    productivity_triggers = ["weather", "sports", "score", "gossip", "news", "movie", "song", "joke", "tell me a story"]
    is_off_topic = any(t in question.lower() for t in productivity_triggers)

    if is_off_topic:
        return f"Hi {user_name}! Intellidocs is an application created precisely for high-level productivity. I am here to help you focus on your documents and efficiency, rather than general queries like weather or news. Let's redirect our focus to your work!"

    context = ""
    if docs:
        context = "\n\n".join([f"Source: {d['filename']}\nContent: {d['content']}" for d in docs])

    prompt = f"""You are 'Intellidocs AI', a world-class Productivity Assistant. 

CORE IDENTITY:
- You help users master their documents and workflows.
- You are intelligent, direct, and slightly sophisticated in your speech.
- If documents are provided, you MUST use them and cite them.
- If NO documents are provided, you can still chat generally, but focus on productivity, planning, and knowledge.
- If a user asks about something completely unrelated (like the weather) even if not caught by my triggers, remind them: "Intellidocs is a space for deep work and high-level productivity. I'm here to help you crack your documents, not check the weather."

STRICT DATA RULES:
1. When docs are provided, never hallucinate outside info.
2. When docs are NOT provided, be a helpful LLM but don't pretend you have context you don't.
3. Be friendly but professional. Use the user's name: {user_name} where appropriate.

=== DATA_CONTEXT (If any) ===
{context}

=== USER_COMMAND ===
{question}
"""

    try:
        if provider == "groq":
            response = client.chat.completions.create(
                model="llama-3.1-8b-instant",  # Updated from decommissioned llama3-8b-8192
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1,
                max_tokens=800,
            )
        else:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1,
                max_tokens=600,
            )
            
        return response.choices[0].message.content.strip()
    except Exception as e:
        err_msg = str(e).lower()
        if "api_key" in err_msg or "unauthorized" in err_msg or "authentication" in err_msg:
            return "The API key seems invalid or unauthorized. Please re-check your GROQ_API_KEY in the .env file."
        elif "quota" in err_msg or "rate_limit" in err_msg:
            return "The AI quota or rate limit has been exceeded. Please try again in a few minutes."
        elif "connection" in err_msg or "timeout" in err_msg:
            return "Connection timeout. Please check your internet or retry."
        
        print("LLM Error Detail:", e)
        return f"AI system error: {str(e)[:100]}... Please check your API configuration."
