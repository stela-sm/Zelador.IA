# 🏙️ Zelador.IA

Plataforma web de zeladoria urbana onde cidadãos podem registrar problemas da cidade através de um chatbot inteligente.

## 🚀 Demo

🔗 [zelador-ia-gszv.vercel.app](https://zelador-ia-gszv.vercel.app)

## ✨ Funcionalidades

- **Chatbot guiado** — Coleta nome, telefone, email e descrição do problema em etapas simples
- **Upload de imagem** — Cidadão pode enviar foto do problema
- **Classificação por IA** — Groq classifica automaticamente a categoria do problema (buraco, poste, vazamento, etc)
- **Número de protocolo** — Gerado automaticamente ao registrar o chamado
- **Painel Administrativo** — Visualização, alteração de status e imagens dos chamados
- **Notificação por email** — Cidadão recebe email ao ter o status do chamado atualizado

## 🛠️ Tecnologias

### Frontend
- React + Vite
- TailwindCSS
- React Router DOM

### Backend
- Node.js + Express
- Supabase (banco de dados + storage de imagens)
- Groq API (classificação automática via IA — llama-3.3-70b)
- Resend (envio de emails)

### Deploy
- Frontend: [Vercel](https://vercel.com)
- Backend: [Render](https://render.com)

## 📁 Estrutura do Projeto

```
Zelador.IA/
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── Home.jsx        # Landing page
│       │   ├── Chat.jsx        # Chatbot
│       │   └── Admin.jsx       # Painel administrativo
│       ├── services/
│       │   └── api.js          # Chamadas para o backend
│       └── App.jsx
└── backend/
    ├── src/
    │   ├── controllers/
    │   │   ├── chamado.controller.js
    │   │   └── upload.controller.js
    │   ├── routes/
    │   │   ├── chamado.routes.js
    │   │   └── upload.routes.js
    │   ├── models/
    │   │   └── chamado.model.js
    │   ├── lib/
    │   │   ├── supabase.js
    │   │   ├── groq.js
    │   │   └── mailer.js
    │   ├── middleware/
    │   │   └── auth.js
    │   └── app.js
    └── index.js
```


## 🌐 URLs de Produção

| Serviço | URL |
|---------|-----|
| Frontend | https://zelador-ia-gszv.vercel.app |
| Backend | https://zelador-ia.onrender.com |

## 🔐 Segurança

- Chaves de API armazenadas em variáveis de ambiente (nunca no código)
- Rotas administrativas protegidas por `x-admin-secret` no header
- `SUPABASE_SERVICE_ROLE_KEY` utilizada apenas no backend

## 📋 Status dos Chamados

| Status | Descrição |
|--------|-----------|
| `aberto` | Chamado recém registrado |
| `em_andamento` | Em análise ou execução |
| `resolvido` | Problema resolvido |

## 📬 Notificações

Ao alterar o status de um chamado, o cidadão recebe automaticamente um email com o protocolo e o novo status.

## 🗺️ Rotas da API

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | `/api/chamados` | Criar chamado | ❌ |
| GET | `/api/chamados` | Listar chamados | ✅ |
| GET | `/api/chamados/:id` | Buscar chamado | ✅ |
| PATCH | `/api/chamados/:id/status` | Atualizar status | ✅ |
| DELETE | `/api/chamados/:id` | Deletar chamado | ✅ |
| POST | `/api/upload` | Upload de imagem | ❌ |

> ✅ Requer header `x-admin-secret` com a senha configurada no `.env`

## 👤 Autor

Desenvolvido por [@stela-sm](https://github.com/stela-sm)
