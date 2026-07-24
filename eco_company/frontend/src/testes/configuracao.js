import "@testing-library/jest-dom/vitest";

const dadosLocalStorage = new Map();

Object.defineProperty(window, "localStorage", {
  configurable: true,
  value: {
    getItem(chave) {
      return dadosLocalStorage.get(chave) ?? null;
    },

    setItem(chave, valor) {
      dadosLocalStorage.set(chave, String(valor));
    },

    removeItem(chave) {
      dadosLocalStorage.delete(chave);
    },

    clear() {
      dadosLocalStorage.clear();
    }
  }
});

HTMLDialogElement.prototype.showModal = function () {
  this.setAttribute("open", "");
};

HTMLDialogElement.prototype.close = function () {
  this.removeAttribute("open");
};