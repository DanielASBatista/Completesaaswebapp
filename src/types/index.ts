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
  IdLancamento: number;
  IdUsuario: number;
  IdProjecao?: number | null;
  IdSimEmprestimo?: number | null;
  idRecorrente?: number | null;
  TipoLancamento: string; // "RECEITA" ou "DESPESA"
  DescricaoLancamento: string;
  ObservacaoLancamento: string;
  Valor: number;
  Data: string; // ISO date string
  DataCriacao: string; // ISO date string
}

export interface Emprestimo {
  IdSimEmprestimo: number;
  nomeEmprestimo: string;
  descricaoEmprestimo: string;
  provedorEmprestimo: string;
  valorEmprestimo: number;
  parcelasEmprestimo: number;
  valorParcelas: number;
  IOFemprestimo: number;
  despesasEmprestimo: number;
  tarifasEmprestimo: number;
  Data: string; // ISO date string
}

export interface Projecao {
  IdProjecao: number;
  Titulo: string;
  dsProjecao: string;
  ValorPrevisto: number;
  DataReferencia: string; // ISO date string
  DataCriacao: string; // ISO date string
}

export interface Recorrencia {
  idRecorrente: number;
  IdProjecao: number;
  dsRecorrente: string;
  Valor: number;
  dataInicio: string; // ISO date string
  qtdeRecorrente: number;
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
  emailUsuario: string;
  PasswordString: string;
}

export interface LoginResponse {
  IdUsuario: number;
  nomeUsuario: string;
  sobrenome: string;
  emailUsuario: string;
  telefone: string;
  IdEmpresa: number;
  Token: string;
}

export interface RegistrarRequest {
  nomeUsuario: string;
  sobrenome: string;
  emailUsuario: string;
  telefone: string;
  PasswordString: string;
  IdEmpresa: number;
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
