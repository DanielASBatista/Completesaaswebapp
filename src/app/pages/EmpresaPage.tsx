import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Save, Loader2 } from 'lucide-react';
import { empresaService } from '../../services/empresaService';
import { useAuth } from '../../context/AuthContext';
import type { Empresa } from '../../types';
import { toast } from 'sonner';

export function EmpresaPage() {
  const { user } = useAuth();
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    razaoSocial: '',
    nomeFantasia: '',
    telefoneEmp: '',
    cnpjEmpresa: '',
    emailEmpresa: '',
  });

  useEffect(() => {
    loadEmpresa();
  }, []);

  const loadEmpresa = async () => {
    if (!user?.IdEmpresa) return;

    try {
      setIsLoading(true);
      const data = await empresaService.getById(user.IdEmpresa);
      setEmpresa(data);
      setFormData({
        razaoSocial: data.razaoSocial,
        nomeFantasia: data.nomeFantasia,
        telefoneEmp: data.telefoneEmp,
        cnpjEmpresa: data.cnpjEmpresa,
        emailEmpresa: data.emailEmpresa,
      });
    } catch (error: any) {
      toast.error('Erro ao carregar dados da empresa');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!empresa) return;

    setIsSaving(true);

    try {
      await empresaService.update(empresa.IdEmpresa, formData);
      toast.success('Dados da empresa atualizados com sucesso!');
      loadEmpresa();
    } catch (error: any) {
      toast.error('Erro ao atualizar dados da empresa');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <Layout>
        <LoadingSpinner text="Carregando dados da empresa..." />
      </Layout>
    );
  }

  if (!empresa) {
    return (
      <Layout>
        <Card className="p-8 text-center">
          <p className="text-gray-600">Nenhuma empresa vinculada a este usuário.</p>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Empresa</h1>
          <p className="text-gray-600 mt-1">Gerencie os dados da sua empresa</p>
        </div>

        {/* Form */}
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="razaoSocial">Razão Social *</Label>
              <Input
                id="razaoSocial"
                value={formData.razaoSocial}
                onChange={(e) => handleChange('razaoSocial', e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
              <Input
                id="nomeFantasia"
                value={formData.nomeFantasia}
                onChange={(e) => handleChange('nomeFantasia', e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cnpj">CNPJ *</Label>
                <Input
                  id="cnpj"
                  value={formData.cnpjEmpresa}
                  onChange={(e) => handleChange('cnpjEmpresa', e.target.value)}
                  placeholder="00.000.000/0000-00"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={formData.telefoneEmp}
                  onChange={(e) => handleChange('telefoneEmp', e.target.value)}
                  placeholder="(00) 00000-0000"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.emailEmpresa}
                onChange={(e) => handleChange('emailEmpresa', e.target.value)}
                placeholder="empresa@email.com"
                className="mt-1"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-[#FFC107] hover:bg-[#FFB300] text-black font-medium"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>

        {/* Info adicional */}
        <Card className="p-6 bg-gray-50">
          <h3 className="font-semibold text-gray-900 mb-2">Informações do Sistema</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <p><span className="font-medium">ID Empresa:</span> {empresa.IdEmpresa}</p>
            <p><span className="font-medium">ID Responsável:</span> {empresa.idResponsavel}</p>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
