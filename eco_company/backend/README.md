# Backend EcoCompany

API REST em JavaScript com Express e MySQL.

## Preparação

1. Execute `../database/schema.sql` no MySQL Workbench.
2. Copie `.env.example` para `.env`.
3. Informe o usuário e a senha do MySQL no `.env`.
4. Instale as dependências e inicie a API:

```bash
npm install
npm run dev
```

A API será iniciada em `http://localhost:3000`.

## Endpoints

- `GET /health`
- `GET|POST /api/maquinas`
- `PUT|DELETE /api/maquinas/:id`
- `GET|POST /api/producoes`
- `PUT|DELETE /api/producoes/:id`
- `GET|POST /api/sustentabilidade`
- `PUT|DELETE /api/sustentabilidade/:id`
- `GET|POST /api/seguranca`
- `PUT|DELETE /api/seguranca/:id`

Os nomes das propriedades retornadas seguem o formato esperado pelo
frontend. Os códigos internos de status e risco são convertidos
automaticamente.
