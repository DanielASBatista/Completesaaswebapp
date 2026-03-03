// Models da API Midas

export interface Usuario {
  IdUsuario: number;
  nomeUsuario: string;
  sobrenome: string;
  emailUsuario: string;
  telefone: string;
  PasswordString?: string;
  IdEmpresa: number;
  Token?: string;
}

export interface Empresa {
  IdEmpresa: number;
  idResponsavel: number;
  razaoSocial: string;
  nomeFantasia: string;
  telefoneEmp: string;
  cnpjEmpresa: string;
  emailEmpresa: string;
}

export interface Lancamento {
  idLancamento: number;
  idUsuario: number;
  idProjecao?: number | null;
  idSimEmprestimo?: number | null;
  idRecorrente?: number | null;
  tipoLancamento: number; // 0 para receita, 1 para despesa
  descricaoLancamento: string;
  observacaoLancamento: string;
  valor: number;
  data: string; // ISO date string
  dataCriacao: string; // ISO date string
}

export interface Emprestimo {
  idSimEmprestimo: number;
  nomeEmprestimo: string;
  descricaoEmprestimo: string;
  provedorEmprestimo: string;
  valorEmprestimo: number;
  parcelasEmprestimo: number;
  valorParcelas: number;
  ioFemprestimo: number;
  despesasEmprestimo: number;
  tarifasEmprestimo: number;
  data: string; // ISO date string
}

export interface Projecao {
  idProjecao: number;
  titulo: string;
  dsProjecao: string;
  valorPrevisto: number;
  dataReferencia: string; // ISO date string
  dataCriacao: string; // ISO date string
}

export interface Recorrencia {
  idRecorrente: number;
  idProjecao: number;
  tipoLancamento: number; // 0 para receita, 1 para despesa
  dsRecorrente: string;
  valor: number;
  dataInicio: string; // ISO date string
  qtdeRecorrente: number;
  obRecorrente: string;
  tipoRecorrenciaId: number;
  tipoRecorrencia?: TipoRecorrencia 
}

export interface Responsavel {
  idResponsavel: number;
  nomeResponsavel: string;
  cpfResponsavel: string;
  emailResponsavel: string;
  telefoneResponsavel: string;
}

// DTOs para requisições
export interface LoginRequest {
  nomeUsuario: string;
  PasswordString: string;
}

export interface UsuarioAuth {
  id: number;
  nomeUsuario: string;
}

export interface LoginResponse {
  token: string;
  usuario: UsuarioAuth;
}

export interface RegistrarRequest {
  nomeUsuario: string;
  PasswordString: string;
}

export interface AlterarSenhaRequest {
  IdUsuario: number;
  SenhaAtual: string;
  NovaSenha: string;
}

export interface SomatoriaResponse {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface TipoRecorrencia {
  id: number;
  nome: string;
  padraoSistema: boolean;
  descricao: string;
}
