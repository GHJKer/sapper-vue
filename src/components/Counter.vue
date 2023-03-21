<script lang="ts" setup>
interface CountValue {
  count: number;
}

interface Props {
  options: CountValue;
}

defineProps<Props>();
</script>

<template>
  <div :class="$style['control-group_block']">
    <span>{{ `Counter: ${options.count}` }}</span>
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
