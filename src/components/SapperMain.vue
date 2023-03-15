<script setup lang="ts">
import { ref, Ref, computed, onMounted } from "vue";

interface rowObjI {
  id: number;
  innerArr: innerArrI[];
}

interface innerArrI {
  id: number;
  innerNum: number;
}

const easy = 8;
const medium = 16;
const hard = 32;
let minesArr: Ref<rowObjI[]> = ref([]);
let itemRefs: Ref<HTMLElement[]> = ref([]);
let bombs = ref();

const dangerLevel = computed(() => {
  return bombs.value >= 8
    ? "#ffffff"
    : bombs.value === 7
    ? "#000000"
    : bombs.value === 6
    ? "#37aaa1"
    : bombs.value === 5
    ? "##821b1b"
    : bombs.value === 4
    ? "#0000b3"
    : bombs.value === 3
    ? "#df2424"
    : bombs.value === 2
    ? "#036e03"
    : "#4848ff";
});

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

const createMines = function (difficulty: number) {
  itemRefs.value = [];

  let arr: rowObjI[] = [];

  for (let i = 0; i < difficulty; i++) {
    arr.push({ id: i, innerArr: [] });
  }

  for (let i = 0; i < difficulty; i++) {
    for (let a = 0; a < difficulty; a++) {
      arr[i].innerArr.push({ id: a, innerNum: getRandomInt(80) });
    }
  }

  minesArr.value = arr;
};

const rowElemArr = function (rowNum: number) {
  return Array.from(itemRefs.value[rowNum].children);
};

const getClosestRows = function (rowNum: number) {
  const arr = itemRefs.value
    .filter(
      (item) =>
        Number(item.id) >= Number(rowNum) - 8 &&
        Number(item.id) <= Number(rowNum) + 8
    )
    .map((item) => rowElemArr(Number(item.id)));
  return arr;
};

// элементы на удалении 2х клеток влево/вправо + получаем содержимое клеток
const getClosestItems = function (row: Element[], cellId: string) {
  return row
    .filter(
      (item) =>
        Number(item.id) >= Number(cellId) - 8 &&
        Number(item.id) <= Number(cellId) + 8
    )
    .map((item) => item.innerHTML);
};

const defuseBomb = function (rowNum: number, cell: number, bomb: number) {
  if (bomb === 0) {
    console.log("BOOM");
    return;
  }

  // Получаем ближайшие ряды
  const closestRows = getClosestRows(rowNum);

  // Массив дочерних элементов ряда
  const cellsArr = rowElemArr(rowNum);

  const currentCellElem = cellsArr[cell];

  // Значения клеток в указанном радиусе
  const defuseArea = closestRows.map((item) =>
    getClosestItems(item, currentCellElem.id)
  );

  // Количество бомб в указанном радиусе
  bombs.value = defuseArea.flat().filter((item) => Number(item) === 0).length;

  // Показываем количество бомб в ук. рад.
  bombs.value === 0
    ? (currentCellElem.innerHTML = "N")
    : (currentCellElem.innerHTML = bombs.value.toString());
};

onMounted(() => {
  createMines(easy);
});
</script>

<template>
  <div :class="$style['main-container']">
    <div :class="$style['dicciculty-group']">
      <button @click="createMines(easy)">easy</button>
      <button @click="createMines(medium)">medium</button>
      <button @click="createMines(hard)">hard</button>
    </div>
    <table :class="$style['table']">
      <tbody>
        <tr
          :ref="(el) => itemRefs.push(el)"
          :id="item.id.toString()"
          v-for="item in minesArr"
          :key="item.id"
        >
          <td
            :id="i.id.toString()"
            v-for="i in item.innerArr"
            :key="i.id"
            @click="defuseBomb(item.id, i.id, i.innerNum)"
          >
            {{ i.innerNum }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style module>
table {
  border-collapse: collapse;
}

td {
  width: 24px;
  height: 20px;
  border: 1px solid black;
  text-align: center;
  background-color: rgb(188, 188, 188);
  color: black;
}

th {
  font-weight: bold;
}

.main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 30px;
  min-width: 400px;
  min-height: 320px;
  border-radius: 10px;
  border: 1px solid #595454;
}

.dicciculty-group {
  display: flex;
  gap: 20px;
  justify-content: center;
}
</style>
