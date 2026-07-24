const textosStatusMaquina = {
  em_operacao: "Em operação",
  em_manutencao: "Em manutenção",
  parada: "Parada",
  desativada: "Desativada"
};

const codigosStatusMaquina = {
  "em operação": "em_operacao",
  "em operacao": "em_operacao",
  em_operacao: "em_operacao",
  "em manutenção": "em_manutencao",
  "em manutencao": "em_manutencao",
  em_manutencao: "em_manutencao",
  parada: "parada",
  desativada: "desativada"
};

const textosRisco = {
  baixo: "Baixo",
  medio: "Médio",
  alto: "Alto",
  critico: "Crítico"
};

const codigosRisco = {
  baixo: "baixo",
  médio: "medio",
  medio: "medio",
  alto: "alto",
  crítico: "critico",
  critico: "critico"
};

const textosStatusOcorrencia = {
  aberta: "Aberta",
  em_analise: "Em análise",
  resolvida: "Resolvida"
};

const codigosStatusOcorrencia = {
  aberta: "aberta",
  "em análise": "em_analise",
  "em analise": "em_analise",
  em_analise: "em_analise",
  resolvida: "resolvida"
};

function normalizarTexto(valor) {
  return String(valor || "").trim().toLocaleLowerCase("pt-BR");
}

function converter(valor, opcoes, nome) {
  const convertido = opcoes[normalizarTexto(valor)];

  if (!convertido) {
    const erro = new Error(`${nome} inválido.`);
    erro.status = 400;
    throw erro;
  }

  return convertido;
}

export function statusMaquinaParaBanco(valor) {
  return converter(valor || "parada", codigosStatusMaquina, "Status");
}

export function statusMaquinaParaTela(valor) {
  return textosStatusMaquina[valor] || valor;
}

export function riscoParaBanco(valor) {
  return converter(valor, codigosRisco, "Nível de risco");
}

export function riscoParaTela(valor) {
  return textosRisco[valor] || valor;
}

export function statusOcorrenciaParaBanco(valor) {
  return converter(
    valor || "aberta",
    codigosStatusOcorrencia,
    "Status"
  );
}

export function statusOcorrenciaParaTela(valor) {
  return textosStatusOcorrencia[valor] || valor;
}
