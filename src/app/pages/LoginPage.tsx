import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { LogIn, User, Lock } from 'lucide-react'; 

export function LoginPage() {
  const [nome, setNome] = useState('');
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
        nomeUsuario: nome,
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
    <div className="w-screen h-screen bg-[#4D0012] flex items-center justify-center">
      <div className="bg-white p-8 rounded-3xl shadow w-128 flex items-center justify-center flex-col gap-4">
        <div className="text-center mb-8">
          {/* Logo/Header */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#450010] to-[#6a0018] rounded-2xl mb-4 shadow-lg">
              <LogIn className="w-10 h-10 text-[#FFC107]" />
            </div>
      <h1 className="text-5xl font-bold text-[#450010] mb-2">Projeto Midas</h1>
      <h6 className="text-lg text-gray-500">Sistema de Gestão Financeira</h6>

          {/* Form */}
        <div className="bg-white p-4 w-120 h-120 items-allign-left flex flex-col gap-4 text-left text-size-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="py-6 ">
              <Label className="py-2 text-lg" htmlFor="usuario">Usuário</Label>
              <User className="w-5 h-5 text-gray-400 absolute mt-3 ml-2" />
              <Input
                id="usuario"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite seu login de usuário."
                required
                className="w-full border border-black rounded pl-10 h-10"/>
            </div>

            <div>
              <Label className="py-2 text-lg" htmlFor="password">Senha</Label>
              <Lock className="w-5 h-5 text-gray-400 absolute mt-3 ml-2" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a sua senha."
                required
                className="w-full border border-black rounded pl-10 h-10"
              />
            </div>

           <div className="py-8 my-3 flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-[#FFC107] focus:ring-[#FFC107] border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  Lembrar-me
                </label>
              </div>
              <button type="button" className="text-sm text-[#450010] hover:text-[#FFC107] font-semibold transition">
                Esqueceu a senha?
              </button>
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
            <div className="text-center mt-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate('/register')}
            >
              Criar conta
            </Button>
          </div>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Projeto Midas © 2026
          </p>
        </div>
      </div>
    </div>
   </div>
  );
}
