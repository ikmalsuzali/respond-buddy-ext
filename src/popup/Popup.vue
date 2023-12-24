<script setup lang="ts">
import { sendMessage } from "webext-bridge/popup";
import { token, credits, newCreditDate, fontSize } from "~/logic/storage";

// const openOptionsPage = () => {
//   browser.runtime.openOptionsPage();
// }

const creditAmount = ref(credits.value);
const creditResetAmount = 5;

// const redirectIfNoAuth = () => {
//   const webUrl = "https://app.respondbuddy.com/";
//   if (!token.value) {
//     browser.tabs.create({ url: webUrl });
//   }
// };

const onLoginClick = () => {
  const webUrl = "https://app.respondbuddy.com/login";
  browser.tabs.create({ url: webUrl });
};

const onChatGPTClick = () => {
  const webUrl = "https://chat.openai.com/";
  browser.tabs.create({ url: webUrl });
};

const onRegisterClick = () => {
  const webUrl = "https://app.respondbuddy.com/register";
  browser.tabs.create({ url: webUrl });
};

const onDashboardClick = () => {
  const webUrl = "https://app.respondbuddy.com";
  browser.tabs.create({ url: webUrl });
};

const onSettingClick = async () => {
  await browser.runtime.openOptionsPage();
};

const onChatClick = () => {
  sendMessage("toggle-chat", { toggle: true }, "background");
};

const scheduleDailyReset = (amount: number) => {
  // Calculate the time until the next reset (24 hours from now)
  if (token.value) return;
  if (newCreditDate.value > new Date().getTime()) return;

  const currentTime = new Date();
  const nextResetTime = new Date(currentTime);
  nextResetTime.setDate(currentTime.getDate() + 1);
  nextResetTime.setHours(0, 0, 0, 0); // Reset time to midnight

  credits.value = amount;
  newCreditDate.value = nextResetTime.getTime();

  // Schedule the reset and recursively call this function to schedule the next one
};

const getCurrentCredits = () => {
  if (!token.value) return;
  sendMessage("get-credits-api", {}, "background").then((response) => {
    creditAmount.value = response?.credits || credits.value;
  });
};

getCurrentCredits();
scheduleDailyReset(creditResetAmount);

// redirectIfNoAuth();
</script>

<template>
  <main class="w-[300px] px-4 py-5 text-gray-700 space-y-1">
    <div class="flex pb-2">
      <img
        src="/assets/rb-icon.png"
        class="text-slate-700 text-lg"
        style="width: 36px; margin-top: -2px"
      />
      <div class="w-full text-lg font-bold">Respond Buddy</div>
      <button type="button" class="mr-4" @click="onSettingClick">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon icon-tabler icon-tabler-settings"
          width="19"
          height="19"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path
            d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"
          />
          <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
        </svg>
      </button>
    </div>
    <div class="flex">
      <button
        v-if="token"
        type="button"
        class="flex-1 text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        @click="onDashboardClick"
      >
        Go to Dashboard
      </button>

      <button
        v-if="!token"
        type="button"
        class="flex-1 text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        @click="onLoginClick"
      >
        Login
      </button>
      <button
        v-if="!token"
        type="button"
        class="flex-1 text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        @click="onRegisterClick"
      >
        Register
      </button>
    </div>
    <div class="flex">
      <button
        type="button"
        class="flex flex-col w-full items-center justify-center text-white focus:ring-4 focus:outline-none bg-gradient-to-br from-pink-400 to-blue-800 focus:ring-green-200 font-medium rounded-lg text-xs px-5 py-2.5 dark:hover:bg-[#050708]/40 dark:focus:ring-gray-600 mr-2 mb-2"
        @click="onChatGPTClick"
      >
        <div class="flex items-center justify-center">Go to OpenAI Chat</div>
        <div style="font-size: 10px" class="font-light mt-1">
          🚀 Try our prompts for free! 🚀
        </div>

        <!-- <img src="~/assets/message-question.svg" class="w-4 h-4 ml-2" /> -->
      </button>
    </div>
    <div class="flex">
      <button
        type="button"
        class="flex flex-col w-full items-center justify-center text-white focus:ring-4 focus:outline-none bg-gradient-to-br from-pink-400 to-blue-800 focus:ring-green-200 font-medium rounded-lg text-xs px-5 py-2.5 dark:hover:bg-[#050708]/40 dark:focus:ring-gray-600 mr-2 mb-2"
        @click="onChatClick"
      >
        <div class="flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="icon icon-tabler icon-tabler-message-question mr-2"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M8 9h8" />
            <path d="M8 13h6" />
            <path
              d="M14 18h-1l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v4.5"
            />
            <path d="M19 22v.01" />
            <path
              d="M19 19a2.003 2.003 0 0 0 .914 -3.782a1.98 1.98 0 0 0 -2.414 .483"
            />
          </svg>
          Start chatting now...
        </div>
        <div style="font-size: 10px" class="font-light mt-1">
          {{ `😎 ${creditAmount} credits remaining (renewed daily) 😎` }}
        </div>

        <!-- <img src="~/assets/message-question.svg" class="w-4 h-4 ml-2" /> -->
      </button>
    </div>
  </main>
</template>
