import { apiRequest } from './api';

export interface AnaliseIARequest {
  idProjecao: number;
  contexto: string;
}

export interface AnaliseIAResponse {
  sucesso: boolean;
  analise: string;
  recomendacao: 'favoravel' | 'desfavoravel' | 'neutra';
  pontosFortes: string[];
  pontosAtencao: string[];
  dataAnalise: string;
}

export const analiseIAService = {
  async analisarProjecao(projecaoId: number): Promise<AnaliseIAResponse> {
    return apiRequest<AnaliseIAResponse>(`/Projecoes/analisar-ia/${projecaoId}`, {
      method: 'POST',
    });
  },
};
