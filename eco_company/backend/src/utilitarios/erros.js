export class ErroHttp extends Error {
  constructor(status, mensagem) {
    super(mensagem);
    this.status = status;
  }
}

export function validarCampos(dados, campos) {
  const ausentes = campos.filter((campo) => {
    const valor = dados[campo];
    return valor === undefined || valor === null || valor === "";
  });

  if (ausentes.length) {
    throw new ErroHttp(
      400,
      `Campos obrigatórios: ${ausentes.join(", ")}.`
    );
  }
}

export function numeroValido(valor, nome, minimo = 0) {
  const numero = Number(valor);

  if (!Number.isFinite(numero) || numero < minimo) {
    throw new ErroHttp(
      400,
      `${nome} deve ser um número maior ou igual a ${minimo}.`
    );
  }

  return numero;
}

export function idValido(valor) {
  const id = Number(valor);

  if (!Number.isInteger(id) || id <= 0) {
    throw new ErroHttp(400, "Identificador inválido.");
  }

  return id;
}

export function registroNaoEncontrado(resultado) {
  if (!resultado.affectedRows) {
    throw new ErroHttp(404, "Registro não encontrado.");
  }
}
