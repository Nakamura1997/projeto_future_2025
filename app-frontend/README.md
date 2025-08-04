# Sistema de Avaliação NIST CSF 2.0

Sistema web para avaliação de maturidade em segurança da informação baseado no framework NIST CSF 2.0.

## 🚀 Tecnologias

- **Next.js 15** - Framework React para produção
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Vitest** - Framework de testes
- **Recharts** - Biblioteca de gráficos
- **TipTap** - Editor de texto rico
- **Jotai** - Gerenciamento de estado

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Backend API rodando (veja documentação da API)

## 🔧 Instalação

1. Clone o repositório:
\`\`\`bash
git clone <url-do-repositorio>
cd app-frontend
\`\`\`

2. Instale as dependências:
\`\`\`bash
npm install
\`\`\`

3. Configure as variáveis de ambiente:
\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Edite o arquivo \`.env.local\` com suas configurações.

## 🚀 Executando o projeto

### Desenvolvimento
\`\`\`bash
npm run dev
\`\`\`

### Produção
\`\`\`bash
npm run build
npm start
\`\`\`

### Testes
\`\`\`bash
# Executar todos os testes
npm test

# Executar testes com cobertura
npm run test:coverage

# Executar testes em modo watch
npm run test:watch

# Interface visual dos testes
npm run test:ui
\`\`\`

## 📁 Estrutura do Projeto

\`\`\`
src/
├── app/                 # Páginas do Next.js 13+ (App Router)
├── components/          # Componentes reutilizáveis
├── hooks/              # Hooks customizados
├── lib/                # Bibliotecas e configurações
├── state/              # Gerenciamento de estado (Jotai)
├── test/               # Testes
├── util/               # Utilitários
└── types/              # Definições de tipos TypeScript
\`\`\`

## 🔐 Funcionalidades

- **Autenticação**: Login/logout com JWT
- **Formulários**: Questionários baseados no NIST CSF 2.0
- **Análises**: Visualização de resultados em gráficos
- **Relatórios**: Geração de relatórios em PDF
- **Planos de Ação**: Recomendações de melhorias
- **Gestão de Usuários**: Diferentes perfis (Cliente, Analista, Gestor)

## 🧪 Testes

O projeto utiliza Vitest para testes unitários e de integração:

- **Componentes**: Testes de renderização e interação
- **Hooks**: Testes de lógica de negócio
- **Utilitários**: Testes de funções auxiliares

### Cobertura de Testes

Meta de cobertura: 80%
- Linhas: 80%
- Funções: 80%
- Branches: 80%
- Statements: 80%

## 🔧 Scripts Disponíveis

- \`npm run dev\` - Inicia servidor de desenvolvimento
- \`npm run build\` - Gera build de produção
- \`npm start\` - Inicia servidor de produção
- \`npm test\` - Executa testes
- \`npm run test:coverage\` - Executa testes com cobertura
- \`npm run test:watch\` - Executa testes em modo watch
- \`npm run test:ui\` - Interface visual dos testes

## 🌐 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Docker
\`\`\`bash
# Build da imagem
docker build -t nist-frontend .

# Executar container
docker run -p 3000:3000 nist-frontend
\`\`\`

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (\`git checkout -b feature/AmazingFeature\`)
3. Commit suas mudanças (\`git commit -m 'Add some AmazingFeature'\`)
4. Push para a branch (\`git push origin feature/AmazingFeature\`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

Para suporte, entre em contato através do email: suporte@future.com.br

## 🔗 Links Úteis

- [Documentação do NIST CSF 2.0](https://www.nist.gov/cyberframework)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vitest](https://vitest.dev/)

