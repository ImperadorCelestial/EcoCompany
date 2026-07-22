const initialData = {
  maquinas: [
    { id: "maq-001", nome: "Empacotadora 02", setor: "Expedição", tipo: "Empacotadora", status: "Parada", energia: 9.8, temperatura: 24.1 },
    { id: "maq-002", nome: "Prensa Hidráulica", setor: "Conformação", tipo: "Prensa", status: "Em manutenção", energia: 32, temperatura: 28.5 },
    { id: "maq-003", nome: "Braço Robótico A", setor: "Soldagem", tipo: "Robô Industrial", status: "Em operação", energia: 25.2, temperatura: 51.7 },
    { id: "maq-004", nome: "Esteira Industrial 01", setor: "Montagem", tipo: "Esteira", status: "Em operação", energia: 18.5, temperatura: 42.3 }
  ],
  producoes: [
    { id: "pro-001", data: "2026-07-18", produto: "Kit C", maquina: "Empacotadora 02", produzido: 480, esperado: 500 },
    { id: "pro-002", data: "2026-07-19", produto: "Peça A", maquina: "Esteira Industrial 01", produzido: 920, esperado: 1000 },
    { id: "pro-003", data: "2026-07-20", produto: "Peça B", maquina: "Braço Robótico A", produzido: 760, esperado: 800 },
    { id: "pro-004", data: "2026-07-21", produto: "Peça A", maquina: "Esteira Industrial 01", produzido: 850, esperado: 1000 }
  ],
  sustentabilidade: [
    { id: "sus-001", data: "2026-07-19", energia: 165.2, agua: 2050, residuos: 110, reciclado: 44 },
    { id: "sus-002", data: "2026-07-20", energia: 165.2, agua: 2050, residuos: 110, reciclado: 82 },
    { id: "sus-003", data: "2026-07-21", energia: 180.5, agua: 2200, residuos: 120, reciclado: 84 }
  ],
  seguranca: [
    { id: "seg-001", data: "2026-07-19", tipo: "Piso molhado", local: "Montagem", risco: "Baixo", status: "Resolvida", descricao: "Vazamento próximo à linha de montagem." },
    { id: "seg-002", data: "2026-07-20", tipo: "Falha de proteção", local: "Conformação", risco: "Alto", status: "Aberta", descricao: "Proteção lateral da prensa precisa de reparo." },
    { id: "seg-003", data: "2026-07-21", tipo: "Quase acidente", local: "Expedição", risco: "Médio", status: "Em análise", descricao: "Objeto encontrado na área de circulação." }
  ]
};

const database = structuredClone(initialData);

function wait(milliseconds = 120) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function collection(resource) {
  const records = database[resource];
  if (!records) throw new Error(`Recurso de teste desconhecido: ${resource}`);
  return records;
}

function createId(resource) {
  const suffix = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${resource.slice(0, 3)}-${suffix}`;
}

export const mockStore = {
  async list(resource) {
    await wait();
    return structuredClone(collection(resource));
  },

  async create(resource, data) {
    await wait();
    const record = { id: createId(resource), ...structuredClone(data) };
    collection(resource).push(record);
    return structuredClone(record);
  },

  async update(resource, id, data) {
    await wait();
    const records = collection(resource);
    const index = records.findIndex((record) => String(record.id) === String(id));
    if (index < 0) throw new Error("Registro de teste não encontrado.");
    records[index] = { ...records[index], ...structuredClone(data), id: records[index].id };
    return structuredClone(records[index]);
  },

  async remove(resource, id) {
    await wait();
    const records = collection(resource);
    const index = records.findIndex((record) => String(record.id) === String(id));
    if (index < 0) throw new Error("Registro de teste não encontrado.");
    records.splice(index, 1);
    return null;
  }
};
