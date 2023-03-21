<script lang="ts" setup>
import router from "../router/index";

import { useStore } from "../store/useStore";

const store = useStore();
const leaders = store.recordsData;
</script>
<template>
  <div :class="$style['main-container']">
    <button @click="router.push('/')">Назад в главное меню</button>
    <h3>Leader board</h3>
    <ul :class="$style['record-list']">
      <li :class="$style['record']" v-for="item in leaders">
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
  align-items: center;
  gap: 20px;
  padding: 30px;
  min-width: 400px;
  min-height: 120px;
  border-radius: 10px;
  border: 1px solid #595454;
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
