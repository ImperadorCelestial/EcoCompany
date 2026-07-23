export const modules = {
  maquinas: {
    resource: "maquinas",
    title: "Máquinas",
    subtitle: "Cadastre e acompanhe os equipamentos da indústria.",
    emptyIcon: "⚙",
    columns: [
      { key: "nome", label: "Nome", className: "machine-name" },
      { key: "setor", label: "Setor" },
      { key: "tipo", label: "Tipo" },
      { key: "status", label: "Status", badge: true },
      { key: "energia", label: "Energia", suffix: "kWh" },
      { key: "temperatura", label: "Temperatura", suffix: "°C" }
    ],
    fields: [
      { key: "nome", label: "Nome" },
      { key: "setor", label: "Setor" },
      { key: "tipo", label: "Tipo" },
      { key: "status", label: "Status", type: "select", options: ["Em operação", "Em manutenção", "Parada"] },
      { key: "energia", label: "Consumo de energia (kWh)", type: "number", step: "0.01" },
      { key: "temperatura", label: "Temperatura (°C)", type: "number", step: "0.1" }
    ]
  },
  producoes: {
    resource: "producoes",
    title: "Produção",
    subtitle: "Registre metas, resultados e produções.",
    emptyIcon: "▤",
    columns: [
      { key: "data", label: "Data", format: "date" },
      { key: "produto", label: "Produto" },
      { key: "maquina", label: "Máquina", aliases: ["maquinaNome", "equipamento"] },
      { key: "produzido", label: "Produzido", aliases: ["quantidadeProduzida"] },
      { key: "esperado", label: "Esperado", aliases: ["meta"] },
      { key: "produtividade", label: "Produtividade", format: "productivity", className: "productivity-value" }
    ],
    fields: [
      { key: "data", label: "Data", type: "date" },
      { key: "produto", label: "Produto" },
      { key: "maquina", label: "Máquina" },
      { key: "produzido", label: "Quantidade produzida", type: "number", step: "1" },
      { key: "esperado", label: "Quantidade esperada", type: "number", step: "1" }
    ]
  },
  sustentabilidade: {
    resource: "sustentabilidade",
    title: "Sustentabilidade",
    subtitle: "Monitore consumo, resíduos e reciclagem.",
    emptyIcon: "♻",
    columns: [
      { key: "data", label: "Data", format: "date" },
      { key: "energia", label: "Energia", aliases: ["energiaConsumida"], suffix: "kWh" },
      { key: "agua", label: "Água", aliases: ["aguaConsumida"], suffix: "L" },
      { key: "residuos", label: "Resíduos", aliases: ["residuosGerados"], suffix: "kg" },
      { key: "reciclado", label: "Reciclado", aliases: ["residuosReciclados"], suffix: "kg" },
      { key: "taxa", label: "Taxa", aliases: ["taxaReciclagem"], format: "recycleRate", className: "recycle-rate" }
    ],
    fields: [
      { key: "data", label: "Data", type: "date" },
      { key: "energia", label: "Energia consumida (kWh)", type: "number", step: "0.01" },
      { key: "agua", label: "Água consumida (L)", type: "number", step: "0.01" },
      { key: "residuos", label: "Resíduos gerados (kg)", type: "number", step: "0.01" },
      { key: "reciclado", label: "Resíduos reciclados (kg)", type: "number", step: "0.01" },
      { key: "taxa", label: "Taxa de reciclagem (%)", type: "number", step: "0.01", required: false }
    ]
  },
  seguranca: {
    resource: "seguranca",
    title: "Segurança do Trabalho",
    subtitle: "Registre riscos, ocorrências e medidas preventivas.",
    emptyIcon: "◇",
    columns: [
      { key: "data", label: "Data", format: "date" },
      { key: "tipo", label: "Tipo" },
      { key: "local", label: "Local" },
      { key: "risco", label: "Risco", aliases: ["nivelRisco"] },
      { key: "status", label: "Status", badge: true },
      { key: "descricao", label: "Descrição" }
    ],
    fields: [
      { key: "data", label: "Data", type: "date" },
      { key: "tipo", label: "Tipo da ocorrência" },
      { key: "local", label: "Local" },
      { key: "risco", label: "Nível de risco", type: "select", options: ["Baixo", "Médio", "Alto", "Crítico"] },
      { key: "status", label: "Status", type: "select", options: ["Aberta", "Em análise", "Resolvida"] },
      { key: "descricao", label: "Descrição", type: "textarea", full: true }
    ]
  }
};
