// Mock data para testes e desenvolvimento
// Remova este arquivo quando conectar com a API real

import type { 
  Usuario, 
  Empresa, 
  Lancamento, 
  Emprestimo, 
  Projecao, 
  Recorrencia 
} from '../types';

export const mockUsuario: Usuario = {
  IdUsuario: 1,
  nomeUsuario: 'João',
  sobrenome: 'Silva',
  emailUsuario: 'joao.silva@email.com',
  telefone: '(11) 99999-9999',
  IdEmpresa: 1,
  Token: 'mock-jwt-token-123456789',
};

export const mockEmpresa: Empresa = {
  IdEmpresa: 1,
  idResponsavel: 1,
  razaoSocial: 'Midas Tecnologia LTDA',
  nomeFantasia: 'Midas Tech',
  telefoneEmp: '(11) 3333-4444',
  cnpjEmpresa: '12.345.678/0001-90',
  emailEmpresa: 'contato@midastech.com',
};

export const mockLancamentos: Lancamento[] = [
  {
    IdLancamento: 1,
    IdUsuario: 1,
    TipoLancamento: 'RECEITA',
    DescricaoLancamento: 'Venda de serviço - Cliente A',
    ObservacaoLancamento: 'Projeto de desenvolvimento web',
    Valor: 5000.00,
    Data: '2026-02-10T10:00:00Z',
    DataCriacao: '2026-02-10T10:00:00Z',
  },
  {
    IdLancamento: 2,
    IdUsuario: 1,
    TipoLancamento: 'DESPESA',
    DescricaoLancamento: 'Aluguel do escritório',
    ObservacaoLancamento: 'Referente ao mês de fevereiro',
    Valor: 2000.00,
    Data: '2026-02-05T14:30:00Z',
    DataCriacao: '2026-02-05T14:30:00Z',
  },
  {
    IdLancamento: 3,
    IdUsuario: 1,
    TipoLancamento: 'RECEITA',
    DescricaoLancamento: 'Consultoria técnica',
    ObservacaoLancamento: '',
    Valor: 3000.00,
    Data: '2026-02-08T09:15:00Z',
    DataCriacao: '2026-02-08T09:15:00Z',
  },
  {
    IdLancamento: 4,
    IdUsuario: 1,
    TipoLancamento: 'DESPESA',
    DescricaoLancamento: 'Fornecedor de software',
    ObservacaoLancamento: 'Licenças Adobe Creative Cloud',
    Valor: 800.00,
    Data: '2026-02-11T16:00:00Z',
    DataCriacao: '2026-02-11T16:00:00Z',
  },
];

export const mockEmprestimos: Emprestimo[] = [
  {
    IdSimEmprestimo: 1,
    nomeEmprestimo: 'Empréstimo Capital de Giro',
    descricaoEmprestimo: 'Empréstimo para expansão do negócio',
    provedorEmprestimo: 'Banco XYZ',
    valorEmprestimo: 50000.00,
    parcelasEmprestimo: 24,
    valorParcelas: 2291.67,
    IOFemprestimo: 250.00,
    despesasEmprestimo: 150.00,
    tarifasEmprestimo: 100.00,
    Data: '2026-01-15T00:00:00Z',
  },
];

export const mockProjecoes: Projecao[] = [
  {
    IdProjecao: 1,
    Titulo: 'Projeto Cliente B - Fase 2',
    dsProjecao: 'Desenvolvimento da segunda fase do projeto',
    ValorPrevisto: 15000.00,
    DataReferencia: '2026-03-01T00:00:00Z',
    DataCriacao: '2026-02-01T10:00:00Z',
  },
  {
    IdProjecao: 2,
    Titulo: 'Consultoria Mensal',
    dsProjecao: 'Serviço de consultoria recorrente',
    ValorPrevisto: 4000.00,
    DataReferencia: '2026-03-15T00:00:00Z',
    DataCriacao: '2026-02-01T10:00:00Z',
  },
];

export const mockRecorrencias: Recorrencia[] = [
  {
    idRecorrente: 1,
    IdProjecao: 2,
    dsRecorrente: 'Consultoria Mensal - Recorrente',
    Valor: 4000.00,
    dataInicio: '2026-02-01T00:00:00Z',
    qtdeRecorrente: 12,
  },
];

export const mockSomatoria = {
  totalReceitas: 8000.00,
  totalDespesas: 2800.00,
  saldo: 5200.00,
};
