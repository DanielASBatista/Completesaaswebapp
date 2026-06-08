// Configuração base da API
const API_BASE_URL = 'http://localhost:5059';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {

  const token = localStorage.getItem('midas_token');

const headers: Record<string, string> = {
  'Content-Type': 'application/json',
  ...(options.headers as Record<string, string>),
};

if (
  token &&
  !endpoint.includes('/Autenticar') &&
  !endpoint.includes('/Registrar')
) {
  headers.Authorization = `Bearer ${token}`;
}


  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new ApiError(response.status, errorText || response.statusText);
    }

    if (response.status === 204 || options.method === 'DELETE') {
      return {} as T;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(0, 'Erro de conexão com a API');
  }
}
