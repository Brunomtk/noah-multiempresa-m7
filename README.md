# Noah - Multi empresas

*Sincronizado automaticamente com suas implantações [v0.dev](https://v0.dev)*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/brunomendes-8683s-projects/v0-noah-multi-empresas)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/5MKu5ct9sJV)

## Visão Geral

Noah - Multi empresas é uma plataforma abrangente projetada para otimizar a gestão de serviços de limpeza, oferecendo interfaces dedicadas para administradores, empresas e profissionais. O objetivo é simplificar o agendamento, monitoramento e gerenciamento de todas as operações, desde compromissos e cancelamentos até rastreamento GPS e controle de materiais.

## Funcionalidades Principais

A plataforma oferece um conjunto robusto de funcionalidades para cada tipo de usuário:

### Interface Administrativa
*   **Agendamentos**: Gerenciamento completo de compromissos, incluindo criação, edição e visualização.
*   **Cancelamentos**: Acompanhamento e gestão de cancelamentos.
*   **Check-in/Check-out**: Monitoramento de registros de entrada e saída.
*   **Empresas**: Gerenciamento de empresas cadastradas na plataforma.
*   **Clientes**: Cadastro e gestão de informações de clientes.
*   **Dashboard**: Visão geral e estatísticas da plataforma.
*   **Feedback**: Análise de feedback interno.
*   **Rastreamento GPS**: Monitoramento da localização de profissionais.
*   **Materiais**: Controle de estoque e consumo de materiais.
*   **Notificações**: Envio e gestão de notificações.
*   **Pagamentos**: Registro e acompanhamento de transações financeiras.
*   **Planos**: Gerenciamento de planos de assinatura.
*   **Profissionais**: Cadastro e gestão de profissionais.
*   **Recorrências**: Configuração e gestão de agendamentos recorrentes.
*   **Relatórios**: Geração de relatórios detalhados.
*   **Avaliações**: Gestão de avaliações de serviços.
*   **Configurações**: Ajustes gerais da plataforma.
*   **Equipes**: Organização e gestão de equipes de trabalho.

### Interface da Empresa
*   **Agendamentos**: Criação e gestão de agendamentos para seus clientes.
*   **Cancelamentos**: Gerenciamento de cancelamentos de serviços.
*   **Chat**: Comunicação em tempo real com clientes e profissionais.
*   **Check-in/Check-out**: Acompanhamento de registros de entrada e saída dos profissionais.
*   **Clientes**: Gestão da base de clientes da empresa.
*   **Dashboard**: Visão geral das operações da empresa.
*   **Feedback**: Coleta e análise de feedback dos clientes.
*   **Rastreamento GPS**: Monitoramento de equipes em campo.
*   **Materiais**: Controle de materiais utilizados.
*   **Notificações**: Recebimento e gestão de notificações.
*   **Pagamentos**: Acompanhamento de pagamentos e faturamento.
*   **Plano**: Gerenciamento do plano de assinatura da empresa.
*   **Profissionais**: Gestão dos profissionais da empresa.
*   **Perfil**: Configurações de perfil da empresa.
*   **Relatórios**: Relatórios específicos para a empresa.
*   **Reagendamento**: Funcionalidade para reagendar serviços.
*   **Avaliações**: Acompanhamento das avaliações recebidas.
*   **Agenda**: Visualização e gestão da agenda de serviços.
*   **Equipes**: Organização e gestão das equipes de profissionais.

### Interface do Profissional
*   **Chat**: Comunicação com a empresa e clientes.
*   **Check-in/Check-out**: Registro de entrada e saída nos locais de serviço.
*   **Dashboard**: Visão geral das tarefas e desempenho.
*   **Feedback**: Envio de feedback sobre os serviços.
*   **Histórico**: Acompanhamento do histórico de serviços.
*   **Materiais**: Registro de materiais utilizados.
*   **Notificações**: Recebimento de notificações de agendamentos e atualizações.
*   **Desempenho**: Acompanhamento do próprio desempenho.
*   **Perfil**: Gerenciamento do perfil pessoal.
*   **Agenda**: Visualização da agenda de trabalho.

## Estrutura do Projeto

O projeto é organizado usando o App Router do Next.js, com as seguintes pastas principais:

*   `app/`: Contém as rotas e layouts para as interfaces de `admin`, `company` e `professional`, além das páginas de `login` e `register`.
*   `components/`: Componentes React reutilizáveis, incluindo componentes específicos para cada interface (ex: `admin/`, `company/`, `professional/`) e componentes de UI genéricos (`ui/`).
*   `contexts/`: Contextos React para gerenciamento de estado global, como autenticação e dados específicos de cada módulo.
*   `hooks/`: Hooks React personalizados para lógica reutilizável.
*   `lib/`: Funções utilitárias e APIs para interação com o backend.
*   `public/`: Ativos estáticos como imagens e ícones.
*   `styles/`: Arquivos de estilo globais.
*   `types/`: Definições de tipos TypeScript para o projeto.

## Como Começar

Siga estas instruções para configurar e executar o projeto localmente.

### Pré-requisitos

Certifique-se de ter o Node.js (versão 18.x ou superior) e um gerenciador de pacotes (npm, yarn ou pnpm) instalados em sua máquina.

### Instalação

1.  **Clone o repositório:**
    \`\`\`bash
    git clone https://github.com/brunomendes-8683s-projects/v0-noah-multi-empresas.git
    cd v0-noah-multi-empresas
    \`\`\`

2.  **Instale as dependências:**
    \`\`\`bash
    npm install
    # ou yarn install
    # ou pnpm install
    \`\`\`

### Executando o Servidor de Desenvolvimento

Para iniciar o servidor de desenvolvimento:

\`\`\`bash
npm run dev
# ou yarn dev
# ou pnpm dev
\`\`\`

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver a aplicação.

## Implantação

Este projeto está configurado para ser implantado na Vercel. Quaisquer alterações feitas e implantadas através do v0.dev serão automaticamente sincronizadas com este repositório e implantadas na Vercel.

Seu projeto está ativo em:

**[https://vercel.com/brunomendes-8683s-projects/v0-noah-multi-empresas](https://vercel.com/brunomendes-8683s-projects/v0-noah-multi-empresas)**

Continue construindo seu aplicativo em:

**[https://v0.dev/chat/projects/5MKu5ct9sJV](https://v0.dev/chat/projects/5MKu5ct9sJV)**

## Como Funciona

1.  Crie e modifique seu projeto usando [v0.dev](https://v0.dev)
2.  Implante seus chats a partir da interface v0
3.  As alterações são automaticamente enviadas para este repositório
4.  A Vercel implanta a versão mais recente deste repositório

## Contribuição

Contribuições são bem-vindas! Se você tiver sugestões ou encontrar problemas, sinta-se à vontade para abrir uma issue ou enviar um pull request.

## Licença

Este projeto é de código aberto e está disponível sob a licença MIT.
