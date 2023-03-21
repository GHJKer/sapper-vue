<script lang="ts" setup>
import { ref, Ref, onMounted } from "vue";
import router from "../router/index";

import { LeaderResultsI } from "../types/general";

const leaders: Ref<LeaderResultsI[]> = ref([]);

onMounted(() => {
  leaders.value = JSON.parse(localStorage.getItem("storageKey") ?? "[]");
});
</script>
<template>
  <div :class="$style['main-container']">
    <button @click="router.push('/')">Назад в главное меню</button>
    <h3>Leader board</h3>
    <table>
      <t-body :class="$style['main-table']">
        <tr v-for="item in leaders">
          <td :class="$style['table-td']">
            <span>
              {{ item.name }}
            </span>
          </td>
          <td :class="$style['table-td']">
            <span>
              {{ item.difficulty }}
            </span>
          </td>
          <td :class="$style['table-td']">
            <span>
              {{ item.name }}
            </span>
          </td>
        </tr>
      </t-body>
    </table>
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

.main-table {
  text-align: left;
}

.table-td {
  width: 70px;
}
</style>
