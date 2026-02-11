# ❓ FAQ - Projeto Midas

## 🔐 Autenticação e Segurança

### Como funciona o sistema de autenticação?
O sistema usa JWT (JSON Web Tokens). Ao fazer login, a API retorna um token que é armazenado no localStorage. Todas as requisições subsequentes incluem esse token no header `Authorization: Bearer {token}`.

### Onde o token é armazenado?
O token JWT é armazenado no `localStorage` do navegador com a chave `midas_token`. Os dados do usuário são armazenados com a chave `midas_user`.

### O token expira?
Sim, o token JWT tem um tempo de expiração definido no backend. Quando expirar, o usuário precisará fazer login novamente.

### Como implementar refresh token?
Atualmente não há refresh token. Para implementar:
1. Backend deve retornar `access_token` e `refresh_token`
2. Interceptar erro 401 no frontend
3. Chamar endpoint de refresh
4. Atualizar token e repetir requisição original

### É seguro armazenar o token no localStorage?
Para aplicações SaaS simples, sim. Para maior segurança:
- Use `httpOnly` cookies (requer mudança no backend)
- Implemente refresh tokens
- Configure CSP (Content Security Policy)
- Use HTTPS sempre

## 🔌 API e Integração

### Como mudar a URL da API?
Edite o arquivo `/src/services/api.ts`:
```typescript
const API_BASE_URL = 'https://sua-api.com';
```

### Como lidar com erros de CORS?
Configure CORS no backend C#:
```csharp
services.AddCors(options => {
  options.AddPolicy("AllowFrontend", policy => {
    policy.WithOrigins("http://localhost:3000")
          .AllowAnyMethod()
          .AllowAnyHeader();
  });
});
```

### Como funciona a autenticação das requisições?
O arquivo `api.ts` adiciona automaticamente o header `Authorization` em todas as requisições (exceto login e registro).

### E se a API não responder?
Um erro será lançado e capturado pelo try/catch do componente, mostrando uma notificação toast ao usuário.

### Como adicionar novos endpoints?
1. Adicione a interface/tipo em `/src/types/index.ts`
2. Crie o service em `/src/services/`
3. Use o service no componente

Exemplo:
```typescript
// types/index.ts
export interface Categoria {
  id: number;
  nome: string;
}

// services/categoriaService.ts
export const categoriaService = {
  async getAll(): Promise<Categoria[]> {
    return apiRequest<Categoria[]>('/Categorias/GetAll');
  }
};
```

## 🎨 UI e Componentes

### Como personalizar as cores?
Edite `/src/styles/theme.css`:
```css
--midas-wine: #SEU_VINHO;
--midas-yellow: #SEU_AMARELO;
```

### Como adicionar novos ícones?
Use a biblioteca `lucide-react`:
```typescript
import { IconName } from 'lucide-react';

<IconName className="w-5 h-5" />
```

Busque ícones em: https://lucide.dev

### Como criar um novo componente UI?
1. Crie em `/src/app/components/`
2. Use TypeScript para props
3. Exporte como named export

```typescript
interface MyComponentProps {
  title: string;
}

export function MyComponent({ title }: MyComponentProps) {
  return <div>{title}</div>;
}
```

### Posso usar outras bibliotecas UI?
Sim! O projeto já usa Radix UI. Você pode adicionar:
- Material-UI
- Ant Design
- Chakra UI

Instale com: `npm install <biblioteca>`

## 📱 Páginas e Rotas

### Como adicionar uma nova página?
1. Crie o componente em `/src/app/pages/`
2. Adicione a rota em `/src/app/App.tsx`

```typescript
// pages/NovaPage.tsx
export function NovaPage() {
  return <Layout>...</Layout>;
}

// App.tsx
<Route path="/nova" element={<NovaPage />} />
```

### Como proteger uma rota?
Use o componente `<Layout>` que já inclui proteção:
```typescript
export function MinhaPage() {
  return <Layout>{/* conteúdo */}</Layout>;
}
```

### Como redirecionar após login?
O `AuthContext` já faz isso automaticamente. Após login bem-sucedido, redireciona para `/dashboard`.

## 💾 Dados e Estado

### Como compartilhar estado entre componentes?
Use Context API:
```typescript
// context/MyContext.tsx
export const MyContext = createContext();

export function MyProvider({ children }) {
  const [value, setValue] = useState();
  return (
    <MyContext.Provider value={{ value, setValue }}>
      {children}
    </MyContext.Provider>
  );
}

// Em qualquer componente
const { value } = useContext(MyContext);
```

