import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Usuario, LoginRequest } from '../types';
import { usuarioService } from '../services/usuarioService';

interface AuthContextType {
  user: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<Usuario>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há token no localStorage ao carregar
    const token = localStorage.getItem('midas_token');
    const userStr = localStorage.getItem('midas_user');
    
    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } catch (error) {
        console.error('Erro ao carregar usuário do localStorage', error);
        localStorage.removeItem('midas_token');
        localStorage.removeItem('midas_user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
  const response = await usuarioService.autenticar(credentials);

  console.log("RESPOSTA LOGIN:", response);

  const usuarioId = response.usuario.id || response.usuario.Id || 0;
  const nomeUsuario = response.usuario.nomeUsuario || response.usuario.NomeUsuario || '';
  const idEmpresa = response.usuario.idEmpresa || response.usuario.IdEmpresa || 0;
  const perfil = response.usuario.perfil || response.usuario.Perfil || '';

  const authenticatedUser: Usuario = {
    IdUsuario: usuarioId,
    idUsuario: usuarioId,
    nomeUsuario,
    sobrenome: '',
    emailUsuario: '',
    telefone: '',
    IdEmpresa: idEmpresa,
    idEmpresa,
    Perfil: perfil,
    perfil,
    Token: response.token,
  };

  localStorage.setItem('midas_token', response.token);
  localStorage.setItem('midas_user', JSON.stringify(authenticatedUser));

  setUser(authenticatedUser);
};


  const logout = () => {
    localStorage.removeItem('midas_token');
    localStorage.removeItem('midas_user');
    setUser(null);
  };

  const updateUser = (data: Partial<Usuario>) => {
    setUser(prev => {
      if (!prev) return prev;

      const updatedUser = { ...prev, ...data };
      localStorage.setItem('midas_user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading,
        login, 
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
