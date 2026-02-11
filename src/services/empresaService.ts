import { apiRequest } from './api';
import type { Empresa } from '../types';

export const empresaService = {
  async getAll(): Promise<Empresa[]> {
    return apiRequest<Empresa[]>('/Empresa/GetAll');
  },

  async getById(id: number): Promise<Empresa> {
    return apiRequest<Empresa>(`/Empresa/${id}`);
  },

  async create(empresa: Partial<Empresa>): Promise<Empresa> {
    return apiRequest<Empresa>('/Empresa/New', {
      method: 'POST',
      body: JSON.stringify(empresa),
    });
  },

  async update(id: number, empresa: Partial<Empresa>): Promise<Empresa> {
    return apiRequest<Empresa>(`/Empresa/${id}`, {
      method: 'PUT',
      body: JSON.stringify(empresa),
    });
  },

  async delete(id: number): Promise<void> {
    return apiRequest<void>(`/Empresa/${id}`, {
      method: 'DELETE',
    });
  },
};
