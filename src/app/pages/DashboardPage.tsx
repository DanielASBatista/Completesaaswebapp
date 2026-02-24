import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/ui/card';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { lancamentoService } from '../../services/lancamentoService';
import type { SomatoriaResponse, Lancamento } from '../../types';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { toast } from 'sonner';

export function DashboardPage() {
  const [somatoria, setSomatoria] = useState<SomatoriaResponse | null>(null);
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const now = new Date();
      const ano = now.getFullYear();
      const mes = now.getMonth() + 1;

      const [somatoriaData, lancamentosData] = await Promise.all([
        lancamentoService.getSomatoria(),
        lancamentoService.getByMes(ano, mes),
      ]);

      setSomatoria(somatoriaData);
      setLancamentos(lancamentosData);
    } catch (error: any) {
      toast.error('Erro ao carregar dados do dashboard');
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

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  // 📊 Agrupar lançamentos por dia
  const chartData = lancamentos.reduce((acc, lanc) => {
    if (!lanc.data) return acc;

    const dataFormatada = new Date(lanc.data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    });

    const existing = acc.find(item => item.data === dataFormatada);

    if (existing) {
      if (lanc.tipoLancamento === 0) {
        existing.receitas += lanc.valor;
      } else if (lanc.tipoLancamento === 1) {
        existing.despesas += lanc.valor;
      }
    } else {
      acc.push({
        data: dataFormatada,
        receitas: lanc.tipoLancamento === 0 ? lanc.valor : 0,
        despesas: lanc.tipoLancamento === 1 ? lanc.valor : 0,
      });
    }

    return acc;
  }, [] as { data: string; receitas: number; despesas: number }[]);

  if (isLoading) {
    return (
      <Layout>
        <LoadingSpinner text="Carregando dashboard..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Visão geral das suas finanças</p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Total Receitas</p>
                <p className="text-2xl font-bold text-green-900 mt-2">
                  {formatCurrency(somatoria?.totalReceitas || 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">Total Despesas</p>
                <p className="text-2xl font-bold text-red-900 mt-2">
                  {formatCurrency(somatoria?.totalDespesas || 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-[#4B0012]/10 to-[#4B0012]/20 border-[#4B0012]/30">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#4B0012]">Saldo</p>
                <p className="text-2xl font-bold text-[#4B0012] mt-2">
                  {formatCurrency(somatoria?.saldo || 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-[#4B0012] rounded-full flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

        </div>

        {/* Gráfico */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Receitas x Despesas (Mês Atual)
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Bar dataKey="receitas" fill="#10B981" name="Receitas" radius={[8, 8, 0, 0]} />
              <Bar dataKey="despesas" fill="#EF4444" name="Despesas" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Últimos Lançamentos */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Últimos Lançamentos
          </h2>

          <div className="space-y-3">
            {lancamentos.slice(0, 5).map((lanc) => {
              const isReceita = lanc.tipoLancamento === 0;

              return (
                <div
                  key={lanc.idLancamento}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isReceita ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {lanc.descricaoLancamento}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatDate(lanc.data)}
                      </p>
                    </div>
                  </div>

                  <p
                    className={`font-bold ${
                      isReceita ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {isReceita ? '+' : '-'} {formatCurrency(lanc.valor)}
                  </p>
                </div>
              );
            })}
          </div>
        </Card>

      </div>
    </Layout>
  );
}