# Controle Financeiro V2 — PWA + Login + Supabase

Esta é a V2 do projeto, agora preparada para:
- login com e-mail e senha
- dashboard inicial
- seletor por mês
- estrutura PWA (instalável no iPhone/Android)
- conexão com Supabase

## Variáveis de ambiente
Crie um arquivo `.env.local` com:

```env
NEXT_PUBLIC_SUPABASE_URL=https://mkzvxbttqakycbzycsnl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_jXp0z-MrX44FP4_cXJPoFQ_ANYPUOlS
```

## Rodar localmente
```bash
npm install
npm run dev
```

## Deploy
Suba os arquivos no GitHub e deixe a Vercel atualizar automaticamente.

## Próximo passo após deploy
No iPhone:
Safari → Compartilhar → Adicionar à Tela de Início
