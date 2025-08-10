# Maids Flow - Multi Empresas

Uma plataforma completa de gestão para empresas de limpeza, permitindo o gerenciamento de múltiplas empresas, profissionais, agendamentos, pagamentos e muito mais.

## 🚀 Funcionalidades

### Para Administradores
- **Dashboard Completo**: Visão geral de todas as empresas e métricas
- **Gestão de Empresas**: Cadastro e gerenciamento de empresas parceiras
- **Gestão de Usuários**: Controle de acesso e permissões
- **Gestão de Profissionais**: Cadastro e acompanhamento de profissionais
- **Relatórios Avançados**: Relatórios detalhados de performance e financeiro
- **Sistema de Pagamentos**: Controle de pagamentos e comissões
- **GPS Tracking**: Rastreamento em tempo real dos profissionais
- **Gestão de Planos**: Criação e gerenciamento de planos de assinatura

### Para Empresas
- **Dashboard Empresarial**: Métricas específicas da empresa
- **Gestão de Clientes**: Cadastro e histórico de clientes
- **Agendamentos**: Sistema completo de agendamento de serviços
- **Gestão de Equipes**: Organização de profissionais em equipes
- **Chat Interno**: Comunicação com profissionais
- **Relatórios**: Relatórios de performance e financeiro
- **Gestão de Materiais**: Controle de estoque e consumo
- **Avaliações**: Sistema de feedback e avaliações

### Para Profissionais
- **App Mobile-First**: Interface otimizada para dispositivos móveis
- **Check-in/Check-out**: Sistema de ponto com GPS e foto
- **Agenda Pessoal**: Visualização de agendamentos
- **Chat**: Comunicação com supervisores
- **Histórico**: Histórico completo de serviços
- **Performance**: Métricas de desempenho pessoal

## 🛠️ Tecnologias

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: React Context API
- **Charts**: Recharts
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Date Handling**: date-fns
- **HTTP Client**: Fetch API nativo

## 📦 Instalação

1. Clone o repositório:
\`\`\`bash
git clone https://github.com/your-username/maids-flow-platform.git
cd maids-flow-platform
\`\`\`

2. Instale as dependências:
\`\`\`bash
npm install
# ou
yarn install
# ou
pnpm install
\`\`\`

3. Configure as variáveis de ambiente:
\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Edite o arquivo `.env.local` com suas configurações:
\`\`\`env
NEXT_PUBLIC_API_BASE_URL=https://localhost:44394/api
NEXT_PUBLIC_APP_NAME=Maids Flow - Multi empresas
NEXT_PUBLIC_ENVIRONMENT=development
\`\`\`

5. Execute o projeto:
\`\`\`bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
\`\`\`

6. Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🔧 Configuração da API

### URLs de Ambiente

O projeto suporta diferentes URLs de API através de variáveis de ambiente:

**Desenvolvimento:**
\`\`\`env
NEXT_PUBLIC_API_BASE_URL=https://localhost:44394/api
\`\`\`

**Produção:**
\`\`\`env
NEXT_PUBLIC_API_BASE_URL=https://api.maidsflow.com/api
\`\`\`

**Staging:**
\`\`\`env
NEXT_PUBLIC_API_BASE_URL=https://staging-api.maidsflow.com/api
\`\`\`

### Configurações Disponíveis

\`\`\`env
# API
NEXT_PUBLIC_API_BASE_URL=https://localhost:44394/api
NEXT_PUBLIC_API_TIMEOUT=30000

# App
NEXT_PUBLIC_APP_NAME=Maids Flow - Multi empresas
NEXT_PUBLIC_APP_VERSION=1.0.0

# Features
NEXT_PUBLIC_ENABLE_GPS_TRACKING=true
NEXT_PUBLIC_ENABLE_CHAT=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
\`\`\`

## 📁 Estrutura do Projeto

\`\`\`
maids-flow-platform/
├── app/                          # App Router (Next.js 14)
│   ├── admin/                    # Páginas do administrador
│   ├── company/                  # Páginas da empresa
│   ├── professional/             # Páginas do profissional
│   ├── login/                    # Página de login
│   └── register/                 # Página de registro
├── components/                   # Componentes reutilizáveis
│   ├── admin/                    # Componentes específicos do admin
│   ├── company/                  # Componentes específicos da empresa
│   ├── professional/             # Componentes específicos do profissional
│   └── ui/                       # Componentes base (shadcn/ui)
├── contexts/                     # Context providers
├── hooks/                        # Custom hooks
├── lib/                          # Utilitários e configurações
│   └── api/                      # Funções de API
├── types/                        # Definições de tipos TypeScript
├── public/                       # Arquivos estáticos
└── styles/                       # Estilos globais
\`\`\`

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação:

- **Admin**: Acesso completo ao sistema
- **Company**: Acesso às funcionalidades da empresa
- **Professional**: Acesso às funcionalidades do profissional

## 📱 Responsividade

O projeto é totalmente responsivo e otimizado para:
- **Desktop**: Interface completa com sidebars
- **Tablet**: Layout adaptado com navegação otimizada
- **Mobile**: Interface mobile-first para profissionais

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente no painel do Vercel
3. Deploy automático a cada push

### Build Manual

\`\`\`bash
npm run build
npm run start
\`\`\`

### Export Estático

\`\`\`bash
npm run build
npm run export
\`\`\`

## 🧪 Testes

\`\`\`bash
# Executar testes
npm run test

# Executar testes em modo watch
npm run test:watch

# Coverage
npm run test:coverage
\`\`\`

## 📊 Scripts Disponíveis

\`\`\`bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run start        # Iniciar produção
npm run lint         # Linting
npm run type-check   # Verificação de tipos
\`\`\`

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

Para suporte, entre em contato:
- Email: suporte@maidsflow.com
- WhatsApp: (11) 99999-9999
- Website: https://maidsflow.com

## 🔄 Changelog

### v1.0.0
- Lançamento inicial
- Sistema completo de gestão multi-empresas
- Interface responsiva
- Sistema de autenticação JWT
- GPS tracking
- Chat interno
- Sistema de pagamentos

---

Desenvolvido com ❤️ pela equipe Maids Flow Development Team
