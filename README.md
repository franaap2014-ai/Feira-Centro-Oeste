# Feira Cultural CSA 2026 — Quiz Centro-Oeste (v3)

Site gratuito, responsivo e sem cadastro para visitantes, com **40 perguntas em 5 temas**, 5 questões por rodada (uma de cada categoria), 4 alternativas e ordem aleatória. São 6 ilustrações SVG feitas para o projeto, música ambiente original opcional e **gabarito após a quinta resposta**.

## Arquitetura

- **Frontend:** HTML/CSS/JavaScript puro, sem ferramentas pagas ou builds complexos.
- **Hospedagem:** Render Static Site (plano gratuito, requer repositório Git válido).
- **Resultados, login e edições:** Supabase Free já criado (`ejnkyxgbvrmqvhzhnpke`). Login via Supabase Auth e papéis no banco com RLS.
- **Neon:** projeto Free separado (`flat-flower-93468199`) reservado para documentação/histórico técnico. **Não é o banco primário do jogo nem está sincronizado automaticamente com o Supabase.** Não grave a mesma partida em dois bancos sem configurar sincronização consistente.
- **GitHub:** repositório exclusivo ainda precisa ser criado pela conta do proprietário e ligado ao Render.

## Funcionalidades

1. O visitante clica **Jogar agora** e responde 5 perguntas. Nenhum login é necessário.
2. Ao final vê pontuação e **gabarito completo**: sua resposta, resposta correta e explicação por pergunta.
3. O sistema grava a partida, data/hora, pontuação, identificadores e uma fotografia dos enunciados, alternativas e gabaritos **como eram no momento em que a partida foi realizada**.
4. O painel ADM tem abas **Resultados** e **Banco de perguntas (40)**; histórico com paginação sem corte artificial em 100 entradas, filtros feira/teste/todas, detalhes e exportação CSV.
5. O ADM edita o texto, alternativas, gabarito, explicação e escolhe uma das seis ilustrações disponíveis. As alterações são persistidas em `quiz_question_overrides` no Supabase e aplicadas a novas partidas.
6. As 40 questões originais ficam em `questions.js`; o banco online armazena as alterações. Isso impede que edições destruam a estrutura de uma questão por tema e permite funcionamento básico local se necessário.
7. O modo de teste da conta ADM é separado dos resultados da feira. A conta de operador inicia o jogo no modo feira.

## Para executar no computador

```sh
npm test
python -m http.server 3000
```

Abra `http://localhost:3000` (ou outro servidor HTTP estático). Execute `npm run build` para gerar `dist/`, que é a única pasta publicada no Render. Não abra como `file://`: módulos ES e políticas do navegador exigem servidor HTTP.

## Preparação do Supabase

O Supabase já recebeu a primeira migração (roles e attempts), e a migração de alterações de questões e snapshot foi aplicada. O arquivo `supabase-v3.sql` documenta a alteração; **não reaplique indiscriminadamente o mesmo SQL**, pois políticas com o mesmo nome já existem.

1. No dashboard Supabase do projeto, abra **Authentication > Users** e crie as **duas contas**, usando os dois e-mails que você escolheu: sua conta ADM e a conta do estande. Defina senhas diretamente no Supabase. Não compartilhe senhas em mensagens.
2. Com ambas as contas criadas, abra **SQL Editor** e aplique (substituindo os e-mails pelos corretos):

```sql
insert into public.quiz_roles(user_id,role)
select id,'admin' from auth.users where email='SEU_EMAIL_ADMIN_AQUI'
on conflict (user_id) do update set role='admin';
insert into public.quiz_roles(user_id,role)
select id,'operator' from auth.users where email='EMAIL_FEIRA_AQUI'
on conflict (user_id) do update set role='operator';
```

**Segurança:** nunca coloque chaves `service_role`, chaves secretas ou senhas em `config.js`, GitHub ou frontend. Apenas a `publishable key` pública está presente no projeto. As políticas RLS limitam a edição de perguntas e consulta de resultados a usuários ADM.

## Publicar no Render Free

A conexão GitHub disponível neste chat não oferece a ação de criação de repositórios. Crie o repositório **`feira-cultural-csa-2026`** no seu GitHub (novo e próprio; não reaproveite outros projetos), então envie estes arquivos para a branch `main`.

No Render use **New > Static Site**, selecione o repositório e defina:

- **Build Command:** `npm run build`
- **Publish Directory:** `dist`
- **Branch:** `main`
- **Tipo:** Static Site, gratuito

O `render.yaml` oferece configuração compatível. Antes de apresentar na feira, entre no ADM, cadastre os papéis, teste as alterações e confirme que as participações de teste não entram na contagem da feira.

## Alertas de operação

- Visitantes não precisam informar nomes, e-mails ou dados pessoais.
- A gravação depende de conexão com Supabase; se cair a internet, o jogo e o gabarito permanecem, mas a tentativa pode não ser registrada. A interface avisa quando isso ocorre.
- O cadastro de usuários no Supabase pode exigir confirmação por e-mail. Faça esse teste antes da feira.
- O site é um projeto escolar e precisa de teste real em celulares, tablets e no computador do estande antes da apresentação.
- Hospedagem gratuita possui limites de uso. Não foi contratado serviço pago.

## Publicação atual

Veja [PUBLICACAO.md](PUBLICACAO.md) para instruções gratuitas. O arquivo `PUBLICAR-GITHUB.ps1` automatiza a criação e o envio do repositório na conta autenticada do Windows (quando Git e GitHub CLI estão instalados).
