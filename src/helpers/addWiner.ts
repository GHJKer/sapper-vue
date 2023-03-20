import { ref } from "vue";

// Создает массив в localStorage состоящий из blockId, затем копирует его в idArray
const blockIdHandler = (blockIdObj: { blockId: number }) => {
  const key = Object.keys(blockIdObj)[0];
  const value = Object.values(blockIdObj)[0];

  const getItem = () => {
    if (process.client) {
      idArray.value = JSON.parse(localStorage.getItem(key) ?? "[]");
    }
  };

  if (localStorage.getItem(key) == null) {
    //  local storage empty

    if (process.client) {
      localStorage.setItem(key, JSON.stringify([value]));
    }
    // idArray.value.push(value)
    getItem();
  } else {
    //  local storage NOT empty
    getItem();

    if (!idArray.value.includes(value)) {
      idArray.value.push(value);
      if (process.client) {
        localStorage.setItem(key, JSON.stringify(idArray.value));
      }
    }
  }
};
