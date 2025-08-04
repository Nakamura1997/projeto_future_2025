# 📦 Documentação do Frontend

Este documento descreve a estrutura, funcionamento e instruções de uso do frontend do projeto **2024_2_Future_Projeto_Avaliacao_Maturidade_Seguranca_PPSI**.

---

## 🧱 Tecnologias Utilizadas

- **Next.js** (React)
- **TypeScript**
- **Tailwind CSS**
- **Docker**
- **React Icons**

---

## 📁 Estrutura de Pastas

```plaintext
app-frontend/
├── src/
│   ├── app/                          # Rotas da aplicação (App Router)
│   │   ├── analista/                 # Área do analista
│   │   │   ├── analises/             # Listagem de análises
│   │   │   │   └── page.tsx          
│   │   │   ├── analiseDetalhada/     # Detalhes de análise (rota dinâmica)
│   │   │   │   └── [slug]/          
│   │   │   │       └── page.tsx      
│   │   │   └── relatorios/           # Relatórios
│   │   │       └── page.tsx          
│   │   │
│   │   ├── cliente/                  # Área do cliente
│   │   │   ├── formulario/           # Formulários
│   │   │   │   └── page.tsx          
│   │   │   ├── nist/                 # Framework NIST
│   │   │   │   └── page.tsx          
│   │   │   └── page.tsx              # Dashboard do cliente
│   │   │
│   │   ├── funcionario/              # Área do funcionário
│   │   │   ├── analises/             # Análises
│   │   │   │   └── page.tsx          
│   │   │   ├── relatorios/           # Relatórios
│   │   │   │   └── page.tsx          
│   │   │   └── page.tsx              # Dashboard do funcionário
│   │   │
│   │   ├── gestor/                   # Área do gestor
│   │   │   └── page.tsx              # Dashboard do gestor
│   │   │
│   │   └── login/                    # Autenticação
│   │       ├── layout.tsx            # Layout específico (ex: sem sidebar)
│   │       └── page.tsx              # Página de login
│   │
│   ├── assets/                       # Ícones, imagens, fonts
│   ├── components/                   # Componentes reutilizáveis
│   └── ...
├── Dockerfile            # Container do frontend
├── tailwind.config.js    # Configurações do Tailwind
├── package.json          # Dependências e scripts
└── README.md             # (Você está aqui!)

---

🗂️ Descrição das Páginas Principais
Rota	              | Função                           |	Componentes Associados
/analista	          | Dashboard do analista	         | Header, Sidebar, CardFormulario
/analista/analises	  | Listagem de análises	         | AnaliseDetail, FormSearch
/cliente/nist	      | Visualização do framework NIST   |	NistTable, RadarNistCaf
/login	              | Autenticação	                 | ErrorMessage, useLogin

---


⚙️ Como Rodar o Projeto
Localmente / Bash

# Instale as dependências
npm install

# Rode o projeto
npm run dev
---

🔁 Scripts Disponíveis
json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}


Este projeto foi desenvolvido pela equipe **Future** como parte da disciplina de **PPSI - Projeto de Avaliação de Maturidade em Segurança**, 2024.2.

-- 

descrição nas paginas:
Página cliente:
print da página (Após o print da imagem, descrever a página)


Página do formulario:
print da página (Após o print da imagem, descrever a página)


Caminho do código:
xxxxxxxxxxxxxxxxxxx


Descrição dos componentes:
xxxxxxxxxxxxxxxxxxxxxxxx