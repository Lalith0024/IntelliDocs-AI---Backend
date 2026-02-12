# 🧠 IntelliDocs AI - Intelligent Backend 

Frontend repo : https://github.com/Lalith0024/IntelliDocs-AI---frontend

![Python](https://img.shields.io/badge/Python-3.9-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.95-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![PyTorch](https://img.shields.io/badge/PyTorch-CPU_Optimized-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker&logoColor=white)

This repository hosts the **backend infrastructure** for IntelliDocs AI. It is a high-performance, containerized API service that processes natural language queries, performs vector retrieval on evidence files, and generates AI-synthesized answers using a RAG (Retrieval Augmented Generation) pipeline.

---

## ⚡ Key Technical Highlights

*   **🔍 Semantic Search Engine**: Uses `sentence-transformers/all-MiniLM-L6-v2` to understand the *meaning* of queries, not just keywords.
*   **🧩 Vector Database (FAISS)**: Implements Facebook AI Similarity Search for ultra-fast retrieval of relevant document chunks.
*   **🤖 Generative AI Integration**: Connects to **Groq API (Llama 3)** to synthesize factual answers based strictly on retrieved evidence.
*   **📉 Memory Optimization**: Custom-tuned Docker configuration using **CPU-only PyTorch** to run efficiently within 512MB RAM constraints (perfect for free-tier deployments like Render).
*   **⏱️ Lazy Loading Architecture**: Prevents startup crashes by initializing heavy ML models and API clients only when needed.

---

## 🛠️ Technology Stack

| Component | Technology | Role |
| :--- | :--- | :--- |
| **API Framework** | **FastAPI** | High-speed, async Python web server. |
| **Machine Learning** | **PyTorch (CPU)** | Runs the neural network for text embeddings. |
| **Embeddings** | **Sentence-Transformers** | Converts text evidence into 384-dimensional vectors. |
| **Retrieval** | **FAISS (CPU)** | Finds the most similar vectors to a user's question. |
| **LLM Inference** | **Groq (Llama 3-8b)** | Generates human-like answers with extreme speed. |
| **Deployment** | **Docker + Uvicorn** | Containerized standard for consistent production environments. |

---

## 📂 Project Architecture

A clean, modular structure designed for scalability and maintenance.

```bash
backend/
├── 📄 Dockerfile            # Optimized container config (CPU-only PyTorch)
├── 📄 render.yaml           # Infrastructure-as-Code for Render deployment
├── 📂 main/
│   ├── 🐍 main.py           # API Entry point (FastAPI app)
│   └── 📄 requirements.txt  # Python dependencies
├── 📂 services/             # Core Logic Modules
│   ├── 🐍 pipeline.py       # Orchestrator: Connects Search + LLM
│   ├── 🐍 embedder.py       # Handles text-to-vector conversion
│   ├── 🐍 retriever.py      # FAISS search implementation
│   ├── 🐍 loader.py         # Reads & processes .txt evidence files
│   └── 🐍 llm.py            # Interfaces with Groq/OpenAI API
└── 📂 data/                 # Evidence files storage

## 🚀 Optimization Strategy: The "512MB Challenge"

Deploying modern AI on free-tier infrastructure requires aggressive optimization. Here is how we achieved it:

| Strategy | Implementation Details | Impact |
| :--- | :--- | :--- |
| **CPU-Only PyTorch** | Explicitly installed the CPU-only wheels via [Dockerfile](cci:7://file:///Users/kasulalalithendra/Desktop/Ml_internshipproject/Dockerfile:0:0-0:0) to avoid massive CUDA binaries. | **Reduced RAM usage by ~500MB** |
| **Thread Limiting** | Configured `OMP_NUM_THREADS=1` and `MKL_NUM_THREADS=1`. | Prevents memory fragmentation overhead. |
| **Aggressive GC** | The pipeline triggers `gc.collect()` immediately after building the FAISS index. | Frees ~50MB of temporary tensors instantly. |
| **Lazy Loading** | The retrieval model and LLM client ([llm.py](cci:7://file:///Users/kasulalalithendra/Desktop/Ml_internshipproject/services/llm.py:0:0-0:0)) are initialized only when needed. | Prevents "Out of Memory" crashes at boot time. |

---

## 🔌 API Endpoints

The backend exposes a clean, RESTful API compliant with OpenAPI standards.

### 🧠 1. The Brain (`POST /api/query`)
Accepts a natural language question and returns a synthesized answer.

*   **Input**:
    ```json
    {
      "question": "Who is the suspect?"
    }
    ```
*   **Output**:
    ```json
    {
      "answer": "The suspect is identified as...",
      "confidence": "high",
      "citations": ["police_log.txt", "witness_statement.txt"]
    }
    ```

### 📚 2. The Librarian (`GET /api/files`)
Lists all indexed evidence files with metadata (size, line count).

### 📖 3. The Reader (`GET /api/files/{filename}`)
Streams the raw text content of a specific evidence document.

### 📊 4. The Analyst (`GET /api/stats`)
Returns real-time system performance metrics (latency, success rates) for the dashboard.

---

## 🚢 Deployment Guide (Render)

This repository is **Deploy-Ready** for Render's container runtime.

1.  **Push to GitHub**: Ensure your code is on the `main` branch.
2.  **Create Web Service**: Connect your repo on Render.
3.  **Environment Variables**:
    *   `GROQ_API_KEY`: Your Groq API Key (starts with `gsk_...`).
    *   `PORT`: `10000` (Automatically detected).
4.  **Build & Deploy**: Render will use the [Dockerfile](cci:7://file:///Users/kasulalalithendra/Desktop/Ml_internshipproject/Dockerfile:0:0-0:0) to build the optimized image.

> ⚠️ **Note on Cold Starts**: On free tiers, the service may spin down after 15 minutes of inactivity. The first request might take **~50 seconds** to boot up the Neural Network.