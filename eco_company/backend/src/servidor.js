import aplicacao from "./aplicacao.js";

const porta = Number(process.env.PORTA || 3000);

aplicacao.listen(porta, () => {
  console.log(
    `EcoCompany API disponível em http://localhost:${porta}`
  );
});