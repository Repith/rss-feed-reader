import axios from 'axios';
import { Feed } from '@/domain/models/Feed';
import { Article } from '@/domain/models/Article';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const feedsApi = {
  getAll: async (): Promise<Feed[]> => {
    const response = await api.get('/feeds');
    return response.data;
  },
  
  getById: async (id: string): Promise<Feed> => {
    const response = await api.get(`/feeds/${id}`);
    return response.data;
  },
  
  add: async (url: string): Promise<Feed> => {
    const response = await api.post('/feeds', { url });
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
  
  getArticles: async (feedId: string): Promise<Article[]> => {
    const response = await api.get(`/feeds/${feedId}/articles`);
    return response.data;
  }
};

export const articlesApi = {
  getFavorites: async (): Promise<Article[]> => {
    const response = await api.get('/articles/favorite');
    return response.data;
  },
  
  markAsFavorite: async (id: string, isFavorite: boolean): Promise<Article> => {
    const response = await api.post('/articles/favorite', { id, isFavorite });
    return response.data;
  }
};