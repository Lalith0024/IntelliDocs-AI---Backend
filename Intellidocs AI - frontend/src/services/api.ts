import axios from 'axios';
import type {
  QueryRequest,
  QueryResponse,
  FilesResponse,
  FileContentResponse,
  StatsResponse,
} from '../types/api';

export let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Sanitize: Remove trailing slash and ensure protocol
if (API_URL.endsWith('/')) {
  API_URL = API_URL.slice(0, -1);
}

// Security: Log the active endpoint so user can verify if Vercel baked it in correctly
console.log('📡 Intelligence Engine connected to:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30s timeout for LLM calls
});

export const queryService = {
  /** Send a question to the backend pipeline */
  performQuery: async (params: QueryRequest): Promise<QueryResponse> => {
    const response = await api.post<QueryResponse>('/api/query', params);
    return response.data;
  },
};

export const filesService = {
  /** List all source .txt files from the backend data directory */
  listFiles: async (): Promise<FilesResponse> => {
    const response = await api.get<FilesResponse>('/api/files');
    return response.data;
  },

  /** Get full content of a specific source file */
  getFileContent: async (filename: string): Promise<FileContentResponse> => {
    const response = await api.get<FileContentResponse>(
      `/api/files/${encodeURIComponent(filename)}`
    );
    return response.data;
  },
};

export const statsService = {
  /** Get query analytics / stats */
  getStats: async (): Promise<StatsResponse> => {
    const response = await api.get<StatsResponse>('/api/stats');
    return response.data;
  },
};
