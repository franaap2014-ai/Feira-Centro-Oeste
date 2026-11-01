# Publicar o site gratuito da Feira Cultural CSA 2026

## O que está pronto

- Página inicial rosa e quiz de 5 perguntas aleatórias de 5 categorias (40 no banco)
- Gabarito de acertos, erros e explicações
- Imagens SVG originais e áudio opcional
- Painel ADM com histórico e edição das questões (exige duas contas Supabase autorizadas)
- `npm run build` gera `dist/` apenas com arquivos públicos necessários

## Passo 1: criar o repositório GitHub

**Conexão ChatGPT/GitHub atual não permite criar repositórios.** Há duas formas gratuitas:

**Opção A: na conta GitHub pelo navegador:** [github.com/new](https://github.com/new), nome `feira-cultural-csa-2026`, depois extraia este ZIP e envie os arquivos da pasta do projeto (não o ZIP) para a branch `main`. Não envie senhas ou chaves secretas.

**Opção B: pelo Windows:** instale Git e GitHub CLI (ambos gratuitos), extraia a pasta e execute `PUBLICAR-GITHUB.ps1` numa janela do PowerShell. O script verifica a conta autenticada (`franaap2014-ai`), cria o repositório privado gratuito e envia o código. Não usa senhas ou tokens escritos no script.

## Passo 2: Render (Static Site gratuito)

Entre em [dashboard.render.com/static/new](https://dashboard.render.com/static/new), conecte o GitHub e selecione `franaap2014-ai/feira-cultural-csa-2026`.

- Branch: `main`
- Build command: `npm run build`
- Publish directory: `dist`
- Nome: `feira-cultural-csa-2026`

Crie **Static Site**, não Web Service pago. O Render fornece endereço `onrender.com` após a implantação. Verifique as telas de jogo, gabarito e painel antes de usar o link com visitantes.

## Passo 3: configurar contas Supabase

Projeto existente: https://supabase.com/dashboard/project/ejnkyxgbvrmqvhzhnpke

Em **Authentication > Users**, cadastre as contas de ADM e operador com os e-mails que pretende usar. Crie as senhas lá, nunca neste chat nem no repositório.

Depois de criar as contas, execute no SQL Editor, substituindo ambos os e-mails:

```sql
insert into public.quiz_roles(user_id,role)
select id,'admin' from auth.users where email='EMAIL_ADMIN'
on conflict (user_id) do update set role='admin';

insert into public.quiz_roles(user_id,role)
select id,'operator' from auth.users where email='EMAIL_FEIRA'
on conflict (user_id) do update set role='operator';
```

**Atenção:** Nenhuma conta ADM/operador foi cadastrada automaticamente. O banco supabase já possui as três tabelas RLS. Os arquivos `supabase.sql` e `supabase-v3.sql` são documentação das migrações já aplicadas e não devem ser executados novamente às cegas.

## Neon

O projeto Neon gratuito `flat-flower-93468199` guarda um registro técnico do projeto. **Não é conectado automaticamente ao banco de partidas.** O Supabase é a fonte principal dos resultados e das edições das perguntas.

## Testes executados

- `npm test`: 40 perguntas e 1.200 partidas simuladas aprovadas.
- `npm run build`: versão estática montada com sucesso.
- Teste de interface em Chromium, desktop 1366x768 e celular 390x844, com backend simulado: 5 questões de temas distintos, 4 opções por questão, gabarito de 5 entradas, reinício, modal de login, sem erros JavaScript e sem rolagem horizontal.
- O ambiente impede navegação para servidor HTTP local; os testes visuais usaram HTML e JavaScript incorporados para simular a interface.
- **Não foram feitos** testes de autenticação Supabase real, gravação online ou acesso ao site público Render: dependem de publicação e cadastro das contas.

## Custo

GitHub privado gratuito, Render Static Site, Supabase Free e Neon Free podem ser usados sem pagar, respeitando os limites e condições vigentes de cada plano. Não escolher opções pagas nem inserir dados de cartão para esse fluxo.
