<script lang="ts" setup>
import router from "../router/index";
</script>
<template>
  <div :class="$style['main-container']">
    <button @click="router.push('/')">Назад в главное меню</button>
    <h3>Leader board</h3>
    <ul>
      <li>1) time: 3.02 mines: 4 difficulty: easy</li>
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
</style>
