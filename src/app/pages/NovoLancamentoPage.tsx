import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Layout } from '../components/Layout';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { lancamentoService } from '../../services/lancamentoService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

export function NovoLancamentoPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    TipoLancamento: 'RECEITA',
    DescricaoLancamento: '',
    ObservacaoLancamento: '',
    Valor: '',
    Data: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    setIsLoading(true);

    try {
      await lancamentoService.create({
        tipoLancamento: Number(formData.TipoLancamento),
        descricaoLancamento: formData.DescricaoLancamento,
        observacaoLancamento: formData.ObservacaoLancamento,
        valor: parseFloat(formData.Valor),
        data: new Date(formData.Data).toISOString(),
      });

      toast.success('Lançamento criado com sucesso!');
      navigate('/lancamentos');
    } catch (error: any) {
      toast.error('Erro ao criar lançamento');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Layout>
      <div className="max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/lancamentos')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Novo Lançamento</h1>
            <p className="text-gray-600 mt-1">Registre uma nova movimentação financeira</p>
          </div>
        </div>

        {/* Form */}
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="tipo">Tipo de Lançamento *</Label>
              <Select
                value={formData.TipoLancamento}
                onValueChange={(value) => handleChange('TipoLancamento', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Receita</SelectItem>
                  <SelectItem value="1">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="descricao">Descrição *</Label>
              <Input
                id="descricao"
                value={formData.DescricaoLancamento}
                onChange={(e) => handleChange('DescricaoLancamento', e.target.value)}
                placeholder="Ex: Salário, Aluguel, Venda de produto..."
                required
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="valor">Valor *</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.Valor}
                  onChange={(e) => handleChange('Valor', e.target.value)}
                  placeholder="0,00"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="data">Data *</Label>
                <Input
                  id="data"
                  type="date"
                  value={formData.Data}
                  onChange={(e) => handleChange('Data', e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="observacao">Observação</Label>
              <Textarea
                id="observacao"
                value={formData.ObservacaoLancamento}
                onChange={(e) => handleChange('ObservacaoLancamento', e.target.value)}
                placeholder="Informações adicionais sobre este lançamento..."
                rows={4}
                className="mt-1"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-[#FFC107] hover:bg-[#FFB300] text-black font-medium"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Lançamento
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/lancamentos')}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
