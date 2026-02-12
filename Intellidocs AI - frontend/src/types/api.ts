export interface Source {
  filename: string;
  score: number;
  passed_threshold: boolean;
  confidence: 'high' | 'medium' | 'low';
  content: string;
}

export interface QueryRequest {
  question: string;
}

export interface QueryResponse {
  success: boolean;
  question: string;
  answer: string;
  confidence: 'high' | 'medium' | 'low';
  similarity_threshold: number;
  retrieval_time_ms: number;
  retrieval_count: number;
  valid_count: number;
  retrieved_documents: Source[];
}

export interface SearchHistoryItem {
  id: string;
  question: string;
  timestamp: number;
}

export interface DataFile {
  filename: string;
  size_bytes: number;
  line_count: number;
  preview: string;
  type: string;
}

export interface FilesResponse {
  files: DataFile[];
  total: number;
}

export interface FileContentResponse {
  filename: string;
  content: string;
  size_bytes: number;
  line_count: number;
}

export interface StatsResponse {
  total_queries: number;
  avg_latency_ms: number;
  success_rate: number;
  confidence_distribution: {
    high: number;
    medium: number;
    low: number;
  };
  recent_queries: {
    question: string;
    success: boolean;
    confidence: string;
    retrieval_time_ms: number;
    retrieval_count: number;
    valid_count: number;
  }[];
}
