<script setup lang="ts">
import { ref, Ref, computed, onMounted } from "vue";
import router from "../router/index";
import WinModal from "./WinModal.vue";
import Timer from "./Timer.vue";
import Counter from "./Counter.vue";
import SmileSvg from "./SmileSvg.vue";
import DeadSvg from "./DeadSvg.vue";
import WinSvg from "./WinSvg.vue";
import { timer, timerObj } from "../helpers/timer";
import { useStore } from "../store/useStore";

import { rowObjI, SumUp, LeaderResultsI } from "../types/general";

const store = useStore();

const difficultyObj = {
  easy: {
    name: "easy",
    rows: 8,
    cells: 8,
    time: 10,
  },
  medium: {
    name: "medium",
    rows: 16,
    cells: 16,
    time: 40,
  },
  hard: {
    name: "hard",
    rows: 16,
    cells: 32,
    time: 100,
  },
};

let isPressed = ref(false);
let timerSet = ref();
let showDifficulty = ref(true);
let gameStarted = ref(false);
let gameOver = ref(false);
let gameWin = ref(false);
let isModalOpen = ref(false);
let currentDifficulty = ref();
let sumUpObj: SumUp = {
  difficulty: "",
  time: "",
  totalTime: 0,
};
let bombs = ref();
let allBombs = ref(0);
let scores = ref({
  count: 0,
});
let scoresInFact = ref(0);
const leaders: Ref<LeaderResultsI[]> = ref([]);
let minesArr: Ref<rowObjI[]> = ref([]);
let itemRefs: Ref<HTMLElement[]> = ref([]);
let itemCellsRefs: Ref<HTMLElement[]> = ref([]);

let skipUnwrap = { itemRefs };
let skipUnwrapCells = { itemCellsRefs };
let tableRef = ref();

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

function touchStartHandler(cellNum: number, rowNum: number, cell: number) {
  isPressed.value = true;
  timerSet.value = setTimeout(() => {
    if (isPressed.value) {
      isPressed.value = false;
      console.log("put a flag");
      checkCell(cellNum, rowNum, cell);
    }
  }, 600);
}

function touchEndHanlder() {
  isPressed.value = false;
  clearTimeout(timerSet.value);
}

let checkStatuses = function () {
  const stateArray = [];
  for (let item of minesArr.value) {
    for (let i of item.innerArr) {
      stateArray.push(i.state);
    }
  }

  let closedCells = stateArray.filter((item) => item === false);

  if (scoresInFact.value === 0 && closedCells.length === 0) {
    youWin();
    console.log("WIN");
  }
};

let checkCell = function (cellNum: number, rowNum: number, cell: number) {
  scores.value.count--;

  // Помечаем состояние клетки как "проверенное"
  minesArr.value[rowNum].innerArr[cell].state = true;

  // Получаем элемент и добавляем изобр флага
  const cellsArr = rowElemArr(rowNum);
  cellsArr[cell].classList.remove("mine-style");
  cellsArr[cell].classList.add("flag-style");
  //-//
  if (cellNum === 0) {
    scoresInFact.value--;
  }
  checkStatuses();
};

