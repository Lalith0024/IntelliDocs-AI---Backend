# Use an official lightweight Python image.
# heavily optimized for minimal size
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file (ensure it's in the build context)
COPY main/requirements.txt .

# Optimize for low memory environments (Render Free Tier)
ENV OMP_NUM_THREADS=1
ENV MKL_NUM_THREADS=1

# Install Python dependencies
# 1. Install CPU-only PyTorch first to save massive space/memory (avoids CUDA)
# 2. Then install the rest
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu && \
    pip install --no-cache-dir -r requirements.txt

# Copy the entire backend codebase
COPY . .

# Pre-download the Sentence Transformer model during build
# This prevents downloading it at runtime (faster startup)
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"

# Expose the port (Render default is 10000)
EXPOSE 10000

# Run the application with uvicorn
# Use 0.0.0.0 for external access in containers
CMD ["uvicorn", "main.main:app", "--host", "0.0.0.0", "--port", "10000"]
