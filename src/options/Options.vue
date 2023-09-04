<script setup lang="ts">
import { sendMessage } from "webext-bridge/content-script";
import {
  newCreditDate,
  credits,
  fontSize,
  chatButtonPosition,
  userId,
  messages,
  token,
} from "~/logic/storage";

const onResetClick = () => {
  credits.value = 10;
  newCreditDate.value = new Date().getTime();
};

const onResetAllData = () => {
  credits.value = 10;
  newCreditDate.value = new Date().getTime();
  chatButtonPosition.value = { right: 0, bottom: 0 };
  fontSize.value = 16;
  userId.value = "";
  messages.value = [];
  token.value = "";
};

const onSettingsChange = () => {
  sendMessage(
    "settings",
    {
      type: "options",
      settings: {
        fontSize: fontSize.value,
      },
    },
    "background"
  );
};

// const onClearMessage = () => {
//   messages.value = [];
// };
</script>

<template>
  <main class="px-4 py-10 text-gray-700 dark:text-gray-200">
    <div class="space-y-12 sm:space-y-16">
      <div>
        <h2 class="text-base font-semibold leading-7 text-gray-900">
          Settings
        </h2>
        <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
          Configuring your settings will help us personalize your experience
        </p>
        <div
          class="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0"
        >
          <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
            <label
              for="username"
              class="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
              >Font Size</label
            >
            <div class="mt-2 sm:col-span-2 sm:mt-0">
              <div
                class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
              >
                <input
                  v-model.number="fontSize"
                  type="number"
                  name="number"
                  id="font-size"
                  class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="Font Size"
                  :max="30"
                  @input="onSettingsChange"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- <SharedSubtitle /> -->
    <!-- <input
      v-model="token"
      class="border border-gray-400 rounded px-2 py-1 mt-2"
    />
    <button @click="onClearMessage">Clear messages</button> -->
    <!-- <input
      v-model="newCreditDate"
      class="border border-gray-400 rounded px-2 py-1 mt-2"
    /> -->

    <div class="mt-4">
      Powered by Respond Buddy
      <!-- <pixelarticons-zap class="align-middle inline-block" /> -->
    </div>
    <button @click="onResetAllData" class="text-white">Reset</button>
    <div class="text-white" @click="onResetClick">Reset Credits</div>

    <div class="text-white">
      <div>Chat Button Position{{ chatButtonPosition }}</div>
      <div>New Credit Date{{ newCreditDate }}</div>
      <div>Credits {{ credits }}</div>
      <div>Font Size{{ fontSize }}</div>
      <div>User id {{ userId }}</div>
      <div>Messages {{ messages }}</div>
      <div>Token {{ token }}</div>
    </div>
  </main>
</template>
