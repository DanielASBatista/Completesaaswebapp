import { useEffect, useState } from 'react';
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
import { ArrowLeft, Save, Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import { recorrenciaService } from '../../services/recorrenciaService';
import { tipoRecorrenciaService } from '../../services/tiporecorrenciaService';

export function NovaRecorrenciaPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [tiposRecorrencia, setTiposRecorrencia] = useState<
    { id: number; descricao: string }[]
  >([]);
  const [novoTipo, setNovoTipo] = useState('');
  const [adicionandoNovoTipo, setAdicionandoNovoTipo] = useState(false);

  const [formData, setFormData] = useState({
    TipoLancamento: '0', // 0 = Receita, 1 = Despesa
    dsRecorrente: '',
    obRecorrente: '',
    Valor: '',
    dataInicio: new Date().toISOString().split('T')[0],
    qtdeRecorrente: '1',
    TipoRecorrenciaId: 0,
  });

  // Carrega tipos existentes
  useEffect(() => {
    tipoRecorrenciaService.getAll().then((res) => setTiposRecorrencia(res));
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddNovoTipo = async () => {
    if (!novoTipo.trim()) return;
    try {
      const criado = await tipoRecorrenciaService.create({ descricao: novoTipo });
      setTiposRecorrencia((prev) => [...prev, criado]);
      setFormData((prev) => ({ ...prev, TipoRecorrenciaId: criado.id }));
      setNovoTipo('');
      setAdicionandoNovoTipo(false);
      toast.success('Novo tipo de recorrência adicionado!');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao adicionar novo tipo');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    setIsLoading(true);

    try {
      await recorrenciaService.create({
        tipoRecorrencia: Number(formData.TipoLancamento),
        dsRecorrente: formData.dsRecorrente,
        obRecorrente: formData.obRecorrente,
        valor: parseFloat(formData.Valor),
        dataInicio: new Date(formData.dataInicio).toISOString(),
        qtdeRecorrente: parseInt(formData.qtdeRecorrente),
      });

      toast.success('Recorrência criada com sucesso!');
      navigate('/recorrencias');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao criar recorrência');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/recorrencias')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nova Recorrência</h1>
            <p className="text-gray-600 mt-1">Configure uma nova recorrência financeira</p>
          </div>
        </div>

        {/* Form */}
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="tipoLancamento">Tipo de Lançamento *</Label>
              <Select
                value={formData.TipoLancamento}
                onValueChange={(val) => handleChange('TipoLancamento', val)}
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
                value={formData.dsRecorrente}
                onChange={(e) => handleChange('dsRecorrente', e.target.value)}
                placeholder="Ex: Salário, Aluguel..."
                required
                className="mt-1"
              />
            </div>

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
              <Label htmlFor="dataInicio">Data Início *</Label>
              <Input
                id="dataInicio"
                type="date"
                value={formData.dataInicio}
                onChange={(e) => handleChange('dataInicio', e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="qtdeRecorrente">Quantidade de Ocorrências *</Label>
              <Input
                id="qtdeRecorrente"
                type="number"
                min="1"
                value={formData.qtdeRecorrente}
                onChange={(e) => handleChange('qtdeRecorrente', e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="tipoRecorrencia">Tipo de Recorrência *</Label>
              <Select
                value={formData.TipoRecorrenciaId.toString()}
                onValueChange={(val) => {
                  if (val === 'novo') setAdicionandoNovoTipo(true);
                  else handleChange('TipoRecorrenciaId', val);
                }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tiposRecorrencia.map((tipo) => (
                    <SelectItem key={tipo.id} value={tipo.id.toString()}>
                      {tipo.descricao}
                    </SelectItem>
                  ))}
                  <SelectItem value="novo">
                    <Plus className="w-4 h-4 mr-1 inline" />
                    Adicionar novo tipo
                  </SelectItem>
                </SelectContent>
              </Select>

              {adicionandoNovoTipo && (
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Novo tipo de recorrência"
                    value={novoTipo}
                    onChange={(e) => setNovoTipo(e.target.value)}
                  />
                  <Button type="button" onClick={handleAddNovoTipo}>
                    Salvar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setAdicionandoNovoTipo(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="observacao">Observação</Label>
              <Textarea
                id="observacao"
                value={formData.obRecorrente}
                onChange={(e) => handleChange('obRecorrente', e.target.value)}
                placeholder="Informações adicionais sobre esta recorrência..."
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
                    Salvar Recorrência
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/recorrencias')}
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