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
import { emprestimoService } from '../../services/emprestimoService';
import type { Emprestimo } from '../../types';
import { toast } from 'sonner';

export function EmprestimosPage() {
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEmprestimos();
  }, []);

  const loadEmprestimos = async () => {
    try {
      setIsLoading(true);
      const data = await emprestimoService.getAll();
      setEmprestimos(data);
    } catch (error: any) {
      toast.error('Erro ao carregar empréstimos');
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
        <LoadingSpinner text="Carregando empréstimos..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Empréstimos</h1>
            <p className="text-gray-600 mt-1">Gerencie seus empréstimos e financiamentos</p>
          </div>
          <Button className="bg-[#FFC107] hover:bg-[#FFB300] text-black font-medium">
            <Plus className="w-4 h-4 mr-2" />
            Novo Empréstimo
          </Button>
        </div>

        {/* Tabela */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Provedor</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Parcelas</TableHead>
                <TableHead>Valor Parcela</TableHead>
                <TableHead>IOF</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {emprestimos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    Nenhum empréstimo cadastrado
                  </TableCell>
                </TableRow>
              ) : (
                emprestimos.map((emp) => (
                  <TableRow key={emp.IdSimEmprestimo}>
                    <TableCell className="font-medium">{emp.nomeEmprestimo}</TableCell>
                    <TableCell>{emp.provedorEmprestimo}</TableCell>
                    <TableCell className="font-bold text-[#4B0012]">
                      {formatCurrency(emp.valorEmprestimo)}
                    </TableCell>
                    <TableCell>{emp.parcelasEmprestimo}x</TableCell>
                    <TableCell>{formatCurrency(emp.valorParcelas)}</TableCell>
                    <TableCell>{formatCurrency(emp.IOFemprestimo)}</TableCell>
                    <TableCell>{formatDate(emp.Data)}</TableCell>
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
