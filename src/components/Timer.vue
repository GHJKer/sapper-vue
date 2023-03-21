<script lang="ts" setup>
import { timerObj } from "../helpers/timer";
</script>

<template>
  <div :class="$style['control-group_block']">
    {{ timerObj.timeLeft ? timerObj.timeLeft : "00:00" }}
  </div>
</template>

<style module>
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
</style>
