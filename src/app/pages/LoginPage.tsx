import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login({
        nomeUsuario: email,
        PasswordString: password,
      });
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4B0012] to-[#2d0009] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#4B0012]">Projeto Midas</h1>
            <p className="text-gray-600 mt-2">Sistema de Gestão Financeira</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Usuário</Label>
              <Input
                id="usuario"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu login de usuário."
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="mt-1"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#FFC107] hover:bg-[#FFB300] text-black font-medium"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Projeto Midas © 2026
          </p>
        </div>
      </div>
    </div>
  );
}
