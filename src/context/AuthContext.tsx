import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Usuario, LoginRequest } from '../types';
import { usuarioService } from '../services/usuarioService';

interface AuthContextType {
  user: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
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
    
    // Armazenar token e dados do usuário
    localStorage.setItem('midas_token', response.Token);
    localStorage.setItem('midas_user', JSON.stringify(response));
    
    setUser(response as Usuario);
  };

  const logout = () => {
    localStorage.removeItem('midas_token');
    localStorage.removeItem('midas_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading,
        login, 
        logout 
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
