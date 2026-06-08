import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff } from "lucide-react";
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

import {
  ArrowRight,
  Coins,
  CreditCard,
  DollarSign,
  LineChart,
  Loader2,
  Lock,
  PiggyBank,
  ShieldCheck,
  TrendingUp,
  User,
  Wallet,
} from 'lucide-react';

import { toast } from 'sonner';

export function LoginPage() {
  const [nome, setNome] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogin(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

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
      toast.error(
        error.message || 'Erro ao fazer login. Verifique suas credenciais.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#2B000A] text-white">
      {/* Background Glow */}
      <div className="absolute top-[-200px] left-[-150px] h-[500px] w-[500px] rounded-full bg-[#7A001C]/30 blur-3xl" />
      <div className="absolute bottom-[-250px] right-[-100px] h-[500px] w-[500px] rounded-full bg-[#FFC107]/10 blur-3xl" />

      {/* Floating Icons */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Coins className="absolute left-[10%] top-[20%] h-10 w-10 animate-bounce text-[#FFC107]/40" />
        <Wallet className="absolute left-[80%] top-[25%] h-12 w-12 animate-pulse text-[#FFC107]/30" />
        <TrendingUp className="absolute left-[65%] top-[60%] h-14 w-14 animate-bounce text-[#FFC107]/20" />
        <PiggyBank className="absolute left-[20%] top-[70%] h-14 w-14 animate-pulse text-[#FFC107]/20" />
        <CreditCard className="absolute left-[45%] top-[15%] h-10 w-10 animate-bounce text-[#FFC107]/20" />
        <DollarSign className="absolute left-[90%] top-[80%] h-14 w-14 animate-pulse text-[#FFC107]/10" />
      </div>

      {/* Navbar */}
      <header className="relative z-10 flex items-center px-10 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white">
            <img src= "/image.png"
                 alt="Logo"
                 className="h-10 w-10 object-contain"/>
          </div>

          <div>
            <h1 className="text-2xl font-black tracking-wide">
              Projeto Midas
            </h1>

            <p className="text-sm text-gray-300">
              Gestão Financeira Inteligente
            </p>
          </div>
        </div>
      </header>
      {/* Hero */}
      <main className="relative z-10 flex min-h-[85vh] items-center justify-between px-10">
        {/* Left */}
        <section className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#FFC107]/20 bg-[#FFC107]/10 px-5 py-2 text-sm text-[#FFC107] backdrop-blur-md">
            <ShieldCheck className="h-4 w-4" />
            Controle financeiro moderno e inteligente
          </div>

          <h1 className="mb-6 text-6xl font-black leading-tight">
            Transforme sua
            <span className="bg-gradient-to-r from-[#FFC107] to-yellow-300 bg-clip-text text-transparent">
              {' '}
              vida financeira
            </span>{' '}
            com o Projeto Midas
          </h1>

          <p className="max-w-2xl text-xl leading-relaxed text-gray-300">
            Gerencie gastos, acompanhe metas, visualize projeções e tome
            decisões financeiras com uma plataforma moderna inspirada nas
            melhores experiências do mercado.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl">
              <LineChart className="h-8 w-8 text-[#FFC107]" />
              <div>
                <p className="font-semibold">Análises Inteligentes</p>
                <span className="text-sm text-gray-400">
                  Insights financeiros em tempo real
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl">
              <PiggyBank className="h-8 w-8 text-[#FFC107]" />
              <div>
                <p className="font-semibold">Metas Financeiras</p>
                <span className="text-sm text-gray-400">
                  Planejamento e crescimento
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Login Card */}
        <section
          className={`transition-all duration-700 ${showLogin
            ? 'translate-y-0 opacity-100'
            : 'translate-y-10 opacity-0'
            }`}
        >
          <div className="w-[420px] rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white">
                Entrar na plataforma
              </h2>

              <p className="mt-2 text-gray-300">
                Faça login para acessar seu painel financeiro.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label
                  htmlFor="usuario"
                  className="mb-2 block text-sm text-gray-200"
                >
                  Usuário
                </Label>

                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />

                  <Input
                    id="usuario"
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Digite seu usuário"
                    required
                    className="h-12 rounded-xl border-white/10 bg-white/10 pl-11 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="password"
                  className="mb-2 block text-sm text-gray-200"
                >
                  Senha
                </Label>

                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />

                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha"
                    required
                    className="h-12 rounded-xl border-white/10 bg-white/10 pl-11 text-white placeholder:text-gray-400"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-500 bg-transparent"
                  />

                  <span className="text-sm text-gray-300">
                    Lembrar-me
                  </span>
                </div>

                <button
                  type="button"
                  className="text-sm font-medium text-[#FFC107] transition hover:text-yellow-300"
                >
                  Esqueceu a senha?
                </button>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 w-full rounded-xl bg-[#FFC107] text-base font-bold text-black transition hover:bg-[#FFB300]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  <>
                    Entrar
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/register')}
                className="h-12 w-full rounded-xl border-white/10 bg-white/5 text-white transition hover:bg-white/10"
              >
                Criar Conta
              </Button>
            </form>

            <div className="mt-8 border-t border-white/10 pt-5 text-center text-sm text-gray-400">
              Projeto Midas © 2026
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
