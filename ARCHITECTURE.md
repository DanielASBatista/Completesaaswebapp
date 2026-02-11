# 🏗️ Arquitetura do Projeto Midas

## 📐 Visão Geral

O Projeto Midas é uma aplicação SaaS de gestão financeira desenvolvida em **React 18** com **TypeScript** e **Tailwind CSS**, seguindo princípios de Clean Architecture e boas práticas de desenvolvimento frontend.

## 🎯 Princípios de Design

### 1. Separação de Responsabilidades
- **Presentation Layer**: Componentes React (UI)
- **Business Logic**: Context API e Hooks
- **Data Layer**: Services de API
- **Types**: Interfaces TypeScript centralizadas

### 2. Component-Driven Development
- Componentes reutilizáveis e atômicos
- Props tipadas com TypeScript
- Composição sobre herança

### 3. State Management
- **Local State**: useState para estado de componente
- **Global State**: Context API para autenticação
- **Server State**: Fetch direto nos componentes (pode migrar para React Query)

## 📁 Estrutura de Diretórios

```
src/
├── app/                          # Camada de apresentação
│   ├── components/               # Componentes React
│   │   ├── ui/                  # Componentes UI reutilizáveis (shadcn/ui)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   ├── Layout.tsx           # Layout wrapper com proteção de rota
│   │   ├── Sidebar.tsx          # Menu lateral fixo
│   │   ├── Topbar.tsx           # Barra superior com dropdown
│   │   ├── LoadingSpinner.tsx   # Indicador de carregamento
│   │   ├── ErrorMessage.tsx     # Exibição de erros
│   │   ├── EmptyState.tsx       # Estado vazio
│   │   ├── StatCard.tsx         # Card de estatística
│   │   └── StatusBadge.tsx      # Badge de status colorido
│   ├── pages/                   # Páginas da aplicação
│   │   ├── LoginPage.tsx        # Autenticação
│   │   ├── DashboardPage.tsx    # Dashboard principal
│   │   ├── LancamentosPage.tsx  # Listagem de lançamentos
│   │   ├── NovoLancamentoPage.tsx # Formulário de criação
│   │   ├── ProjecoesPage.tsx
│   │   ├── EmprestimosPage.tsx
│   │   ├── RecorrenciasPage.tsx
│   │   └── EmpresaPage.tsx
│   └── App.tsx                  # Componente raiz com rotas
│
├── context/                      # Contextos React
│   └── AuthContext.tsx          # Gerenciamento de autenticação
│
├── services/                     # Camada de comunicação com API
│   ├── api.ts                   # Cliente HTTP base
│   ├── usuarioService.ts        # Endpoints de usuário
│   ├── empresaService.ts
│   ├── lancamentoService.ts
│   ├── emprestimoService.ts
│   ├── projecaoService.ts
│   ├── recorrenciaService.ts
│   └── responsavelService.ts
│
├── types/                        # Definições TypeScript
│   └── index.ts                 # Interfaces e tipos
│
├── constants/                    # Constantes da aplicação
│   └── index.ts                 # Cores, rotas, mensagens
│
├── utils/                        # Utilitários
│   ├── formatters.ts            # Formatação de valores/datas
│   ├── validators.ts            # Validações
│   └── mockData.ts              # Dados mock para testes
│
├── hooks/                        # Custom hooks
│   ├── useDebounce.ts           # Debounce de valores
│   └── useLocalStorage.ts       # Persistência local
│
└── styles/                       # Estilos globais
    ├── index.css                # Imports principais
    ├── tailwind.css             # Configuração Tailwind
    ├── theme.css                # Tokens de design
    └── fonts.css                # Fontes customizadas
```

## 🔄 Fluxo de Dados

```
┌─────────────┐
│   Usuario   │
└──────┬──────┘
       │ Interação
       ▼
┌─────────────────┐
│  React Component │
│   (Pages/UI)     │
└──────┬──────────┘
       │ Dispara ação
       ▼
┌─────────────────┐
│    Service      │
│  (API Client)   │
└──────┬──────────┘
       │ HTTP Request
       ▼
┌─────────────────┐
│   API Midas     │
│  (Backend C#)   │
└──────┬──────────┘
       │ Response
       ▼
┌─────────────────┐
│  React Component │
│  (Update State)  │
└──────┬──────────┘
       │ Re-render
       ▼
┌─────────────────┐
│   Usuario vê    │
│   resultado     │
└─────────────────┘
```

## 🔐 Fluxo de Autenticação

```
1. Usuário entra em /login
2. Preenche credenciais
3. Submit do formulário
4. POST /Usuario/Autenticar
5. API retorna Token JWT + dados do usuário
6. Token armazenado em localStorage
7. Usuário armazenado em AuthContext
8. Redirect para /dashboard
9. Todas requisições incluem: Authorization: Bearer {token}
10. Logout limpa localStorage e Context
```

## 📦 Padrões de Código

### Nomenclatura

#### Componentes
```typescript
// PascalCase para componentes
export function DashboardPage() { }
export function StatCard() { }
```

#### Hooks
```typescript
// camelCase com prefixo 'use'
export function useAuth() { }
export function useDebounce() { }
```

