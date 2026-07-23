export const modulos = {
  maquinas: {
    recurso: "maquinas",
    titulo: "Máquinas",
    subtitulo: "Cadastre e acompanhe os equipamentos da indústria.",
    iconeVazio: "⚙",
    colunas: [
      { chave: "nome", rotulo: "Nome", classeCss: "nome-maquina" },
      { chave: "setor", rotulo: "Setor" },
      { chave: "tipo", rotulo: "Tipo" },
      { chave: "status", rotulo: "Status", etiqueta: true },
      { chave: "energia", rotulo: "Energia", sufixo: "kWh" },
      { chave: "temperatura", rotulo: "Temperatura", sufixo: "°C" }
    ],
    campos: [
      { chave: "nome", rotulo: "Nome" },
      { chave: "setor", rotulo: "Setor" },
      { chave: "tipo", rotulo: "Tipo" },
      {
        chave: "status",
        rotulo: "Status",
        tipo: "select",
        opcoes: ["Em operação", "Em manutenção", "Parada"]
      },
      {
        chave: "energia",
        rotulo: "Consumo de energia (kWh)",
        tipo: "number",
        passo: "0.01"
      },
      {
        chave: "temperatura",
        rotulo: "Temperatura (°C)",
        tipo: "number",
        passo: "0.1"
      }
    ]
  },

  producoes: {
    recurso: "producoes",
    titulo: "Produção",
    subtitulo: "Registre metas, resultados e produções.",
    iconeVazio: "▤",
    colunas: [
      { chave: "data", rotulo: "Data", formato: "data" },
      { chave: "produto", rotulo: "Produto" },
      {
        chave: "maquina",
        rotulo: "Máquina",
        apelidos: ["maquinaNome", "equipamento"]
      },
      {
        chave: "produzido",
        rotulo: "Produzido",
        apelidos: ["quantidadeProduzida"]
      },
      {
        chave: "esperado",
        rotulo: "Esperado",
        apelidos: ["meta"]
      },
      {
        chave: "produtividade",
        rotulo: "Produtividade",
        formato: "produtividade",
        classeCss: "valor-produtividade"
      }
    ],
    campos: [
      { chave: "data", rotulo: "Data", tipo: "date" },
      { chave: "produto", rotulo: "Produto" },
      { chave: "maquina", rotulo: "Máquina" },
      {
        chave: "produzido",
        rotulo: "Quantidade produzida",
        tipo: "number",
        passo: "1"
      },
      {
        chave: "esperado",
        rotulo: "Quantidade esperada",
        tipo: "number",
        passo: "1"
      }
    ]
  },

  sustentabilidade: {
    recurso: "sustentabilidade",
    titulo: "Sustentabilidade",
    subtitulo: "Monitore consumo, resíduos e reciclagem.",
    iconeVazio: "♻",
    colunas: [
      { chave: "data", rotulo: "Data", formato: "data" },
      {
        chave: "energia",
        rotulo: "Energia",
        apelidos: ["energiaConsumida"],
        sufixo: "kWh"
      },
      {
        chave: "agua",
        rotulo: "Água",
        apelidos: ["aguaConsumida"],
        sufixo: "L"
      },
      {
        chave: "residuos",
        rotulo: "Resíduos",
        apelidos: ["residuosGerados"],
        sufixo: "kg"
      },
      {
        chave: "reciclado",
        rotulo: "Reciclado",
        apelidos: ["residuosReciclados"],
        sufixo: "kg"
      },
      {
        chave: "taxa",
        rotulo: "Taxa",
        apelidos: ["taxaReciclagem"],
        formato: "taxaReciclagem",
        classeCss: "taxa-reciclagem"
      }
    ],
    campos: [
      { chave: "data", rotulo: "Data", tipo: "date" },
      {
        chave: "energia",
        rotulo: "Energia consumida (kWh)",
        tipo: "number",
        passo: "0.01"
      },
      {
        chave: "agua",
        rotulo: "Água consumida (L)",
        tipo: "number",
        passo: "0.01"
      },
      {
        chave: "residuos",
        rotulo: "Resíduos gerados (kg)",
        tipo: "number",
        passo: "0.01"
      },
      {
        chave: "reciclado",
        rotulo: "Resíduos reciclados (kg)",
        tipo: "number",
        passo: "0.01"
      },
      {
        chave: "taxa",
        rotulo: "Taxa de reciclagem (%)",
        tipo: "number",
        passo: "0.01",
        obrigatorio: false
      }
    ]
  },

  seguranca: {
    recurso: "seguranca",
    titulo: "Segurança do Trabalho",
    subtitulo: "Registre riscos, ocorrências e medidas preventivas.",
    iconeVazio: "◇",
    colunas: [
      { chave: "data", rotulo: "Data", formato: "data" },
      { chave: "tipo", rotulo: "Tipo" },
      { chave: "local", rotulo: "Local" },
      {
        chave: "risco",
        rotulo: "Risco",
        apelidos: ["nivelRisco"]
      },
      { chave: "status", rotulo: "Status", etiqueta: true },
      { chave: "descricao", rotulo: "Descrição" }
    ],
    campos: [
      { chave: "data", rotulo: "Data", tipo: "date" },
      { chave: "tipo", rotulo: "Tipo da ocorrência" },
      { chave: "local", rotulo: "Local" },
      {
        chave: "risco",
        rotulo: "Nível de risco",
        tipo: "select",
        opcoes: ["Baixo", "Médio", "Alto", "Crítico"]
      },
      {
        chave: "status",
        rotulo: "Status",
        tipo: "select",
        opcoes: ["Aberta", "Em análise", "Resolvida"]
      },
      {
        chave: "descricao",
        rotulo: "Descrição",
        tipo: "textarea",
        larguraTotal: true
      }
    ]
  }
};
