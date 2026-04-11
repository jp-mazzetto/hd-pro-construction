# Plano MD: Migração para TanStack Router + TanStack Query

## Resumo
Criar o documento com um plano executável de migração **big bang** para substituir `react-router-dom` por **TanStack Router (code-based)** e implantar **cache global equilibrado** com TanStack Query, mantendo o prerender atual (`/`, `/services`, `/plans`, `/404`) funcionando na primeira entrega.

## Mudanças de implementação (definição fechada)
1. O arquivo deve abrir com objetivo, escopo e critérios de sucesso.
2. O plano deve fixar as dependências exatas a adicionar/remover.
3. Deve definir remover `react-router-dom` e adotar `@tanstack/react-router` e `@tanstack/react-query`.
4. Deve manter as mesmas URLs públicas e privadas já existentes.
5. Deve definir migração de roteamento em modo code-based com árvore explícita de rotas e lazy pages.
6. Deve definir que os guards de auth/admin permanecem no nível de layout (mesma estratégia atual), para reduzir risco funcional na troca de router.
7. Deve definir adaptação de `Link`, `Navigate`, `Outlet`, `useNavigate`, `useLocation`, `useParams` e `useSearchParams` para APIs do TanStack Router, preservando comportamento atual de querystring e redirects.
8. Deve definir ajuste do prerender para TanStack Router com history em memória e render server-side por rota, mantendo SEO/head existentes.
9. Deve definir criação de `QueryClient` global com `QueryClientProvider` no bootstrap da app.
10. Deve definir política de cache inicial.
11. Sessão (`/api/auth/me`): `staleTime` curto (ex.: 2 min), sem retry para 401.
12. Planos e termos: `staleTime` longo (ex.: 1h).
13. Dados de dashboard (subscriptions, properties, billing, visits, referral): `staleTime` médio (ex.: 30–60s).
14. Deve definir query keys centralizadas por domínio (`auth`, `plans`, `terms`, `subscriptions`, `properties`, `billing`, `visits`, `referral`).
15. Deve definir regras de invalidação de cache por mutação.
16. Login/logout/register: invalidar `auth` e dados privados.
17. CRUD de property: invalidar `properties` e consultas dependentes de subscriptions.
18. Checkout/verify/resume/cancel: invalidar `subscriptions`, `billing`, `visits`.
19. Referral generate/apply: invalidar `referral`.
20. Deve definir migração dos pontos de fetch atuais baseados em `useEffect` para `useQuery`/`useMutation`, priorizando hooks compartilhados (`useAuthSession`, `useCurrentActiveSubscription`, checkout/contract handlers) e depois páginas de dashboard.
21. Deve definir rollout em fases internas do mesmo PR big bang.
22. Fase A: infraestrutura router/query.
23. Fase B: migração de hooks centrais de auth e subscription.
24. Fase C: migração de páginas de dashboard e fluxos de checkout/contract.
25. Fase D: limpeza final e remoção de imports legados.

## APIs/interfaces públicas que o plano deve registrar
- Rotas e paths não mudam.
- `useAppHandlers` mantém assinatura externa.
- Contrato de `auth-client` e `dashboard-client` não muda; muda apenas o consumo com TanStack Query.
- Sem persistência de cache nesta primeira versão.
- Sem alterações de backend nesta migração.

## Plano de testes e aceitação
1. `npm run typecheck`, `npm run lint`, `npm run build` devem passar.
2. Prerender deve gerar corretamente `/`, `/services`, `/plans`, `/404`.
3. Fluxo anônimo: navegação pública e query params de auth continuam funcionando.
4. Fluxo autenticado USER: acesso a `/dashboard/*` normal e bloqueio de `/admin`.
5. Fluxo ADMIN: redirecionamento para `/admin` preservado.
6. Checkout/contract/success/cancel: leitura de search params e redirecionamentos mantidos.
7. Dashboard: dados carregam por query cache; mutações refletem após invalidação sem reload manual.
8. Verificação de redução de chamadas repetidas: sessão, planos e subscriptions não devem refetchar desnecessariamente na navegação interna.

## Assumptions e defaults
- Estratégia: big bang.
- Router: TanStack code-based.
- Cache: global equilibrado, sem persistência local.
- Prerender: obrigatório manter já na primeira entrega.
- Local do documento: `web/docs/tanstack-migration.md`.
