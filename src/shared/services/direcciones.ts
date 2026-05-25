import { apiClient } from './api';

export interface Direccion {
  id: number;
  usuario_id: number;
  alias?: string | null;
  linea1: string;
  linea2?: string | null;
  ciudad: string;
  provincia?: string | null;
  codigo_postal?: string | null;
  latitud?: number | null;
  longitud?: number | null;
  es_principal: boolean;
  created_at: string;
  updated_at: string;
}

export interface DireccionCreate {
  alias?: string | null;
  linea1: string;
  linea2?: string | null;
  ciudad: string;
  provincia?: string | null;
  codigo_postal?: string | null;
  es_principal?: boolean;
}

export interface DireccionUpdate extends Partial<DireccionCreate> {}

export const direccionesService = {
  getAll: async (): Promise<Direccion[]> => {
    const { data } = await apiClient.get<Direccion[]>('/direcciones/');
    return data;
  },

  getById: async (id: number): Promise<Direccion> => {
    const { data } = await apiClient.get<Direccion>(`/direcciones/${id}`);
    return data;
  },

  create: async (direccion: DireccionCreate): Promise<Direccion> => {
    const { data } = await apiClient.post<Direccion>('/direcciones/', direccion);
    return data;
  },

  update: async (id: number, direccion: DireccionUpdate): Promise<Direccion> => {
    const { data } = await apiClient.patch<Direccion>(`/direcciones/${id}`, direccion);
    return data;
  },

  setPrincipal: async (id: number): Promise<Direccion> => {
    const { data } = await apiClient.patch<Direccion>(`/direcciones/${id}/principal`);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/direcciones/${id}`);
  },
};
