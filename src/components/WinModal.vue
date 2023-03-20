<script lang="ts" setup>
import { ref, Ref } from "vue";

interface LeaderResultsI {
  name?: string;
  time: string;
  difficulty: string;
  totalTime: number;
}

interface Props {
  options: LeaderResultsI;
}
const props = defineProps<Props>();

const LeaderResults: Ref<LeaderResultsI> = ref(({} = props.options));

const leaders: Ref<LeaderResultsI[]> = ref([]);
</script>
<template>
  <div :class="$style['main-container']">
    <span :class="$style['leader-text']"
      >Введите имя чтобы добавить себя в таблицу победителей:</span
    >
    <div :class="$style['input-group']">
      <input :class="$style['leader-input']" v-model="LeaderResults.name" />
      <button @click="leaders.push(LeaderResults)">Добавить</button>
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
