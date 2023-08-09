<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useToggle } from "@vueuse/core";
import { onMessage, sendMessage } from "webext-bridge/content-script";
import "uno.css";
import facebookSvg from "../../assets/facebook-svgrepo.svg";
import twitterSvg from "../../assets/twitter-svgrepo.svg";
import linkedinSvg from "../../assets/linkedin-svgrepo.svg";
import whatsappSvg from "../../assets/whatsapp-svgrepo.svg";
import clipboardTextSvg from "../../assets/clipboard-text.svg";
import analyzeSvg from "../../assets/analyze.svg";
import fileInfoSvg from "../../assets/file-info.svg";
// import helpHexagonSvg from "../../assets/help-hexagon.svg";
import languageSvg from "../../assets/language.svg";
import messageQuestionSvg from "../../assets/message-question.svg";
import oneTwoThreeSvg from "../../assets/onetwothree.svg";

const [show, toggle] = useToggle(false);
const isLoading = ref(false);
const messageInput = ref(null);
const popover = ref(null);
const fbaButton = ref(null);

const formattedText = (text: string) => {
  if (text?.includes("\n") || text?.includes("```")) {
    return text?.replace(/\n/g, "<br>")?.replace(/```/g, "&#96;&#96;&#96;"); // Replace \n with <br> and ``` with &#96;&#96;&#96; for rendering line breaks and backticks
  } else if (text) {
    return text;
  }
  return "";
};
const isCopiedTriggered = ref(-1);

const right = ref(0);
const bottom = ref(0);

let startX = 0;
let startY = 0;

let messageData = ref([]);
let questionInput = ref("");
let selectedText = ref("");
let selectionOffsetTop = ref(0);
let selectionOffsetLeft = ref(0);
let isSelectionShow = ref(false);
let toolbarItems = ref([
  {
    key: "summarize",
    name: "Summarize",
    icon: fileInfoSvg,
    isHovered: false,
    template: "Summarize: ",
  },
  {
    key: "respond",
    name: "Respond",
    icon: messageQuestionSvg,
    template: "Respond to: ",
  },
  {
    key: "translate",
    name: "Translate",
    icon: languageSvg,
    options: [
      {
        key: "english",
        name: "English",
        template: "Translate to English: ",
      },
      {
        key: "spanish",
        name: "Spanish",
        template: "Translate to Spanish: ",
      },
      {
        key: "french",
        name: "French",
        template: "Translate to French: ",
      },
      {
        key: "german",
        name: "German",
        template: "Translate to German: ",
      },
      {
        key: "italian",
        name: "Italian",
        template: "Translate to Italian: ",
      },
      {
        key: "chinese",
        name: "Chinese",
        template: "Translate to Chinese: ",
      },
    ],
    isHovered: false,
    isDropdownOpen: false,
  },
  {
    key: "simplify",
    name: "Simplify",
    icon: oneTwoThreeSvg,
    isHovered: false,
    template: "Simplify: ",
  },
  {
    key: "expand",
    name: "Expand",
    icon: analyzeSvg,
    isHovered: false,
    template: "Expand: ",
  },
  {
    key: "copy",
    name: "Copy",
    icon: clipboardTextSvg,
    isHovered: false,
    template: "Copy: ",
  },
  // {
  //   key: "others",
  //   name: "Others",
  //   icon: helpHexagonSvg,
  //   options: ["English", "Spanish", "French", "German", "Italian", "Chinese"],
  //   isHovered: false,
  //   isDropdownOpen: false,
  //   template: "Others:",
  // },
]);

const onClickToolbarItem = async (index: any) => {
  console.log("tool bar items", toolbarItems.value[index].key);
  console.log("tool bar items", toolbarItems.value[index].isDropdownOpen);

  if (
    toolbarItems.value[index]?.isDropdownOpen === false ||
    toolbarItems.value[index]?.isDropdownOpen === true
  ) {
    toolbarItems.value[index].isDropdownOpen =
      !toolbarItems.value[index]?.isDropdownOpen;

    console.log(toolbarItems.value[index]?.isDropdownOpen);

    return;
  }

  toggle(true);

  // If the toolbar item is "copy", don't send a message to the background script
  if (toolbarItems.value[index]?.key === "copy") {
    await navigator.clipboard.writeText(selectedText.value);
    questionInput.value = selectedText.value;
    adjustHeight();
    return;
  }

  console.log("tool bar items", toolbarItems.value[index]?.template);

  // If the toolbar item has template, send a message to the background script
  await sendMessage("ask-chat", {
    message: `${toolbarItems.value[index]?.template}${selectedText.value}}`,
  });
};

const onMouseEnterToolbarItem = (index: any) => {
  console.log("tool bar items", toolbarItems.value[index].key);
  toolbarItems.value[index].isHovered = true;
};

const onMouseLeaveToolbarItem = (index: any) => {
  console.log("tool bar items", toolbarItems.value[index].key);

  toolbarItems.value[index].isHovered = false;
};

let socialMediaShareMessage = ref([
  "I just found this awesome tool that saves time with reading and writing. Check it out! 😍",
  "This extension has completely changed the way I read online. You've got to see this! 😍",
  "Hey, I came across this cool extension that makes reading and writing so much easier. Thought you might like it too! 😍",
  "You're going to love this! It's an extension that helps you understand complex text easily. It's like having GPT at your fingertips 😍",
  "Found something cool that I know you'll appreciate. It's an extension that simplifies, summarizes, and does all sorts of things with text. Give it a try 😍",
  "I came across this Chrome extension, and it's like magic for reading! I know you'll find it useful too. 😍",
  "Just stumbled upon this reading assistant tool. It's like it reads my mind and knows exactly what I need from a text. 😍",
  "Imagine having a tool that can summarize or expand any text online. Well, I found it! I think you'll love it as much as I do. 😍",
]);

const getRandomItem = (arr: []) => {
  if (!arr.length) {
    return null; // Return null if the array is empty
  }

  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
};

watch(questionInput, () => {
  adjustHeight();
});

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

const adjustHeight = () => {
  const textarea = messageInput.value;
  textarea.style.height = "auto";
  textarea.style.height = `${Math.min(textarea.scrollHeight, 100)}px`; // Limit to 100px or five lines
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

onMessage("app-message", (message) => {
  console.log("🚀 ~ file: App.vue:25 ~ onMessage ~ message:", message);
  toggle(true);
  messageData.value.push(message.data?.appMessages);
  isLoading.value = !isLoading.value;
  console.log("🚀 ~ file: App.vue:115 ~ onMessage ~ isLoading:", isLoading);
  console.log(
    "🚀 ~ file: App.vue:109 ~ onMessage ~ messageData:",
    messageData.value
  );
});

const onSendClick = async () => {
  const message = questionInput.value;
  if (!message) {
    return;
  }

  console.log("🚀 ~ file: App.vue:131 ~ onSendClick ~ onSendClick:", message);

  const res = await sendMessage("ask-chat", {
    message,
  });

  console.log(res);

  questionInput.value = "";

  adjustHeight();
};

const handleOutsideClick = (event) => {
  if (
    event?.target &&
    (event?.target.id === "vitesse-webext" ||
      event?.target.closest("#vitesse-webext"))
  ) {
    return;
  }

  // Close the popover if the click was outside both the button and the popover
  toggle(false);
};

watchEffect(() => {
  document.body.style.overflow = show.value ? "hidden" : "";
});

watchEffect(() => {
  if (show.value) {
    nextTick(() => {
      scrollToBottomInChatLog();
    });
  }
});

const scrollToBottomInChatLog = () => {};

const dragStart = (e) => {
  console.log("dragStart", e);
  startX = e.clientX;
  startY = e.clientY;
  document.addEventListener("mousemove", dragMove);
  document.addEventListener("mouseup", dragEnd);
};

const dragMove = (e) => {
  right.value += startX - e.clientX;
  bottom.value += startY - e.clientY;
  startX = e.clientX;
  startY = e.clientY;
};

const showIconOnSelection = () => {
  const selectedText = window.getSelection().toString().trim();
  console.log(
    "🚀 ~ file: index.ts:23 ~ showIconOnSelection ~ selectedText:",
    selectedText
  );
  if (selectedText.length > 0) {
    browser.runtime.sendMessage({ type: "highlight", text: selectedText });
  }
};

const dragEnd = () => {
  document.removeEventListener("mousemove", dragMove);
  document.removeEventListener("mouseup", dragEnd);
};

const copyMessage = (message, index) => {
  isCopiedTriggered.value = index;
  console.log(
    "🚀 ~ file: App.vue:46 ~ copyMessage ~ isCopiedTriggered:",
    isCopiedTriggered.value
  );
  console.log("🚀 ~ file: App.vue:44 ~ copyMessage ~ message:", message);
  navigator.clipboard
    .writeText(message)
    .then(() => {
      console.log("Message copied to clipboard");
    })
    .catch((err) => {
      console.error("Failed to copy message: ", err);
    });
  setTimeout(() => {
    isCopiedTriggered.value = -1;
  }, 200);
};

const onClickToolbarOption = async (message: string) => {
  console.log(
    "🚀 ~ file: App.vue:350 ~ onClickToolbarOption ~ message:",
    message
  );

  toggle(true);

  await sendMessage("ask-chat", {
    message: `${message} ${selectedText.value}`,
  });
};

const showToolbar = () => {
  if (show.value) return;
  const selection = window.getSelection();
  console.log("🚀 ~ file: App.vue:231 ~ showToolbar ~ selection:", selection);
  selectedText.value = selection?.toString().trim();
  if (selectedText.value.length > 0) {
    const range = selection?.getRangeAt(0).cloneRange();
    range?.collapse(false);

    const dummy = document.createElement("span");
    range?.insertNode(dummy);

    const rect = dummy.getBoundingClientRect();
    console.log(rect);
    selectionOffsetLeft.value = rect.left;
    selectionOffsetTop.value = rect.bottom;

    // const range = selection?.getRangeAt(0);
    // const rect = range?.getBoundingClientRect();
    // selectionOffsetTop.value = rect?.bottom + 1; // 10px offset
    // selectionOffsetLeft.value = rect?.right - 1; // 10px offset
    isSelectionShow.value = true;

    dummy.parentNode.removeChild(dummy);
  } else {
    isSelectionShow.value = false;
  }
};

document.addEventListener("mouseup", function () {
  showToolbar();
});

onMounted(() => {
  document.addEventListener("mousedown", handleOutsideClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleOutsideClick);
});
</script>

<template>
  <div>
    <div
      v-if="isSelectionShow"
      :style="{
        top: `${selectionOffsetTop}px`,
        left: `${selectionOffsetLeft}px`,
      }"
      class="popup border border-gray-300 shadow-md rounded-lg z-50 flex p-1"
    >
      <!-- Add toolbar buttons or items here -->
      <button
        v-for="(item, index) in toolbarItems"
        @mouseenter="onMouseEnterToolbarItem(index)"
        @mouseleave="onMouseLeaveToolbarItem(index)"
        @click="onClickToolbarItem(index)"
        class="relative bg-transparent border-none hover:blue-500 focus:outline-none"
        :key="index"
      >
        <!-- Icon (replace with your icon) -->
        <img
          :src="item.icon"
          :alt="item.name"
          class="w-4 h-4 focus:text-blue-500 hover:text-blue-300"
        />
        <!-- Tooltip -->
        <span
          v-if="item.isHovered"
          class="px-1 text-xs text-gray-100 rounded-md absolute left-1/2 -translate-x-1/2 translate-y-full"
          style="background-color: #448aff"
          >{{ item.name }}</span
        >
        <!-- Dropdown -->
        <div
          v-if="item?.isDropdownOpen"
          class="absolute bg-white shadow-xl border rounded p-2 mt-2 text-xs text-gray-700 shadow-md z-50"
          style="width: 70px"
        >
          <div v-for="option in item.options" class="p-1">
            <div @click="onClickToolbarOption(option.template)">
              {{ option.name }}
            </div>
          </div>
        </div>
      </button>
    </div>
    <div
      :style="{ right: `${right}px`, bottom: `${bottom}px` }"
      class="fixed flex right-0 bottom-0 m-5 z-100 flex items-end font-sans leading-1em"
    >
      <div
        v-show="show"
        id="popover"
        ref="popover"
        class="flex flex-col bg-white text-gray-800 rounded-lg shadow-lg w-max h-min m-2"
        m="y-auto r-2"
        style="width: 320px; min-height: 300px; max-height: 600px"
        transition="opacity duration-300"
        :class="show ? 'opacity-100' : 'opacity-0'"
      >
        <div
          v-if="messageData.length > 0"
          class="flex-grow overflow-y-auto rounded-lg"
        >
          <div
            v-for="(msgGrp, index) in messageData"
            :key="index"
            style="border-bottom: 1px solid rgb(235, 234, 226)"
            class="chat-group d-flex align-start pa-1"
            :class="
              msgGrp.senderId ? 'sender-msg-container' : 'bot-msg-container'
            "
          >
            <div
              v-for="(msgData, msgIndex) in msgGrp.messages"
              :key="msgIndex"
              class="chat-font ml-1"
              :class="[
                msgGrp?.messages.length - 1 !== msgIndex ? 'mb-3' : 'mb-1',
              ]"
            >
              <pre
                class="formatted-text my-0 select-all"
                v-html="formattedText(msgData?.message)"
              ></pre>
              <p
                v-if="isCopiedTriggered === -1 || isCopiedTriggered !== index"
                class="text-blue-600 hover:text-blue-800 underline text-xs my-0 cursor-pointer"
                style="font-size: 8px"
                @click="copyMessage(msgData?.message, index)"
              >
                Copy
              </p>
              <p
                v-else-if="isCopiedTriggered === index"
                class="italic my-0"
                style="font-size: 8px"
              >
                Copied
              </p>
            </div>
          </div>
        </div>
        <div v-else class="flex-grow overflow-y-auto rounded-lg p-2">
          <div class="text-lg">Welcome to Respond Buddy! 👋</div>
          <div class="text-xs">
            Ready to try it? 🤔
            <br />
            <br />
            Right-click on any text in your browser 🖱️, choose from options like
            'Summarize,' 'Simplify,' or 'Expand.'
            <br />
            <br />
            Or start by asking a question at the bottom in the chat box. 📝
            <br />
            <br />
            If you love it, signup or login 😍
          </div>
          <div class="flex gap-2 mt-2">
            <button
              type="button"
              class="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2 text-center mr-2 mb-2 border-none"
            >
              Login / Register
            </button>
          </div>
          <div class="text-xs">
            Please share it with your friends! 🙏 (Extra limits if you do)
          </div>
          <div class="flex gap-1 border-none">
            <button
              v-for="social in socialMediaContents"
              class="py-2 bg-transparent border-none hover:text-gray-300 cursor-pointer hover:shadow-lg rounded-full active:scale-95 focus:outline-none"
              @click="shareToSocialMedia(social.type)"
            >
              <img class="w-5 h-5" :src="social.icon" />
            </button>
          </div>
        </div>
        <div
          class="flex relative w-full bg-white-100 border-t-1 border-slate-400"
          style="border-top: solid; border-width: 1px; border-color: #cfd8dc"
        >
          <textarea
            v-model="questionInput"
            :disabled="isLoading"
            ref="messageInput"
            type="search"
            id="message-input"
            :class="isLoading ? 'cursor-wait' : ''"
            class="block w-full m-2 z-20 text-sm text-slate-900 font-sans overflow-y-auto"
            rows="1"
            style="
              background: transparent;
              border: none;
              outline: none;
              resize: none;
            "
            :placeholder="!isLoading ? 'Ask a question...' : 'Loading...'"
            required
            @input="adjustHeight"
          />
          <button
            v-if="!isLoading"
            class="flex bg-white cursor-pointer border-none items-center justify-center mx-2 active:scale-95 focus:outline-none"
            @click="onSendClick"
          >
            <!-- Replace this with your send icon -->
            <img
              src="/assets/tabler-send.svg"
              class="text-slate-700 text-lg w-4 h-4 focus:text-blue-500 hover:text-blue-300"
            />
          </button>
          <button v-else type="button" class="bg-white border-none" disabled>
            <svg
              aria-hidden="true"
              class="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </button>
        </div>
      </div>
      <button
        class="flex w-10 h-10 rounded-full shadow cursor-pointer border-none"
        ref="fbaButton"
        @mousedown.prevent="dragStart"
        @click.stop="toggle()"
      >
        <pixelarticons-power class="block m-auto text-white text-lg" />
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Add rotating animation to the icon */
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loading .loader {
  animation: rotate 1s linear infinite;
}

.chat-log {
  .chat-content {
    border-end-end-radius: 6px;
    border-end-start-radius: 6px;

    &.chat-left {
      border-start-end-radius: 6px;
    }

    &.chat-right {
      border-start-start-radius: 6px;
    }
  }
}

.chat-font {
  font-style: normal;
  font-size: 12px;
  font-weight: 400;
  color: #212121;
}

.sender-msg-container {
  background-color: white;
}

.bot-msg-container {
  background-color: rgb(250, 249, 246);
}

.formatted-text {
  white-space: pre-wrap; /* Preserve whitespace and wrap long lines */
  font-style: normal;
  font-size: 12px;
  font-weight: 400;
  font-family: "Public Sans", sans-serif !important;
  color: #212121;
}

#message-input::-webkit-scrollbar {
  width: 5px; /* Set the width of the scrollbar */
}

.popup {
  position: fixed;
  background-color: white;
  border: 1px solid black;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  z-index: 1000;
}
</style>
