<script setup lang="ts">
import { messages, storageDemo, token, userId } from "~/logic/storage";

function openOptionsPage() {
  browser.runtime.openOptionsPage();
}

const redirectIfNoAuth = () => {
  if (!token.value) {
    // browser.tabs.create({ url: "https://www.example.com/" });
  }
};

redirectIfNoAuth();
</script>

<template>
  <main class="w-[300px] px-4 py-5 text-center text-gray-700">
    <Logo />
    <div>Popup</div>
    <SharedSubtitle />

    <button class="btn mt-2" @click="openOptionsPage">Open Options</button>
    <div class="mt-2">
      <span class="opacity-50">token:</span> {{ token }}
      <span class="opacity-50">uuid:</span> {{ userId }}
      <span class="opacity-50">storageDemo:</span> {{ messages }}
    </div>
  </main>
</template>
