# Frontend EcoCompany — React

Aplicação React com cinco rotas: Visão Geral, Máquinas, Produção, Sustentabilidade e Segurança do Trabalho. O projeto utiliza Vite, React Router e CSS separado na pasta `css`.

## Executar localmente

Instale as dependências e inicie o ambiente de desenvolvimento:

```bash
npm install
npm run dev
```

O projeto está temporariamente configurado para usar os arrays de teste de `src/data/mockData.js`, sem depender do backend. Os registros adicionados, editados ou excluídos ficam em memória até a página ser recarregada.

Para definir a URL do backend durante o desenvolvimento, copie `.env.example` para `.env` e altere `VITE_API_URL`.

## Retomar o backend

A integração original continua preservada em `src/services/api.js`. Para desativar os arrays e voltar às requisições HTTP, defina no arquivo `.env`:

```env
VITE_USE_MOCK_DATA=false
VITE_API_URL=http://localhost:3000
```

Depois, reinicie o ambiente de desenvolvimento.

Para usar outra URL sem alterar os arquivos, execute no console do navegador:

```js
localStorage.setItem("ecocompany_api_url", "http://localhost:8080");
location.reload();
```

Para voltar ao endereço padrão:

```js
localStorage.removeItem("ecocompany_api_url");
location.reload();
```

## Contrato esperado do backend

- `GET /health` — verificação de conexão.
- `GET|POST /api/maquinas` e `PUT|DELETE /api/maquinas/:id`.
- `GET|POST /api/producoes` e `PUT|DELETE /api/producoes/:id`.
- `GET|POST /api/sustentabilidade` e `PUT|DELETE /api/sustentabilidade/:id`.
- `GET|POST /api/seguranca` e `PUT|DELETE /api/seguranca/:id`.

As listagens podem retornar um array diretamente ou um objeto com o array em `data`, `records`, `items`, `content` ou `result`. Cada registro deve trazer `id` (também são aceitos `_id`, `codigo` ou `uuid`).

No modo temporário, o ponto no rodapé lateral fica amarelo e informa “Modo de teste local”. Com `VITE_USE_MOCK_DATA=false`, ele volta a ficar verde quando o backend responde e vermelho quando está indisponível.

## Rotas

- `/visao-geral`
- `/maquinas`
- `/producao`
- `/sustentabilidade`
- `/seguranca`

## Gerar versão de produção

```bash
npm run build
```
