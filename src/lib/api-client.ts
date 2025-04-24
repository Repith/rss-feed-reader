import axios from "axios";
import { Feed } from "../domain/models/Feed";
import { Article } from "../domain/models/Article";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const feedsApi = {
  getAll: async (): Promise<Feed[]> => {
    const response = await api.get("/feeds");
    return response.data;
  },

  getById: async (id: string): Promise<Feed> => {
    const response = await api.get(`/feeds/${id}`);
    return response.data;
  },

  add: async (data: { url: string, category?: string }): Promise<Feed> => {
    const response = await api.post("/feeds", data);
    return response.data;
  },

  delete: async (id: string): Promise<boolean> => {
    const response = await api.delete(`/feeds/${id}`);
    return response.data.success;
  },

  refresh: async (id: string): Promise<Feed> => {
    const response = await api.patch(`/feeds/${id}`);
    return response.data;
  },

  getArticles: async (feedId: string, options?: { 
    query?: string; 
    unreadOnly?: boolean 
  }): Promise<Article[]> => {
    const params = new URLSearchParams();
    if (options?.query) params.append('query', options.query);
    if (options?.unreadOnly) params.append('unreadOnly', 'true');
    
    const url = `/feeds/${feedId}/articles${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await api.get(url);
    return response.data;
  },

  update: async (data: { id: string; url: string; category?: string }): Promise<Feed> => {
    const response = await api.put(`/feeds/${data.id}`, { url: data.url, category: data.category });
    return response.data;
  },
};

export const articlesApi = {
  getFavorites: async (options?: { query?: string; unreadOnly?: boolean }): Promise<Article[]> => {
    const params = new URLSearchParams();
    if (options?.query) params.append('query', options.query);
    if (options?.unreadOnly) params.append('unreadOnly', 'true');
    
    const url = `/articles/favorite${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await api.get(url);
    return response.data;
  },

  markAsFavorite: async (
    id: string,
    isFavorite: boolean
  ): Promise<Article> => {
    const response = await api.post("/articles/favorite", {
      id,
      isFavorite,
    });
    return response.data;
  },
  
  markAsRead: async (
    id: string,
    isRead: boolean
  ): Promise<Article> => {
    const response = await api.post("/articles/read", {
      id,
      isRead,
    });
    return response.data;
  },
  
  search: async (query: string): Promise<Article[]> => {
    const response = await api.get(`/articles/search?query=${encodeURIComponent(query)}`);
    return response.data;
  },
};
