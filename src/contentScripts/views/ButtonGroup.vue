<template>
  <div class="inline-flex rounded-md justify-center w-full">
    <button
      v-for="prompt in prompts"
      :key="prompt.key"
      type="button"
      class="py-3 px-4 inline-flex justify-center items-center gap-2 -ml-px first:ml-0 border font-medium bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm text-white hover:bg-blue-100"
      :class="{
        'rounded-l-xl first:ml-0': prompt === prompts[0],
        'rounded-r-xl': prompt === prompts[prompts.length - 1],
        'rounded-xl': prompts.length === 1,
      }"
      @click="handleClick(prompt.key)"
    >
      {{ prompt.name }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  prompts: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const emit = defineEmits(["button-click"]);

const handleClick = (key: string) => {
  emit("button-click", key);
};
</script>

<style scoped>
.container {
  display: inline-flex;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.group_btn {
  padding: 1rem 1.5rem;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-left: -1px;
  border: 1px solid #e5e7eb;
  font-weight: 500;
  background-color: #ffffff;
  color: #4b5563;
  cursor: pointer;
  text-align: center;
  vertical-align: middle;
  transition: all 0.15s ease-in-out;
  font-size: 0.875rem;
}

.group_btn:hover {
  background-color: #f9fafb;
}

.group_btn:focus {
  outline: none;
  box-shadow: 0 0 0 2px #3b82f6;
}

.group_btn.first {
  border-radius: 0.5rem 0 0 0.5rem;
}

.group_btn.last {
  border-radius: 0 0.5rem 0.5rem 0;
}
</style>
