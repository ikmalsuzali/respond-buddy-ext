<template>
  <div :style="style">test hello its me</div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
const props = defineProps({
  selector: {
    type: String,
    required: true,
    default: () => "",
  },
  actions: {
    type: Array,
    required: true,
    default: () => [],
  },
  style: {
    type: String,
    required: true,
    default: () => "",
  },
});
</script>
