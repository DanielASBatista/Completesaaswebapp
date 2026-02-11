import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Plus, Trash2 } from 'lucide-react';
import { projecaoService } from '../../services/projecaoService';
import type { Projecao } from '../../types';
import { toast } from 'sonner';

export function ProjecoesPage() {
  const [projecoes, setProjecoes] = useState<Projecao[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProjecoes();
  }, []);

  const loadProjecoes = async () => {
    try {
      setIsLoading(true);
      const data = await projecaoService.getAll();
      setProjecoes(data);
    } catch (error: any) {
      toast.error('Erro ao carregar projeções');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <Layout>
        <LoadingSpinner text="Carregando projeções..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projeções</h1>
            <p className="text-gray-600 mt-1">Planeje suas receitas e despesas futuras</p>
          </div>
          <Button className="bg-[#FFC107] hover:bg-[#FFB300] text-black font-medium">
            <Plus className="w-4 h-4 mr-2" />
            Nova Projeção
          </Button>
        </div>

        {/* Tabela */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor Previsto</TableHead>
                <TableHead>Data Referência</TableHead>
                <TableHead>Data Criação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projecoes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    Nenhuma projeção cadastrada
                  </TableCell>
                </TableRow>
              ) : (
                projecoes.map((proj) => (
                  <TableRow key={proj.IdProjecao}>
                    <TableCell className="font-medium">{proj.Titulo}</TableCell>
                    <TableCell className="max-w-xs truncate">{proj.dsProjecao}</TableCell>
                    <TableCell className="font-bold text-[#4B0012]">
                      {formatCurrency(proj.ValorPrevisto)}
                    </TableCell>
                    <TableCell>{formatDate(proj.DataReferencia)}</TableCell>
                    <TableCell>{formatDate(proj.DataCriacao)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </Layout>
  );
}
