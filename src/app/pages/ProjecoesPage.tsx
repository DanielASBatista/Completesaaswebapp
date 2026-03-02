import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../components/ui/alert-dialog';
import { Plus, Trash2, Filter } from 'lucide-react';
import { projecaoService } from '../../services/projecaoService';
import type { Projecao } from '../../types';
import { toast } from 'sonner';

export function ProjecoesPage() {
  const [projecoes, setProjecoes] = useState<Projecao[]>([]);
  const [filteredProjecoes, setFilteredProjecoes] = useState<Projecao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [filterYear, setFilterYear] = useState('');
  const [filterMonth, setFilterMonth] = useState('');

  useEffect(() => {
    loadProjecoes();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [projecoes, filterYear, filterMonth]);

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

  const applyFilters = () => {
    let filtered = [...projecoes];

    if (filterYear) {
      filtered = filtered.filter(p => new Date(p.dataReferencia).getFullYear() === parseInt(filterYear));
    }

    if (filterMonth) {
      filtered = filtered.filter(p => (new Date(p.dataReferencia).getMonth() + 1) === parseInt(filterMonth));
    }

    setFilteredProjecoes(filtered);
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('pt-BR');

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await projecaoService.delete(deleteId);
      toast.success('Projeção excluída com sucesso!');
      setProjecoes(prev => prev.filter(p => p.idProjecao !== deleteId));
      setDeleteId(null);
    } catch (error: any) {
      toast.error('Erro ao excluir projeção');
      console.error(error);
    }
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

        {/* Filtros */}
        <Card className="p-4">
          <div className="flex items-end gap-4">
            <Filter className="w-5 h-5 text-gray-600 mb-2" />
            <div className="flex-1">
              <Label htmlFor="year">Ano</Label>
              <Input
                id="year"
                type="number"
                placeholder="2026"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="month">Mês</Label>
              <Input
                id="month"
                type="number"
                placeholder="1-12"
                min="1"
                max="12"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setFilterYear('');
                setFilterMonth('');
              }}
            >
              Limpar
            </Button>
          </div>
        </Card>

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
              {filteredProjecoes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    Nenhuma projeção encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filteredProjecoes.map(proj => (
                  <TableRow key={proj.idProjecao}>
                    <TableCell className="font-medium">{proj.titulo}</TableCell>
                    <TableCell className="max-w-xs truncate">{proj.dsProjecao}</TableCell>
                    <TableCell className="font-bold text-[#4B0012]">{formatCurrency(proj.valorPrevisto)}</TableCell>
                    <TableCell>{formatDate(proj.dataReferencia)}</TableCell>
                    <TableCell>{formatDate(proj.dataCriacao)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => setDeleteId(proj.idProjecao)}>
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
        <AlertDialog open={deleteId !== null} onOpenChange={open => { if (!open) setDeleteId(null); }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir esta projeção? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeleteId(null)}>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}