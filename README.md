# Maids Flow - Multi Empresas

Uma plataforma completa de gestão para empresas de limpeza, permitindo o gerenciamento de múltiplas empresas, profissionais, agendamentos e muito mais.

## 🚀 Funcionalidades

### Para Administradores
- **Dashboard Completo**: Visão geral de todas as empresas e atividades
- **Gestão de Empresas**: Cadastro e gerenciamento de empresas parceiras
- **Gestão de Usuários**: Controle de acesso e permissões
- **Gestão de Profissionais**: Cadastro e acompanhamento de profissionais
- **Relatórios Avançados**: Análises detalhadas de performance
- **Sistema de Pagamentos**: Controle financeiro integrado
- **GPS Tracking**: Monitoramento em tempo real
- **Gestão de Planos**: Diferentes níveis de serviço

### Para Empresas
- **Dashboard Personalizado**: Métricas específicas da empresa
- **Gestão de Equipes**: Organização de profissionais em equipes
- **Agendamentos**: Sistema completo de agendamento de serviços
- **Chat Integrado**: Comunicação com profissionais
- **Relatórios**: Análises de performance e produtividade
- **Gestão de Clientes**: Cadastro e histórico de clientes
- **Sistema de Avaliações**: Feedback de clientes
- **Controle de Materiais**: Gestão de estoque e consumo

### Para Profissionais
- **App Mobile-First**: Interface otimizada para dispositivos móveis
- **Check-in/Check-out**: Sistema de ponto com GPS
- **Agenda Pessoal**: Visualização de agendamentos
- **Chat**: Comunicação com supervisores
- **Histórico**: Registro de atividades realizadas
- **Performance**: Acompanhamento de métricas pessoais

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: React Context API
- **Forms**: React Hook Form
- **Charts**: Recharts
- **Icons**: Lucide React
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
NEXT_PUBLIC_API_BASE_URL=https://206.189.191.51:5000/api
NEXT_PUBLIC_APP_NAME=Maids Flow - Multi empresas
\`\`\`

5. Execute o projeto em modo de desenvolvimento:
\`\`\`bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
\`\`\`

6. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🌐 Ambientes

### Desenvolvimento
- **URL**: http://localhost:3000
- **API**: https://206.189.191.51:5000/api

### Produção
- **URL**: https://maidsflow.com
- **API**: https://api.maidsflow.com/api

## 📁 Estrutura do Projeto

\`\`\`
maids-flow-platform/
├── app/                          # App Router (Next.js 14)
│   ├── admin/                    # Páginas do administrador
│   ├── company/                  # Páginas das empresas
│   ├── professional/             # Páginas dos profissionais
│   ├── login/                    # Página de login
│   ├── register/                 # Página de registro
│   └── layout.tsx                # Layout principal
├── components/                   # Componentes reutilizáveis
│   ├── admin/                    # Componentes específicos do admin
│   ├── company/                  # Componentes específicos das empresas
│   ├── professional/             # Componentes dos profissionais
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

A aplicação é totalmente responsiva e otimizada para:
- **Desktop**: Interface completa com sidebars
- **Tablet**: Layout adaptado com navegação otimizada
- **Mobile**: Interface mobile-first para profissionais

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Docker
\`\`\`bash
# Build da imagem
docker build -t maids-flow .

# Executar container
docker run -p 3000:3000 maids-flow
\`\`\`

## 🧪 Testes

\`\`\`bash
# Executar testes
npm run test

# Testes com coverage
npm run test:coverage

# Testes e2e
npm run test:e2e
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

## 📞 Suporte

Para suporte técnico, entre em contato:
- **Email**: suporte@maidsflow.com
- **WhatsApp**: +55 (11) 99999-9999
- **Website**: https://maidsflow.com

## 🏆 Créditos

Desenvolvido com ❤️ pela equipe Maids Flow Development Team.

---

**Maids Flow** - Transformando a gestão de empresas de limpeza através da tecnologia.