#### Services
```typescript
// camelCase com sufixo 'Service'
export const lancamentoService = { }
```

#### Constantes
```typescript
// UPPER_SNAKE_CASE
export const API_BASE_URL = '...';
export const STORAGE_KEYS = { };
```

### Organização de Imports

```typescript
// 1. Imports do React
import { useState, useEffect } from 'react';

// 2. Imports de bibliotecas externas
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

// 3. Imports de componentes internos
import { Layout } from '../components/Layout';
import { Button } from '../components/ui/button';

// 4. Imports de services/utils
import { lancamentoService } from '../../services/lancamentoService';
import { formatCurrency } from '../../utils/formatters';

// 5. Imports de types
import type { Lancamento } from '../../types';
```

### Estrutura de Componente

```typescript
// 1. Imports

// 2. Types/Interfaces
interface ComponentProps {
  // ...
}

// 3. Componente
export function Component({ props }: ComponentProps) {
  // 3.1. Hooks
  const [state, setState] = useState();
  useEffect(() => { }, []);
  
  // 3.2. Handlers
  const handleClick = () => { };
  
  // 3.3. Computed values
  const total = items.reduce(...);
  
  // 3.4. Early returns
  if (loading) return <Loading />;
  
  // 3.5. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

## 🎨 Design Tokens

### Cores Principais
```css
--midas-wine: #4B0012        /* Cor corporativa */
--midas-yellow: #FFC107      /* Ações primárias */
--midas-yellow-dark: #FFB300 /* Hover de ações */
```

### Aplicação de Cores
- **Sidebar**: Vinho (#4B0012)
- **Botões principais**: Amarelo (#FFC107)
- **Badges de sucesso**: Verde
- **Badges de erro**: Vermelho
- **Receitas**: Verde
- **Despesas**: Vermelho

## 🔌 Integração com API

### Headers Padrão
```typescript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {token}'  // Exceto login/registro
}
```

### Tratamento de Erros
```typescript
try {
  const data = await service.getData();
} catch (error: any) {
  if (error.status === 401) {
    // Não autorizado - redirecionar para login
  } else if (error.status === 404) {
    // Não encontrado
  } else {
    // Erro genérico
    toast.error('Erro ao carregar dados');
  }
}
```

## 🧪 Testes (Sugestão Futura)

### Unit Tests
```typescript
// formatters.test.ts
import { formatCurrency } from './formatters';

describe('formatCurrency', () => {
  it('formats positive numbers', () => {
    expect(formatCurrency(1000)).toBe('R$ 1.000,00');
  });
});
```

### Integration Tests
```typescript
// LoginPage.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginPage } from './LoginPage';

test('submits login form', async () => {
  render(<LoginPage />);
  // ...
});
```

## 📊 Performance

### Otimizações Implementadas
- ✅ Code splitting por rota (React Router)
- ✅ Componentes funcionais (sem classes)
- ✅ TypeScript para type safety
- ✅ Tailwind CSS (utility-first)

### Otimizações Futuras
- [ ] React.memo para componentes pesados
- [ ] useMemo/useCallback para cálculos caros
- [ ] Lazy loading de imagens
- [ ] Virtual scrolling para listas longas
- [ ] React Query para cache de API

## 🔒 Segurança

### Implementado
- ✅ JWT em localStorage
- ✅ Proteção de rotas privadas
- ✅ HTTPS (em produção)
- ✅ TypeScript para type safety

### Recomendações Futuras
- [ ] Refresh token
- [ ] CSRF tokens
- [ ] Input sanitization (DOMPurify)
- [ ] Rate limiting no frontend
- [ ] Content Security Policy

## 📱 Responsividade

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Abordagem
- Desktop-first design
- Sidebar responsiva (pode colapsar)
- Tabelas com scroll horizontal em mobile
- Cards que se adaptam ao tamanho da tela

## 🚀 Deploy

### Build de Produção
```bash
npm run build
```

### Variáveis de Ambiente
```env
VITE_API_BASE_URL=https://api.midas.com
VITE_APP_VERSION=1.0.0
```

### Checklist de Deploy
- [ ] Alterar API_BASE_URL em api.ts
- [ ] Configurar CORS na API
- [ ] Configurar HTTPS
- [ ] Otimizar bundle size
- [ ] Testar em produção

## 📚 Dependências Principais

| Biblioteca | Versão | Uso |
|-----------|--------|-----|
| react | 18.3.1 | Framework |
| react-router | 7.13.0 | Roteamento |
| typescript | latest | Type safety |
| tailwindcss | 4.1.12 | Estilização |
| lucide-react | latest | Ícones |
| recharts | 2.15.2 | Gráficos |
| sonner | 2.0.3 | Toasts |
| radix-ui | latest | Componentes UI |

## 🤝 Contribuindo

1. Clone o repositório
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Commit: `git commit -m 'Add nova feature'`
4. Push: `git push origin feature/nova-feature`
5. Abra um Pull Request

---

**Documentação mantida por: Equipe Projeto Midas**  
**Última atualização: Fevereiro 2026**
