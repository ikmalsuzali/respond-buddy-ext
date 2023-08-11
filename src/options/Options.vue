<script setup lang="ts">
import { , token, messages } from "~/logic/storage";

const onClearMessage = () => {
  messages.value = [];
};
</script>

<template>
  <main class="px-4 py-10 text-center text-gray-700 dark:text-gray-200">
    <!-- <img
      src="/assets/icon.svg"
      class="icon-btn mx-2 text-2xl"
      alt="extension icon"
    /> -->
    <div>Options</div>
    <SharedSubtitle />
    <!-- <input
      v-model="token"
      class="border border-gray-400 rounded px-2 py-1 mt-2"
    />
    <button @click="onClearMessage">Clear messages</button> -->

    <div class="mt-4">
      Powered by Respond Buddy
      <!-- <pixelarticons-zap class="align-middle inline-block" /> -->
    </div>
  </main>
</template>
