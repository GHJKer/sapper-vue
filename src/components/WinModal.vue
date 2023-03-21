<script lang="ts" setup>
import { ref, Ref, onMounted } from "vue";
import { useStore } from "../store/useStore";

import { LeaderResultsI } from "../types/general";

interface Props {
  options: LeaderResultsI;
}

const props = defineProps<Props>();

const store = useStore();

const showInput = ref(true);
const LeaderResults: Ref<LeaderResultsI> = ref(({} = props.options));
const leaders: Ref<LeaderResultsI[]> = ref([]);

const addResult = function () {
  leaders.value.push(LeaderResults.value);
  leaders.value.sort((a, b) => (a.totalTime > b.totalTime ? 1 : -1));
  localStorage.setItem("storageKey", JSON.stringify(leaders.value));
  showInput.value = false;
  store.storeData(leaders.value);
};

onMounted(() => {
  if (store.recordsData) leaders.value = store.recordsData;
});
</script>
<template>
  <div :class="$style['main-container']">
    <span :class="$style['leader-text']"
      >Введите имя чтобы добавить себя в таблицу победителей:</span
    >
    <div v-if="showInput" :class="$style['input-group']">
      <input :class="$style['leader-input']" v-model="LeaderResults.name" />
      <button @click="addResult">Добавить</button>
    </div>
    <ul :class="$style['record-list']">
      <li :class="$style['record']" v-for="item in leaders" :key="item.time">
        <span>
          {{ item.name }}
        </span>
        <span>
          {{ item.difficulty }}
        </span>
        <span>
          {{ item.time }}
        </span>
      </li>
    </ul>
  </div>
</template>
<style module>
.main-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 20px;
  border: 1px solid gray;
  border-radius: 10px;
}

.input-group {
  display: flex;
  gap: 10px;
}

.leader-text {
  font-weight: 400;
  font-size: 12px;
  line-height: 140%;
}

.leader-input {
  height: 39px;
  padding-left: 15px;
  margin-left: 0;
  border: transparent;
  border-radius: 10px;

  font-family: inherit;
  font-weight: 400;
  font-size: 16px;
  line-height: 130%;
}

.record-list {
  padding: 0;
  margin: 0;
}

.record {
  display: flex;
  gap: 10px;
  list-style: none;
}
</style>
