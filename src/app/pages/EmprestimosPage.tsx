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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
   AlertDialogTitle } from '../components/ui/alert-dialog';

export function EmprestimosPage() {
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);

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

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await emprestimoService.delete(deleteId);
      toast.success('Empréstimo excluído com sucesso!');
      setEmprestimos((prev) => prev.filter((emp) => emp.idSimEmprestimo !== deleteId));
      setDeleteId(null);
    } catch (error: any) {
      toast.error('Erro ao excluir empréstimo');
      console.error(error);
    }
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
                <TableHead>Valor do Empréstimo</TableHead>
                <TableHead>Valor Final</TableHead>
                <TableHead>Parcelas</TableHead>
                <TableHead>Valor Parcela</TableHead>
                <TableHead>IOF</TableHead>
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
                  <TableRow key={emp.idSimEmprestimo}>
                    <TableCell className="font-medium">{emp.nomeEmprestimo}</TableCell>
                    <TableCell>{emp.provedorEmprestimo}</TableCell>

                    {/* Valor do Empréstimo */}
                    <TableCell>{formatCurrency(emp.valorEmprestimo)}</TableCell>

                    {/* Valor Final */}
                    <TableCell>
                      {formatCurrency(
                        (emp.valorEmprestimo ?? 0) +
                          (emp.ioFemprestimo ?? 0) +
                          (emp.despesasEmprestimo ?? 0) +
                          (emp.tarifasEmprestimo ?? 0)
                      )}
                    </TableCell>

                    <TableCell>{emp.parcelasEmprestimo}x</TableCell>
                    <TableCell>{formatCurrency(emp.valorParcelas)}</TableCell>

                    {/* IOF em percentual */}
                    <TableCell>
                      {emp.ioFemprestimo != null && !isNaN(Number(emp.ioFemprestimo))
                        ? (Number(emp.ioFemprestimo) * 100).toFixed(3) + '%'
                        : '-'}
                    </TableCell>

                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => setDeleteId(emp.idSimEmprestimo)}>
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

          {/* Delete Dialog */}
          <AlertDialog open={deleteId !== null} onOpenChange={(open) => { if (!open) setDeleteId(null); }}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir este empréstimo? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDeleteId(null)}>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-600 text-white hover:bg-red-700">
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
      </div>
    </Layout>
  );
}   