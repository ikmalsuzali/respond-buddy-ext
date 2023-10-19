<template>
  <div
    class="realtive sticky top-0 w-full rounded-b-3xl bg-center cursor-pointer object-cover z-10 shadow-lg gradient"
    :style="`background-image: linear-gradient(to bottom, rgba(30, 58, 138, 0.82), rgba(59,130,246, 0.89)), url(${homeBackgroundUrl})`"
  >
    <div class="pt-5 px-3 rounded-lg flex flex-col w-full text-white">
      <div class="font-bold text-xl my-10">Welcome to Respond Buddy! 👋</div>
      <div class="text-md">
        Ready to try it? 🤔 Highlight on any text in your browser 🖱️, choose
        from options like 'Summarize,' 'Simplify,' or 'Expand.'
        <br />
        Or start by asking a question at the bottom in the chat box. 📝
        <br />
      </div>
    </div>

    <div class="flex items-center justify-between px-3 z-10">
      <div class="relative w-full my-4">
        <input
          type="text"
          class="bg-purple-white shadow rounded-xl border-0 p-3 w-full bg-white"
          placeholder="Ask me anything"
        />
        <div class="absolute top-0 right-0 p-4 pr-3 text-purple-lighter">
          <PaperAirplaneIcon class="h-5 w-5 fill-gray-400" aria-hidden="true" />
        </div>
      </div>
    </div>
  </div>
  <div class="flex-grow overflow-y-auto rounded-lg px-5 space-y-2">
    <div
      v-if="!token"
      class="flex flex-col gap-2 mt-2"
      :style="`font-size: ${
        prompts.settings?.fontSize ? prompts.settings?.fontSize : '12'
      }px;`"
    >
      <div class="text-lg font-bold">If you love it, signup or login 😍</div>
      <div class="flex">
        <button
          @click="onClickLoginRegister('login')"
          type="button"
          class="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none font-medium rounded-lg text-md px-5 py-2 text-center mr-2 mb-2 border-none"
          style="color: white"
        >
          Login
        </button>
        <button
          @click="onClickLoginRegister('register')"
          type="button"
          class="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none font-medium rounded-lg text-md px-5 py-2 text-center mr-2 mb-2 border-none"
          style="color: white"
        >
          Register
        </button>
      </div>
    </div>
    <div
      v-else
      class="flex flex-col gap-2 mt-3"
      :style="`font-size: ${props.settings?.fontSize + 1}px;`"
    >
      <div class="text-lg font-bold">Access the app</div>
      <button
        @click="onDashboardClick"
        type="button"
        class="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none font-medium rounded-lg text-md px-5 py-2 text-center mr-2 mb-2 border-none"
        style="color: white"
      >
        Go to Dashboard
      </button>
    </div>
    <div class="text-lg font-bold">Please share it with your friends! 🙏</div>
    <div class="flex gap-2 border-none">
      <button
        v-for="social in socialMediaContents"
        class="p-2 bg-transparent border-none hover:text-gray-300 cursor-pointer hover:shadow-lg hover:rounded active:scale-95 focus:outline-none"
        @click="shareToSocialMedia(social.type)"
      >
        <img class="w-10 h-10" :src="social.icon" />
      </button>
    </div>
    <div class="text-lg font-bold">Start with these prompts 🚀</div>
    <div>
      <div class="flex mt-2" style="flex-wrap: wrap">
        <div v-for="prompt in props.prompts">
          <button
            type="button"
            class="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none font-medium rounded-lg text-md px-5 py-2 text-center mr-2 mb-2 border-none"
            style="color: white"
          >
            {{ prompt.name }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import facebookSvg from "../../assets/facebook-svgrepo.svg";
import twitterSvg from "../../assets/twitter-svgrepo.svg";
import linkedinSvg from "../../assets/linkedin-svgrepo.svg";
import whatsappSvg from "../../assets/whatsapp-svgrepo.svg";
import { defineProps, ref, withDefaults } from "vue";

interface Props {
  token: string;
  settings: any;
  prompts: any[];
}

const props = withDefaults(defineProps<Props>(), {
  token: "",
  settings: {},
  prompts: [],
});

const homeBackgroundUrl = browser.runtime.getURL("assets/blue-bg-home.jpg");

const socialMediaShareMessage = ref([
  "I just found this awesome tool that saves time with reading and writing. Check it out! 😍",
  "This extension has completely changed the way I read online. You've got to see this! 😍",
  "Hey, I came across this cool extension that makes reading and writing so much easier. Thought you might like it too! 😍",
  "You're going to love this! It's an extension that helps you understand complex text easily. It's like having GPT at your fingertips 😍",
  "Found something cool that I know you'll appreciate. It's an extension that simplifies, summarizes, and does all sorts of things with text. Give it a try 😍",
  "I came across this Chrome extension, and it's like magic for reading! I know you'll find it useful too. 😍",
  "Just stumbled upon this reading assistant tool. It's like it reads my mind and knows exactly what I need from a text. 😍",
  "Imagine having a tool that can summarize or expand any text online. Well, I found it! I think you'll love it as much as I do. 😍",
]);

const socialMediaContents = ref([
  {
    type: "facebook",
    icon: facebookSvg,
  },
  {
    type: "twitter",
    icon: twitterSvg,
  },
  {
    type: "linkedin",
    icon: linkedinSvg,
  },
  {
    type: "whatsapp",
    icon: whatsappSvg,
  },
]);

const onClickLoginRegister = (type: string) => {
  const loginWebUrl = "https://app.respondbuddy.com/";
  const registerWebUrl = "https://app.respondbuddy.com/register";
  if (type === "register") {
    window.open(registerWebUrl, "_blank");
    return;
  }
  window.open(loginWebUrl, "_blank");
};

const onDashboardClick = () => {
  const webUrl = "https://app.respondbuddy.com";
  window.open(webUrl, "_blank");
};

const shareToSocialMedia = (platform: string, content?: any = {}) => {
  const url = encodeURIComponent(content.url || "https://respondbuddy.com");
  const text = encodeURIComponent(
    content.text ||
      getRandomItem(socialMediaShareMessage.value) ||
      "I just found this awesome tool that saves time with reading and writing. Check it out!"
  );

  let shareUrl = "";

  switch (platform) {
    case "facebook":
      shareUrl = `https://www.facebook.com/sharer.php?u=${url}`;
      break;
    case "twitter":
      shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
      break;
    case "linkedin":
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
      break;
    case "whatsapp":
      shareUrl = `https://wa.me/?text=${text}%20${url}`;
      break;
    // Add more cases for other platforms if needed
    default:
      console.warn("Unknown platform:", platform);
      return;
  }

  // Open the share URL in a new window
  window.open(shareUrl, "_blank");
};

const getRandomItem = (arr: []) => {
  if (!arr.length) {
    return null; // Return null if the array is empty
  }

  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
};
</script>