### Como fazer paginação?
```typescript
const [page, setPage] = useState(1);
const [pageSize] = useState(10);

const paginatedData = data.slice(
  (page - 1) * pageSize,
  page * pageSize
);
```

### Como implementar busca?
Use o hook `useDebounce`:
```typescript
const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 500);

useEffect(() => {
  if (debouncedSearch) {
    searchData(debouncedSearch);
  }
}, [debouncedSearch]);
```

## 🐛 Debugging e Erros

### Como ver os erros da API?
Abra o DevTools (F12) e vá em:
- **Console**: Erros JavaScript
- **Network**: Requisições HTTP
- **Application**: localStorage

### Erro: "Erro de conexão com a API"
Verifique:
1. Backend está rodando?
2. URL da API está correta?
3. CORS configurado?
4. Firewall/antivírus bloqueando?

### Erro: 401 Unauthorized
- Token expirou ou é inválido
- Faça logout e login novamente
- Verifique configuração JWT no backend

### Erro: 404 Not Found
- Endpoint não existe na API
- Verifique a URL do endpoint
- Confira documentação da API

### Como debugar um componente React?
```typescript
// Adicione logs
console.log('State:', state);

// Use React DevTools
// Instale extensão no Chrome/Firefox

// Breakpoints
debugger; // Pausa execução
```

## ⚡ Performance

### Como otimizar o carregamento?
```typescript
// 1. Lazy loading de rotas
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

// 2. Memoização
const memoizedValue = useMemo(() => expensiveCalc(), [deps]);

// 3. Callback memoizado
const handleClick = useCallback(() => {}, []);

// 4. React.memo
export const Component = React.memo(({ data }) => {});
```

### Bundle muito grande?
```bash
# Analise o bundle
npm run build
npx vite-bundle-visualizer

# Remova dependências não usadas
npm uninstall <pacote>
```

## 🧪 Testes

### Como testar um componente?
```typescript
import { render, screen } from '@testing-library/react';

test('renders component', () => {
  render(<MyComponent />);
  expect(screen.getByText('Texto')).toBeInTheDocument();
});
```

### Como mockar a API?
```typescript
// Usando MSW (Mock Service Worker)
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/Lancamentos/GetAll', (req, res, ctx) => {
    return res(ctx.json([/* mock data */]));
  })
);
```

## 📦 Deploy e Produção

### Como fazer deploy?
```bash
# 1. Build
npm run build

# 2. Os arquivos estarão em /dist
# 3. Faça upload para seu servidor/CDN
```

### Quais variáveis de ambiente preciso?
```env
VITE_API_BASE_URL=https://api.production.com
```

### Como configurar HTTPS?
- Use certificado SSL válido
- Configure no servidor web (Nginx/Apache)
- Para desenvolvimento: `mkcert` (certificado local)

## 🔧 Desenvolvimento

### Como rodar localmente?
```bash
# Já está rodando no Figma Make!
# Para rodar fora daqui:
npm install
npm run dev
```

### Como adicionar uma dependência?
```bash
npm install <pacote>
```

### Como atualizar dependências?
```bash
npm update
npm audit fix  # Corrige vulnerabilidades
```

## 📊 Relatórios e Exportação

### Como exportar para Excel?
```typescript
import * as XLSX from 'xlsx';

const exportToExcel = (data: any[]) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Lancamentos');
  XLSX.writeFile(wb, 'relatorio.xlsx');
};
```

### Como gerar PDF?
```typescript
import jsPDF from 'jspdf';

const generatePDF = () => {
  const doc = new jsPDF();
  doc.text('Relatório Midas', 10, 10);
  doc.save('relatorio.pdf');
};
```

## 🌐 Internacionalização

### Como adicionar múltiplos idiomas?
Use `react-i18next`:
```bash
npm install react-i18next i18next
```

```typescript
import { useTranslation } from 'react-i18next';

function Component() {
  const { t } = useTranslation();
  return <h1>{t('dashboard.title')}</h1>;
}
```

## 🎓 Aprendizado

### Onde aprender mais sobre React?
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com)

### Como contribuir para o projeto?
1. Fork o repositório
2. Crie uma branch para sua feature
3. Faça commit das mudanças
4. Abra um Pull Request

## 💬 Suporte

### Onde reportar bugs?
- Crie uma issue no GitHub
- Ou entre em contato com a equipe

### Como sugerir melhorias?
- Abra uma issue com a tag `enhancement`
- Descreva o problema e a solução proposta

---

**Não encontrou sua resposta? Entre em contato com a equipe! 📧**
