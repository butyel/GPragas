# GPRAGAS - Sistema de Gestão para Controle de Pragas

Plataforma SaaS multi-tenant completa para empresas de controle de pragas urbanas no Brasil.

## 🚀 Quick Start

### Pré-requisitos
- Node.js 18+
- PostgreSQL (Supabase)
- npm ou yarn

### Configuração do Backend (Web)

```bash
cd web
npm install
npm run dev
```

Acesse: http://localhost:3000

### Configuração do App Mobile

```bash
cd mobile
npm install
npm run start
```

## 📁 Estrutura do Projeto

```
GPRAGAS/
├── docs/               # Documentação
│   ├── schema.sql      # Schema do banco de dados
│   └── SPEC.md         # Especificação técnica
├── web/                # Aplicação Web (Next.js 14)
│   ├── src/
│   │   ├── app/        # Páginas e layouts
│   │   ├── components/ # Componentes UI
│   │   ├── lib/        # Utilitários e configurações
│   │   └── types/      # TypeScript types
│   └── package.json
└── mobile/             # App Mobile (React Native/Expo)
    ├── app/            # Telas e navegação
    ├── constants/      # Constantes e temas
    └── package.json
```

## 🎯 Funcionalidades MVP

- [x] Autenticação multi-tenant
- [x] Dashboard com KPIs
- [x] Gestão de clientes (CRM)
- [x] Ordens de Serviço (OS)
- [x] Agenda visual (calendário)
- [x] Laudos técnicos em PDF
- [x] App mobile para técnicos

## 🛠️ Stack Tecnológica

| Componente | Tecnologia |
|------------|------------|
| Frontend Web | Next.js 14 + Tailwind + shadcn/ui |
| Mobile | React Native (Expo) |
| Backend | Next.js API Routes |
| Banco de Dados | PostgreSQL (Supabase) |
| Autenticação | Supabase Auth |
| Armazenamento | Supabase Storage |

## 📝 Variáveis de Ambiente

Crie um arquivo `.env.local` no diretório `web/`:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon
```

## 📄 Licença

MIT © 2026 GPRAGAS