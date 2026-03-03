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
import { recorrenciaService } from '../../services/recorrenciaService';
import type { Recorrencia } from '../../types';
import { toast } from 'sonner';
import { Link } from 'react-router';

export function RecorrenciasPage() {
  const [recorrencias, setRecorrencias] = useState<Recorrencia[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecorrencias();
  }, []);

  const loadRecorrencias = async () => {
    try {
      setIsLoading(true);
      const data = await recorrenciaService.getAll();
      setRecorrencias(data);
    } catch (error: any) {
      toast.error('Erro ao carregar recorrências');
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
        <LoadingSpinner text="Carregando recorrências..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Recorrências</h1>
            <p className="text-gray-600 mt-1">Lançamentos automáticos periódicos</p>
          </div>
            <Link to="/recorrencias/novo">
              <Button className="bg-[#FFC107] hover:bg-[#FFB300] text-black font-medium">
                <Plus className="w-4 h-4 mr-2" />
                Nova Recorrência
              </Button>
            </Link>
        </div>

        {/* Tabela */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data Início</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>ID Projeção</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recorrencias.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    Nenhuma recorrência cadastrada
                  </TableCell>
                </TableRow>
              ) : (
                recorrencias.map((rec) => (
                  <TableRow key={rec.idRecorrente}>
                    <TableCell className="font-medium">{rec.dsRecorrente}</TableCell>
                    <TableCell className="font-bold text-[#4B0012]">
                      {formatCurrency(rec.valor)}
                    </TableCell>
                    <TableCell>{formatDate(rec.dataInicio)}</TableCell>
                    <TableCell>{rec.qtdeRecorrente}x</TableCell>
                    <TableCell>{rec.idProjecao}</TableCell>
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
