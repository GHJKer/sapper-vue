<script setup lang="ts">
import { ref, Ref, computed, watch } from "vue";
import { timer, timeLeft, timerStop } from "../helpers/timer";

interface rowObjI {
  id: number;
  innerArr: innerArrI[];
}

interface innerArrI {
  id: number;
  innerNum: number;
}

const difficultyObj = {
  easy: {
    rows: 8,
    cells: 8,
    time: 10,
  },
  medium: {
    rows: 16,
    cells: 16,
    time: 40,
  },
  hard: {
    rows: 32,
    cells: 16,
    time: 100,
  },
};

let showDifficulty = ref(true);
let gameStarted = ref(false);
let minesArr: Ref<rowObjI[]> = ref([]);
let bombs = ref();
let allBombs: Ref<number[]> = ref([]);
let itemRefs: Ref<HTMLElement[]> = ref([]);
let itemCellsRefs: Ref<HTMLElement[]> = ref([]);
let tableRef = ref();
let timerRef = ref();

function setRef(el) {
  if (el) {
    itemRefs.value.push(el);
  }
}

function setCellsRef(el) {
  if (el) {
    itemCellsRefs.value.push(el);
  }
}

const dangerLevel = computed(() => {
  return bombs.value >= 8
    ? "#ffffff"
    : bombs.value === 7
    ? "#000000"
    : bombs.value === 6
    ? "#37aaa1"
    : bombs.value === 5
    ? "#821b1b"
    : bombs.value === 4
    ? "#0000b3"
    : bombs.value === 3
    ? "#df2424"
    : bombs.value === 2
    ? "#036e03"
    : bombs.value === 1
    ? "#4848ff"
    : "transparent";
});

function restart() {
  gameStarted.value = false;
  showDifficulty.value = true;
  timerStop.value = true;
  itemRefs.value = [];
  itemCellsRefs.value = [];
  allBombs.value = [];
  minesArr.value = [];
  tableRef.value.style.pointerEvents = "auto";
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

const createMines = function (rows: number, cells: number, time: number) {
  itemRefs.value = [];
  itemCellsRefs.value = [];

  let arr: rowObjI[] = [];

  for (let i = 0; i < rows; i++) {
    arr.push({ id: i, innerArr: [] });
  }

  for (let i = 0; i < cells; i++) {
    for (let a = 0; a < rows; a++) {
      let randomNum = getRandomInt(80);
      if (randomNum === 0) {
        allBombs.value.push(randomNum);
      }
      arr[i].innerArr.push({ id: a, innerNum: randomNum });
    }
  }

  // Красим все клетки в один цвет с цифрами
  setTimeout(() => {
    for (let item of itemCellsRefs.value) {
      item.style.color = "transparent";
      item.style.backgroundColor = "#bcbcbc";
    }
  }, 0);

  minesArr.value = arr;
  showDifficulty.value = false;
  gameStarted.value = true;
  timer(time);
  timerStop.value = false;
  tableRef.value.style.pointerEvents = "auto";
};

const rowElemArr = function (rowNum: number) {
  return Array.from(itemRefs.value[rowNum].children);
};

const filterClosest = function (row: Element[], index: number | string) {
  return row.filter(
    (item) =>
      Number(item.id) >= Number(index) - 2 &&
      Number(item.id) <= Number(index) + 2
  );
};

// ряды на указанном удалении
const getClosestRows = function (rowNum: number) {
  const arr = filterClosest(itemRefs.value, rowNum).map((item) =>
    rowElemArr(Number(item.id))
  );
  return arr;
};

// элементы на указанном удалении влево/вправо + получаем содержимое клеток
const getClosestItems = function (row: Element[], cellId: string) {
  return filterClosest(row, cellId).map((item) => item.innerHTML);
};

const openField = function (elementsArr: Element[][], id: string) {
  let closestElemets = elementsArr.map((item) => filterClosest(item, id));
  for (let item of closestElemets) {
    for (let i of item) {
      // (i as HTMLElement).style.color = "#bcbcbc";
      (i as HTMLElement).style.backgroundColor = "#8e8e8e";
    }
  }
};

const youLost = function (elem: Element) {
  (elem as HTMLElement).style.backgroundColor = "red";
  timerStop.value = true;
  tableRef.value.style.pointerEvents = "none";
};

const defuseBomb = function (rowNum: number, cell: number, bomb: number) {
  // Получаем ближайшие ряды
  const closestRows = getClosestRows(rowNum);

  // Массив дочерних элементов ряда
  const cellsArr = rowElemArr(rowNum);

  const currentCellElem = cellsArr[cell];

  // Обработка проигрыша
  if (bomb === 0) {
    youLost(currentCellElem);
    return;
  }

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

  // Красим ближайшие элементы (открытие поля) + нельзя открывать нажатием на уже открытую клетку
  if (
    bombs.value === 0 &&
    (currentCellElem as HTMLElement).style.backgroundColor ===
      "rgb(188, 188, 188)"
  )
    openField(closestRows, currentCellElem.id);

  // Меняем цвет цифры и бэкраунд
  if (
    (currentCellElem as HTMLElement).style.backgroundColor ===
    "rgb(188, 188, 188)"
  ) {
    (currentCellElem as HTMLElement).style.color = `${dangerLevel.value}`;
    (currentCellElem as HTMLElement).style.backgroundColor = "#8e8e8e";
  }
};

watch(timeLeft, (newTime) => {
  timerRef.value.innerHTML = newTime;
});
</script>

<template>
  <div :class="$style['main-container']">
    <div v-if="gameStarted" :class="$style['control-group']">
      <button @click="restart">Restart</button>
      <div ref="timerRef" :class="$style['control-group_block']">00:00</div>
      <div :class="$style['control-group_block']">Counter: 10</div>
    </div>
    <div v-if="showDifficulty" :class="$style['dicciculty-group']">
      <h2>Выберите сложность</h2>
      <div :class="$style['dicciculty-buttons']">
        <button
          @click="
            createMines(
              difficultyObj.easy.rows,
              difficultyObj.easy.cells,
              difficultyObj.easy.time
            )
          "
        >
          easy
        </button>
        <button
          @click="
            createMines(
              difficultyObj.medium.rows,
              difficultyObj.medium.cells,
              difficultyObj.medium.time
            )
          "
        >
          medium
        </button>
        <button
          @click="
            createMines(
              difficultyObj.hard.rows,
              difficultyObj.hard.cells,
              difficultyObj.hard.time
            )
          "
        >
          hard
        </button>
      </div>
    </div>
    <table ref="tableRef" :class="$style['table']">
      <tbody v-if="gameStarted">
        <tr
          :ref="setRef"
          :id="item.id.toString()"
          v-for="item in minesArr"
          :key="item.id"
        >
          <td
            :ref="setCellsRef"
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
  background-color: #bcbcbc;
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

.control-group {
  display: flex;
  gap: 20px;
  align-items: center;
}

.control-group_block {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
  height: 35px;
  border: 1px solid #595454;
  border-radius: 10px;
}

.dicciculty-group {
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: center;
}

.dicciculty-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
}
</style>
