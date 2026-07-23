# Frontend EcoCompany — React

Aplicação React com cinco rotas: Visão Geral, Máquinas, Produção, Sustentabilidade e Segurança do Trabalho. O projeto utiliza Vite, React Router e CSS separado na pasta `css`.

## Executar localmente

Instale as dependências e inicie o ambiente de desenvolvimento:

```bash
npm install
npm run dev
```

O frontend tenta se conectar, por padrão, a `http://localhost:3000`. Para definir outra URL, copie `.env.example` para `.env` e altere `VITE_API_URL`.

Também é possível trocar a URL pelo console do navegador:

```js
localStorage.setItem("ecocompany_api_url", "http://localhost:8080");
location.reload();
```

Para voltar ao endereço configurado no projeto:

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

As listagens podem retornar um array diretamente ou um objeto com o array em `data`, `records`, `items`, `content` ou `result`. Cada registro deve trazer `id` — também são aceitos `_id`, `codigo` ou `uuid`.

O ponto no rodapé lateral fica verde quando o backend responde e vermelho quando está indisponível. A verificação é repetida a cada 15 segundos.

## Organização do código

- `src/componentes`: componentes reutilizáveis da interface.
- `src/dados`: configurações dos módulos e formulários.
- `src/paginas`: páginas completas da aplicação.
- `src/servicos`: comunicação com o backend.
- `css`: estilos gerais e estilos específicos de cada módulo.

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
