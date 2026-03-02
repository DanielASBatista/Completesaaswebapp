import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AuthProvider } from '../context/AuthContext';
import { Toaster } from './components/ui/sonner';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { LancamentosPage } from './pages/LancamentosPage';
import { NovoLancamentoPage } from './pages/NovoLancamentoPage';
import { ProjecoesPage } from './pages/ProjecoesPage';
import { EmprestimosPage } from './pages/EmprestimosPage';
import { RecorrenciasPage } from './pages/RecorrenciasPage';
import { EmpresaPage } from './pages/EmpresaPage';
import { RegisterPage } from './pages/RegistrarPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/lancamentos" element={<LancamentosPage />} />
          <Route path="/lancamentos/novo" element={<NovoLancamentoPage />} />
          <Route path="/projecoes" element={<ProjecoesPage />} />
          <Route path="/emprestimos" element={<EmprestimosPage />} />
          <Route path="/recorrencias" element={<RecorrenciasPage />} />
          <Route path="/empresa" element={<EmpresaPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </AuthProvider>
  );
}