function restart() {
  isModalOpen.value = false;
  gameOver.value = false;
  gameWin.value = false;
  gameStarted.value = false;
  showDifficulty.value = true;
  timerObj.value.timerStop = true;
  itemRefs.value = [];
  itemCellsRefs.value = [];
  allBombs.value = 0;
  scores.value.count = 0;
  minesArr.value = [];
  tableRef.value.style.pointerEvents = "auto";
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function godMode() {
  for (let item of itemCellsRefs.value) {
    if (Number(item.innerHTML) === 0) {
      item.classList.remove("flag-style");
      item.classList.add("mine-style");
    }
  }
}

const createMines = function (
  difficultyName: string,
  rows: number,
  cells: number,
  time: number
) {
  itemRefs.value = [];
  itemCellsRefs.value = [];
  currentDifficulty.value = difficultyName;

  let arr: rowObjI[] = [];

  for (let i = 0; i < rows; i++) {
    arr.push({ id: i, innerArr: [] });
  }

  for (let i = 0; i < rows; i++) {
    for (let a = 0; a < cells; a++) {
      let randomNum = getRandomInt(15);
      if (randomNum === 0) allBombs.value++;
      arr[i].innerArr.push({ id: a, innerNum: randomNum, state: false });
    }
  }

  // Красим все клетки в один цвет с цифрами
  setTimeout(() => {
    for (let item of itemCellsRefs.value) {
      item.style.color = "transparent";
      item.style.backgroundColor = "#bcbcbc";
    }
  }, 0);

  scores.value.count = allBombs.value;
  scoresInFact.value = allBombs.value;
  minesArr.value = arr;
  showDifficulty.value = false;
  gameStarted.value = true;
  timer(time);
  timerObj.value.timerStop = false;
  gameOver.value = false;
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

const openField = function (
  elementsArr: Element[][],
  id: string,
  rowNum: number
) {
  let closestElemets = elementsArr.map((item) => filterClosest(item, id));

  // Меняем состояния нужных объектов
  const rowsObj = minesArr.value.filter(
    (item) => item.id >= rowNum - 2 && item.id <= rowNum + 2
  );

  let cellsStates = [];
  for (let row of rowsObj) {
    cellsStates.push(
      row.innerArr.filter(
        (item) => item.id >= Number(id) - 2 && item.id <= Number(id) + 2
      )
    );
  }

  for (let item of cellsStates) {
    for (let i of item) {
      i.state = true;
    }
  }
  //--//

  for (let item of closestElemets) {
    for (let i of item) {
      (i as HTMLElement).style.backgroundColor = "#8e8e8e";
    }
  }
};

const youLost = function (elem: Element) {
  (elem as HTMLElement).style.backgroundColor = "red";
  timerObj.value.timerStop = true;
  gameOver.value = true;
  tableRef.value.style.pointerEvents = "none";
};

const youWin = function () {
  isModalOpen.value = true;
  sumUpObj = {
    difficulty: currentDifficulty.value,
    time: timerObj.value.timePassed,
    totalTime: timerObj.value.totalTime,
  };
  console.log(sumUpObj);

  timerObj.value.timerStop = true;
  tableRef.value.style.pointerEvents = "none";
  gameWin.value = true;
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

  // Помечаем состояние клетки как "проверенное"
  minesArr.value[rowNum].innerArr[cell].state = true;

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
    openField(closestRows, currentCellElem.id, rowNum);

  // Меняем цвет цифры и бэкраунд
  if (
    (currentCellElem as HTMLElement).style.backgroundColor ===
    "rgb(188, 188, 188)"
  ) {
    (currentCellElem as HTMLElement).style.color = `${dangerLevel.value}`;
    (currentCellElem as HTMLElement).style.backgroundColor = "#8e8e8e";
  }

  checkStatuses();
};

onMounted(() => {
  leaders.value = JSON.parse(localStorage.getItem("storageKey") ?? "[]");
  store.storeData(leaders.value);
});
</script>

<template>
  <div :class="$style['main-container']">
    <button v-if="gameStarted" @click="godMode">Show mines</button>
    <WinModal :options="sumUpObj" v-if="isModalOpen" />
    <div v-if="gameStarted" :class="$style['control-group']">
      <Counter :options="scores" />
      <div :class="$style['restart-imgs']" @click="restart">
        <SmileSvg v-if="!gameOver && !gameWin" :class="$style['emoji']" />
        <DeadSvg v-if="gameOver" :class="$style['emoji']" />
        <WinSvg v-if="gameWin" :class="$style['emoji']" />
      </div>
      <Timer />
    </div>
    <div v-if="showDifficulty" :class="$style['dicciculty-group']">
      <h2>Выберите сложность</h2>
      <div :class="$style['dicciculty-buttons']">
        <button
          @click="
            createMines(
              difficultyObj.easy.name,
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
              difficultyObj.medium.name,
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
              difficultyObj.hard.name,
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
    <button v-if="showDifficulty" @click="router.push('/LeaderBoard')">
      Открыть таблицу лидеров
    </button>
    <table ref="tableRef" :class="$style['main-table']">
      <tbody v-if="gameStarted">
        <tr
          :ref="skipUnwrap.itemRefs"
          :id="item.id.toString()"
          v-for="item in minesArr"
          :key="item.id"
        >
          <td
            :class="$style['table-td']"
            :ref="skipUnwrapCells.itemCellsRefs"
            :id="i.id.toString()"
            v-for="i in item.innerArr"
            :key="i.id"
            @click="defuseBomb(item.id, i.id, i.innerNum)"
            @contextmenu.prevent="checkCell(i.innerNum, item.id, i.id)"
            @touch="defuseBomb(item.id, i.id, i.innerNum)"
            @touchstart="touchStartHandler(i.innerNum, item.id, i.id)"
            @touchend="touchEndHanlder"
          >
            {{ i.innerNum }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style module>
.main-table {
  border-collapse: collapse;
  user-select: none;
}

.table-td {
  width: 24px;
  height: 20px;
  border: 1px solid black;
  text-align: center;
  background-color: #bcbcbc;
  cursor: pointer;
}

.main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 30px;
  min-width: 400px;
  min-height: 220px;
  border-radius: 10px;
  border: 1px solid #595454;
}

.control-group {
  display: flex;
  gap: 20px;
  align-items: center;
}

.restart-imgs {
  cursor: pointer;
}

.emoji {
  width: 60px;
}

.control-group_block {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 7px;
  width: 100px;
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
<style>
.flag-style {
  background-image: url(/svg/flag.svg);
  background-position: center;
  background-size: cover;
  pointer-events: none;
}

.mine-style {
  background-image: url(/svg/mine.svg);
  background-position: center;
  background-size: cover;
}
</style>
