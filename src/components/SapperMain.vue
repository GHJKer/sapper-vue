<script setup lang="ts">
import { ref, Ref, onMounted } from "vue";

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

let itemRefs = [];

const setItemRef = (el) => {
  if (el) {
    itemRefs.push(el);
  }
};

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

const createMines = function (difficulty: number) {
  let arr: rowObjI[] = [];

  for (let i = 0; i < difficulty; i++) {
    arr.push({ id: 10 + i, innerArr: [] });
  }

  for (let i = 0; i < difficulty; i++) {
    for (let a = 0; a < difficulty; a++) {
      arr[i].innerArr.push({ id: a, innerNum: getRandomInt(9) });
    }
  }

  minesArr.value = arr;
};

const defuseBomb = function (row: number, col: number, bomb: number) {
  if (bomb === 0) {
    console.log("BOOM");
  }

  // const rowChildren = document.getElementById(`${row}`)?.children;

  console.log(itemRefs);
};

onMounted(() => {
  createMines(easy);
});
</script>

<template>
  <div :class="$style['main-container']">
    <table>
      <tbody>
        <tr
          :ref="setItemRef"
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
  width: 20px;
  height: 20px;
  padding: 3px;
  border: 1px solid black;
  text-align: center;
  background-color: rgb(188, 188, 188);
  color: black;
}

th {
  font-weight: bold;
}

.main-container {
  width: 500px;
  height: 500px;
  border-radius: 10px;
  border: 1px solid #595454;
}
</style>
