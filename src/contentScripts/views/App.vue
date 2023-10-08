<script setup lang="ts">
import "../../styles/main.css";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useToggle } from "@vueuse/core";
import { onMessage, sendMessage } from "webext-bridge/content-script";
// import "uno.css";
import facebookSvg from "../../assets/facebook-svgrepo.svg";
import twitterSvg from "../../assets/twitter-svgrepo.svg";
import linkedinSvg from "../../assets/linkedin-svgrepo.svg";
import whatsappSvg from "../../assets/whatsapp-svgrepo.svg";
import clipboardTextSvg from "../../assets/clipboard-text.svg";
import analyzeSvg from "../../assets/analyze.svg";
import fileInfoSvg from "../../assets/file-info.svg";
import languageSvg from "../../assets/language.svg";
import messageQuestionSvg from "../../assets/message-question.svg";
import oneTwoThreeSvg from "../../assets/onetwothree.svg";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  PaperAirplaneIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/vue/24/solid";
import {
  HeartIcon as HeartOutlineIcon,
  ChartBarIcon,
} from "@heroicons/vue/24/outline";
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/vue";
import { CheckIcon, ChevronDownIcon } from "@heroicons/vue/20/solid";

const publishingOptions = [
  {
    title: "Published",
    description: "This job posting can be viewed by anyone who has the link.",
    current: true,
  },
  {
    title: "Draft",
    description: "This job posting will no longer be publicly accessible.",
    current: false,
  },
];

const sortByMenuItems = ref([
  {
    name: "Top usage",
    current: false,
    key: "top_usage",
  },
  {
    name: "Top trending",
    current: false,
    key: "top_trending",
  },
  {
    name: "Private",
    current: false,
    key: "private",
  },
  {
    name: "Relevance",
    current: false,
    key: "relevance",
  },
  {
    name: "Latest update",
    current: false,
    key: "latest_update",
  },
]);

const currentSortByItem = ref(sortByMenuItems.value[0]);
const onSortByMenuItemClick = (item: any) => {
  currentSortByItem.value = item;
};

const categoryItems = [
  {
    name: "Use Cases",
    current: false,
    key: "",
  },
  {
    name: "Marketing",
    current: false,
    key: "marketing",
  },
  {
    name: "Students",
    current: false,
    key: "students",
  },
  {
    name: "Finance",
    current: false,
    key: "finance",
  },
  {
    name: "Software Engineering",
    current: false,
    key: "software_engineering",
  },
];

const currentCategoryItem = ref(categoryItems[0]);
const onFilterCategoryItem = (item: any) => {
  currentCategoryItem.value = item;
};

const selected = ref(publishingOptions[0]);

import {
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";

const webConfig = ref([
  {
    website: "Medium",
    matchUrl: "medium.com/",
    selector: "section",
    actions: ["summarize-web"],
    style: {
      "text-align": "center",
      padding: "20px",
      "margin-bottom": "-25px",
    },
  },
  // ...other objects for different websites or conditions
]);
const currentConfig = ref({});
const [show, toggle] = useToggle(false);
const sidebar = ref(null);
const isLoading = ref(false);
const messageInput = ref(null);
const popover = ref(null);
const fbaButton = ref(null);
const credits = ref(0);
const chatContainer = ref(null);
const isSidebar = ref(true);
const isCopiedTriggered = ref(-1);
const popoverType = ref("selection");
const settings = ref({
  fontSize: 12,
});
let homeBackgroundUrl = browser.runtime.getURL("assets/blue-bg-home.jpg");
const token = ref("");
const isSidebarDragging = ref(false);
const sidebarStartX = ref(0);
const sidebarWidth = ref(300);
const sidebarTabHeaders = ref([
  {
    name: "Home",
    key: "home",
  },
  {
    name: "Prompts",
    key: "prompts",
  },
  {
    name: "Chat",
    key: "chat",
  },
]);

const right = ref(0);
const bottom = ref(45);
const sidebarKey = ref(0);

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
      // {
      //   key: "chinese",
      //   name: "Chinese",
      //   template: "Translate to Cfhinese: ",
      // },
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
let teleportTarget = ref("body");

console.log("hello");
let prompts = ref([
  {
    name: "Summarize this page",
    key: "summarize-page",
    action: () => {
      updateInput("Summarize this page");
      onSendClick();
    },
  },
  {
    name: "Expand this statement:",
    key: "expand",
    action: () => {
      updateInput("Expand this statement:");
    },
  },
  {
    name: "Who is the possible audience",
    key: "audience-finder",
    action: () => {
      updateInput("Who is the possible audience");
      onSendClick();
    },
  },
  {
    name: "Organize this into a list",
    key: "organize-list",
    action: () => {
      updateInput("Organize this into a list");
      onSendClick();
    },
  },
]);

const formattedText = (text: string) => {
  if (text?.includes("\n") || text?.includes("```")) {
    return text?.replace(/\n/g, "<br>")?.replace(/```/g, "&#96;&#96;&#96;"); // Replace \n with <br> and ``` with &#96;&#96;&#96; for rendering line breaks and backticks
  } else if (text) {
    return text;
  }
  return "";
};

const onClickToolbarItem = async (index: any) => {
  if (
    toolbarItems.value[index]?.isDropdownOpen === false ||
    toolbarItems.value[index]?.isDropdownOpen === true
  ) {
    toolbarItems.value[index].isDropdownOpen =
      !toolbarItems.value[index]?.isDropdownOpen;

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

  // If the toolbar item has template, send a message to the background script
  await sendMessage("ask-chat", {
    message: `${toolbarItems.value[index]?.template}${selectedText.value}`,
  });
};

const startSidebarDrag = (event: any) => {
  sidebarKey.value += 1;
  console.log("sidebar", sidebar.value);
  isSidebarDragging.value = true;
  sidebarStartX.value = event.clientX;
  console.log(
    "🚀 ~ file: App.vue:248 ~ startSidebarDrag ~ event.clientX:",
    event
  );
  sidebarWidth.value = sidebar.value?.offsetWidth;
  console.log(
    "🚀 ~ file: App.vue:250 ~ startSidebarDrag ~ sidebar.value?.offsetWidth:",
    sidebar.value?.offsetWidth
  );
};

const stopSidebarDrag = () => {
  isSidebarDragging.value = false;
};

const onMouseEnterToolbarItem = (index: any) => {
  toolbarItems.value[index].isHovered = true;
};

const onMouseLeaveToolbarItem = (index: any) => {
  toolbarItems.value[index].isHovered = false;
};

const handleMouseMove = (event) => {
  if (isSidebarDragging.value) {
    const diffX = event.clientX - sidebarStartX.value;
    const newWidth = sidebarWidth.value - diffX;

    if (newWidth >= 300 && newWidth <= 1000) {
      sidebar.value.style.width = `${newWidth}px`;
    }
  }
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
  nextTick(() => {
    const textarea = messageInput.value;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 100)}px`; // Limit to 100px or five lines
  });
};

const onClickLoginRegister = (type: string) => {
  const loginWebUrl = "https://app.respondbuddy.com/";
  const registerWebUrl = "https://app.respondbuddy.com/register";
  if (type === "register") {
    window.open(registerWebUrl, "_blank");
    return;
  }
  window.open(loginWebUrl, "_blank");
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

const onHeartClick = (prompt) => {
  prompt.isLiked = !prompt.isLiked;
};

const onDashboardClick = () => {
  const webUrl = "https://app.respondbuddy.com";
  window.open(webUrl, "_blank");
};

onMessage("toggle-chat", (_) => {
  toggle(true);
});

onMessage("app-message", (message) => {
  toggle(true);

  if (message?.data?.appMessages?.update === true) {
    // Get last messageData index where appMessages senderId is null
    const lastMessageIndex = messageData.value
      .map((msg) => msg.senderId)
      .lastIndexOf(null);

    // Replace messages[0].messages
    messageData.value[lastMessageIndex].messages[0] =
      message.data?.appMessages?.messages[0];
  } else {
    messageData.value.push(message.data?.appMessages);
  }

  isLoading.value = message.data?.appMessages?.loading;

  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
});

onMessage("tab-updated", (message) => {
  if (message?.data?.changeInfo?.status === "complete") {
    // set a delay of 2 second then trigger the function
    addHoverStyles();
    setTimeout(() => {
      // renderImageIconButton();
    }, 2000);
  }
});

const updateInput = (value: string) => {
  questionInput.value = value;
};

const onSendClick = async () => {
  const message = questionInput.value;

  if (!message) {
    return;
  }

  let response = await sendMessage(
    "ask-chat",
    {
      message,
      metadata: {
        current_website_url: window.location.href,
        url_body_content: document.body.innerText,
      },
    },
    "background"
  );
  questionInput.value = "";

  adjustHeight();

  if (!response?.credits) return;
  else credits.value = response.credits;
};

const handleOutsideClick = (event) => {
  console.log("handle outside click");
  if (!selectedText.value || selectedText.value === "") {
    console.log('handle outside click, selectedText.value === "');
    isSelectionShow.value = false;
  }

  if (
    event?.target &&
    (event?.target.id === "respond-buddy" ||
      event?.target.closest("#respond-buddy"))
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
  startX = e.clientX;
  startY = e.clientY;
  document.addEventListener("mousemove", dragMove);
  document.addEventListener("mouseup", dragEnd);
};

const dragMove = (e) => {
  right.value += startX - e.clientX;
  bottom.value += startY - e.clientY;
  setChatButtonPosition({ right: right.value, bottom: bottom.value });
  startX = e.clientX;
  startY = e.clientY;
};

const showIconOnSelection = () => {
  const selectedText = window.getSelection().toString().trim();

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

  navigator.clipboard.writeText(message);

  setTimeout(() => {
    isCopiedTriggered.value = -1;
  }, 200);
};

const onClickToolbarOption = async (message: string) => {
  toggle(true);

  await sendMessage("ask-chat", {
    message: `${message} ${selectedText.value}`,
  });
};

const showToolbar = (event?: any, meta?: any) => {
  if (show.value) return;
  const selection = window.getSelection();
  if (!selection?.toString().trim()) {
    isSelectionShow.value = false;
    return;
  }
  selectedText.value = selection?.toString().trim();
  if (selectedText.value.length > 0) {
    popoverType.value = "selection";
    const range = selection?.getRangeAt(0).cloneRange();
    range?.collapse(false);

    const dummy = document.createElement("span");
    range?.insertNode(dummy);

    const rect = dummy.getBoundingClientRect();
    const parentElement = range?.commonAncestorContainer.parentElement;
    // Check if the selection is within an input or textarea element
    if (
      parentElement &&
      (parentElement.tagName === "INPUT" ||
        parentElement.tagName === "TEXTAREA")
    ) {
      // Adjust the position to display the toolbar outside the input box
      selectionOffsetLeft.value =
        parentElement.offsetLeft + parentElement.offsetWidth + 10; // 10px offset from the right
      selectionOffsetTop.value = parentElement.offsetTop;
    } else {
      selectionOffsetLeft.value = rect.left;
      selectionOffsetTop.value = rect.bottom;
    }

    isSelectionShow.value = true;
    dummy.parentNode.removeChild(dummy);
  } else {
    // Check if the event target (clicked item) is an image or any other specific element
    if (
      event &&
      event?.target &&
      event?.target?.offsetParent?.className.includes("image-selected")
    ) {
      popoverType.value = "image";
      const rect = event.target.getBoundingClientRect();
      selectionOffsetLeft.value = Math.min(
        window.innerWidth - 200,
        rect.left + window.scrollX
      );
      selectionOffsetTop.value = Math.max(
        window.innerHeight,
        rect.bottom + window.scrollY
      );

      isSelectionShow.value = true;
    }

    isSelectionShow.value = false;
  }
};

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  return true;
});

const getToken = () => {
  sendMessage("get-token", {}, "background").then((response) => {
    token.value = response || "";
  });
};

const getTemplates = () => {
  sendMessage("get-templates", {}, "background").then((response) => {
    console.log(response);
    // prompts.value = response
    let templates = response || [];
    if (templates?.length === 0) {
      return;
    }
    prompts.value = templates?.map((template: any) => {
      return {
        name: template?.name,
        key: template?.key,
        isLiked: template?.is_liked || false,
        action: () => {
          updateInput(template?.base_message[0]);
          if (!template?.ai_template) {
            onSendClick();
          }
        },
      };
    });

    console.log(prompts.value);
  });
};

// -- Template -- //
// const get = async (key) => {
//   return await sendMessage("get", key);
// };

// const set = async (key, value) => {
//   return await sendMessage("set", { key, value });
// };

const getFontSize = () => {
  sendMessage("get-font-size", {}, "background").then((response) => {
    settings.value = {
      ...settings.value,
      fontSize: response.fontSize || 14,
    };
  });
};

const setFontSize = () => {
  sendMessage("set-font-size", { fontSize: settings.value.fontSize });
};

const getChatButtonPosition = () => {
  sendMessage("get-chat-button-position", {}, "background").then((response) => {
    right.value = response?.right || 0;
    bottom.value = response?.bottom || 45;
  });
};

const setChatButtonPosition = ({ right, bottom }) => {
  sendMessage(
    "set-chat-button-position",
    {
      right: right,
      bottom: bottom,
    },
    "background"
  );
};

const getMessages = () => {
  sendMessage("get-messages", {}, "background").then((response) => {
    messageData.value = response?.messages || [];
  });
};

const setMessages = () => {
  sendMessage("set-messages", { messages: messageData.value });
};

const renderImageIconButton = () => {
  // Get all images in the document
  const images = document.querySelectorAll("img");

  images.forEach((img) => {
    // Check if image is greater than 100px in width or height
    if (img.width < 50 || img.height < 50) return;

    // For each image, create a container
    const container = document.createElement("div");
    container.style.position = "relative";
    container.style.display = "inline-block";

    img.parentNode.insertBefore(container, img);
    container.appendChild(img);

    // Create the icon button
    const button = document.createElement("button");
    button.style.position = "absolute";
    button.style.top = "0";
    button.style.right = "0";
    button.style.border = "none";
    button.style.borderRadius = "50%";
    button.style.margin = "5px";
    button.classList.add("expand-on-hover"); // Add the class
    button.classList.add("image-selected"); // Add the class
    button.onclick = function (event) {
      event?.stopPropagation();
      event?.preventDefault();
      event?.stopImmediatePropagation();
      showToolbar(event, {
        popoverType: "image",
      });
    };

    const icon = document.createElement("img");
    icon.src = browser.runtime.getURL("assets/rb-icon.png"); // Replace 'icon.svg' with 'icon.png' if you're using a PNG
    icon.style.width = "15px"; // Adjust size as necessary
    icon.style.height = "15px"; // Adjust size as necessary

    button.appendChild(icon);

    container.appendChild(button);
  });
};

const addHoverStyles = () => {
  const style = document.createElement("style");
  style.innerHTML = `
        .expand-on-hover {
            transition: transform 0.3s ease-in-out;
        }

        .expand-on-hover:hover {
            transform: scale(1.2);
        }
    `;
  document.head.appendChild(style);
};

const handleZoomChange = () => {
  // Handle zoom change by adjusting startX and startY
  const zoomLevel = window.devicePixelRatio || 1;
  startX *= zoomLevel;
  startY *= zoomLevel;
};

onMounted(() => {
  getToken();
  getFontSize();
  getChatButtonPosition();
  getTemplates();
  // addHoverStyles();
  // renderImageIconButton();
  // onSettingsInit();
  // getCurrentCredits();
  document.addEventListener("mousedown", handleOutsideClick);
  window.addEventListener("resize", handleZoomChange);
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", stopSidebarDrag);
  document.addEventListener("mouseup", () => {
    showToolbar();
  });

  document.addEventListener("input", () => {
    selectedText.value = "";
    isSelectionShow.value = false;
  });

  webConfig.value?.forEach((config: any) => {
    if (window.location.href.includes(config.matchUrl)) {
      let configElement = document.querySelector(config.selector);
      currentConfig.value = config;
      if (configElement) {
        teleportTarget.value = document.createElement("div");
        configElement.insertBefore(
          teleportTarget.value,
          configElement.firstChild
        );
      }
    }
  });

  // const promptTextarea = document.querySelector("#prompt-textarea");
  // console.log("prompt text area", promptTextarea);
  // const container = document.createElement("div");
  // container.style.display = "flex";
  // // promptTextarea.parentNode.insertBefore(container, promptTextarea);
  // const app = createApp(Combobox);
  // app.mount(container);
  // const button1 = document.createElement("button");
  // button1.textContent = "Button 1";
  // const button2 = document.createElement("button");
  // button2.textContent = "Button 2";
  // const button3 = document.createElement("button");
  // button3.textContent = "Button 3";
  // container.appendChild(button1);
  // container.appendChild(button2);
  // container.appendChild(button3);
  // promptTextarea.parentNode.insertBefore(container, promptTextarea);

  // let configElement = document.querySelector("section");
  // console.log(
  //   "🚀 ~ file: App.vue:715 ~ onMounted ~ configElement:",
  //   configElement
  // );
  // if (configElement) {
  //   teleportTarget.value = document.createElement("div");
  //   configElement.insertBefore(teleportTarget.value, configElement.firstChild);
  // }

  // document.addEventListener("DOMContentLoaded", () => {
  //   // Use the configurable selector
  //   console.log("DOMContentLoaded");
  //   let configElement = document.querySelector("section");
  //   console.log(configElement);
  //   if (configElement) {
  //     let currentUrl = window.location.href;
  //     if (currentUrl.includes("medium.com/")) {
  //       console.log(window.location.href);
  //     }
  //   }
  // });
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleOutsideClick);
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", stopSidebarDrag);
});
</script>

<template>
  <div>
    <teleport :to="teleportTarget">
      <div v-if="teleportTarget !== 'body'" :style="currentConfig?.style || {}">
        <h1>Hello from the other side</h1>
      </div>
    </teleport>
    <div
      v-if="isSelectionShow"
      :style="{
        top: `${selectionOffsetTop}px`,
        left: `${selectionOffsetLeft}px`,
        position: `${
          popoverType == 'selection'
            ? 'fixed !important'
            : 'absolute !important'
        }`,
      }"
      style="z-index: 9999999999; background-color: white"
      class="popup border border-gray-300 shadow-md rounded-lg flex p-1"
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
          class="w-5 h-5 focus:text-blue-500 hover:text-blue-300"
        />
        <!-- Tooltip -->
        <span
          v-if="item.isHovered"
          class="px-1 text-xs text-gray-100 rounded-md absolute left-1/2 -translate-x-1/2 translate-y-full"
          style="
            background-color: #448aff;
            --un-translate-y: 200%;
            padding: 2px;
            color: white;
          "
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
    <TransitionRoot as="template" :show="show && isSidebar">
      <TransitionChild
        class="overlay"
        ref="sidebar"
        :key="sidebarKey"
        as="div"
        enter="transform transition ease-in-out duration-500 sm:duration-700"
        enter-from="translate-x-full"
        enter-to="translate-x-0"
        leave="transform transition ease-in-out duration-500 sm:duration-700"
        leave-from="translate-x-0"
        leave-to="translate-x-full"
      >
        <div
          class="sidebar flex flex-col"
          @click.stop
          @keydown.stop
          @keypress.stop
        >
          <div
            class="drag-icon"
            @mousedown.prevent="startSidebarDrag"
            @mouseup.prevent="stopSidebarDrag"
          ></div>

          <div class="w-full h-full px-2 sm:px-0 self-center">
            <TabGroup>
              <TabPanels class="">
                <TabPanel :key="0">
                  <div
                    class="realtive sticky top-0 w-full rounded-b-3xl bg-center cursor-pointer object-cover z-10 shadow-lg gradient"
                    :style="`background-image: linear-gradient(to bottom, rgba(245, 246, 252, 0.82), rgba(59,130,246, 0.89)), url(${homeBackgroundUrl})`"
                  >
                    <div
                      class="pt-5 px-3 rounded-lg flex flex-col w-full text-white"
                    >
                      <div class="font-bold text-xl my-10">
                        Welcome to Respond Buddy! 👋
                      </div>
                      <div class="text-md">
                        Ready to try it? 🤔 Highlight on any text in your
                        browser 🖱️, choose from options like 'Summarize,'
                        'Simplify,' or 'Expand.'
                        <br />
                        Or start by asking a question at the bottom in the chat
                        box. 📝
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
                        <div
                          class="absolute top-0 right-0 p-4 pr-3 text-purple-lighter"
                        >
                          <PaperAirplaneIcon
                            class="h-5 w-5 fill-gray-400"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    class="flex-grow overflow-y-auto rounded-lg px-5 space-y-2"
                  >
                    <div
                      v-if="!token"
                      class="flex flex-col gap-2 mt-2"
                      :style="`font-size: ${settings.fontSize + 1}px;`"
                    >
                      <div>If you love it, signup or login 😍</div>
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
                      :style="`font-size: ${settings.fontSize + 1}px;`"
                    >
                      <button
                        @click="onDashboardClick"
                        type="button"
                        class="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none font-medium rounded-lg text-md px-5 py-2 text-center mr-2 mb-2 border-none"
                        style="color: white"
                      >
                        Go to Dashboard
                      </button>
                    </div>
                    <div class="text-lg font-bold">
                      Please share it with your friends! 🙏
                    </div>
                    <div class="flex gap-2 border-none">
                      <button
                        v-for="social in socialMediaContents"
                        class="p-2 bg-transparent border-none hover:text-gray-300 cursor-pointer hover:shadow-lg hover:rounded active:scale-95 focus:outline-none"
                        @click="shareToSocialMedia(social.type)"
                      >
                        <img class="w-10 h-10" :src="social.icon" />
                      </button>
                    </div>
                    <div class="text-lg font-bold">
                      Start with these prompts 🚀
                    </div>
                    <div>
                      <div class="flex mt-2" style="flex-wrap: wrap">
                        <div v-for="prompt in prompts">
                          <button
                            type="button"
                            class="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none font-medium rounded-lg text-md px-5 py-2 text-center mr-2 mb-2 border-none"
                            style="color: white"
                            @click="prompt.action()"
                          >
                            {{ prompt.name }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel :key="1" class="flex flex-col">
                  <div class="px-4 space-y-3 overflow-y-auto mb-14">
                    <div class="flex my-4">
                      <div class="font-bold text-xl w-full">Prompts</div>
                      <Listbox as="div" v-model="selected">
                        <ListboxLabel class="sr-only"
                          >Create new prompt</ListboxLabel
                        >
                        <div class="relative">
                          <div
                            class="inline-flex divide-x divide-blue-500 rounded-md shadow-sm"
                          >
                            <div
                              class="w-[140px] inline-flex items-center gap-x-1.5 rounded-md bg-blue-500 px-3 py-2 text-white shadow-sm cursor-pointer"
                              @click.stop="onCreateNewPrompt"
                            >
                              <PlusIcon
                                class="-ml-0.5 h-5 w-5 fill-white"
                                aria-hidden="true"
                              />
                              <p class="text-sm font-semibold !text-white">
                                {{ "New Prompt" }}
                              </p>
                            </div>
                            <!-- <ListboxButton
                              class="inline-flex items-center rounded-l-none rounded-r-md bg-blue-500 p-2 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                            >
                              <span class="sr-only">Button</span>
                              <ChevronDownIcon
                                class="h-5 w-5 !fill-white"
                                aria-hidden="true"
                              />
                            </ListboxButton> -->
                          </div>

                          <!-- <transition
                            leave-active-class="transition ease-in duration-100"
                            leave-from-class="opacity-100"
                            leave-to-class="opacity-0"
                          >
                            <ListboxOptions
                              class="absolute right-0 z-10 mt-2 w-72 origin-top-right divide-y divide-gray-200 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                            >
                              <ListboxOption
                                as="template"
                                v-for="option in publishingOptions"
                                :key="option.title"
                                :value="option"
                                v-slot="{ active, selected }"
                              >
                                <li
                                  :class="[
                                    active
                                      ? 'bg-blue-500 text-white'
                                      : 'text-white',
                                    'cursor-default select-none p-4 text-sm',
                                  ]"
                                >
                                  <div class="flex flex-col">
                                    <div class="flex justify-between">
                                      <p
                                        :class="
                                          selected
                                            ? 'font-semibold'
                                            : 'font-normal'
                                        "
                                      >
                                        {{ option.title }}
                                      </p>
                                      <span
                                        v-if="selected"
                                        :class="
                                          active
                                            ? 'text-white'
                                            : 'text-blue-500'
                                        "
                                      >
                                        <CheckIcon
                                          class="h-5 w-5"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    </div>
                                    <p
                                      :class="[
                                        active
                                          ? 'text-indigo-200'
                                          : 'text-gray-500',
                                        'mt-2',
                                      ]"
                                    >
                                      {{ option.description }}
                                    </p>
                                  </div>
                                </li>
                              </ListboxOption>
                            </ListboxOptions>
                          </transition> -->
                        </div>
                      </Listbox>
                    </div>
                    <div>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        class="bg-white block w-full rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-blue-100 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        placeholder="Search for prompt"
                      />
                    </div>
                    <div class="flex gap-2">
                      <Menu as="div" class="relative inline-block text-left">
                        <div>
                          <MenuButton
                            class="inline-flex w-full justify-center gap-x-1.5 rounded-lg bg-white px-2 py-1 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                          >
                            {{ currentSortByItem.name }}
                            <ChevronDownIcon
                              class="-mr-1 h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </MenuButton>
                        </div>

                        <transition
                          enter-active-class="transition ease-out duration-100"
                          enter-from-class="transform opacity-0 scale-95"
                          enter-to-class="transform opacity-100 scale-100"
                          leave-active-class="transition ease-in duration-75"
                          leave-from-class="transform opacity-100 scale-100"
                          leave-to-class="transform opacity-0 scale-95"
                        >
                          <MenuItems
                            class="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                          >
                            <div class="py-1">
                              <MenuItem
                                v-for="item in sortByMenuItems"
                                v-slot="{ active }"
                              >
                                <a
                                  href="#"
                                  :class="[
                                    active
                                      ? 'bg-gray-100 text-gray-900'
                                      : 'text-gray-700',
                                    'block px-4 py-2 text-sm',
                                  ]"
                                  @click="onSortByMenuItemClick(item)"
                                  >{{ item.name }}</a
                                >
                              </MenuItem>
                            </div>
                          </MenuItems>
                        </transition>
                      </Menu>
                      <Menu as="div" class="relative inline-block text-left">
                        <div>
                          <MenuButton
                            class="inline-flex w-full justify-center gap-x-1.5 rounded-lg bg-white px-2 py-1 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                          >
                            {{ currentCategoryItem.name }}
                            <ChevronDownIcon
                              v-if="currentCategoryItem.key === ''"
                              class="-mr-1 h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                            <XMarkIcon
                              v-else
                              class="-mr-1 h-5 w-5 text-gray-400"
                              aria-hidden="true"
                              @click.stop="
                                onFilterCategoryItem(categoryItems[0])
                              "
                            />
                          </MenuButton>
                        </div>

                        <transition
                          enter-active-class="transition ease-out duration-100"
                          enter-from-class="transform opacity-0 scale-95"
                          enter-to-class="transform opacity-100 scale-100"
                          leave-active-class="transition ease-in duration-75"
                          leave-from-class="transform opacity-100 scale-100"
                          leave-to-class="transform opacity-0 scale-95"
                        >
                          <MenuItems
                            class="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                          >
                            <div class="py-1">
                              <MenuItem
                                v-for="item in categoryItems"
                                v-slot="{ active }"
                              >
                                <a
                                  href="#"
                                  :class="[
                                    active
                                      ? 'bg-gray-100 text-gray-900'
                                      : 'text-gray-700',
                                    'block px-4 py-2 text-sm',
                                  ]"
                                  @click="onFilterCategoryItem(item)"
                                  >{{ item.name }}</a
                                >
                              </MenuItem>
                            </div>
                          </MenuItems>
                        </transition>
                      </Menu>
                    </div>
                    <div class="cursor-pointer" v-for="prompt in prompts">
                      <div
                        class="bg-slate-200 rounded-xl shadow-md max-w-lg flex items-center justify-between px-4 py-2"
                      >
                        <div class="flex items-center space-x-2">
                          <!-- <div class="bg-orange-500 p-2 rounded-full">
                        <img class="h-6 w-6" alt="Icon" />
                      </div> -->
                          <div class="space-y-1">
                            <h2 class="text-lg">{{ prompt.name }}</h2>
                            <div
                              class="text-sm font-light text-gray-600 space-x-2 line-clamp-3 leading-5"
                            >
                              {{
                                prompt?.used_description ||
                                "The sun dipped below the horizon, casting a warm, golden glow across the tranquil lake. The gentle ripples on the water's surface mirrored the fading colors of the sky, creating a breathtaking panorama. As the stars began to emerge one by one, the world around me grew quiet, and I couldn't help but feel a sense of peace and wonder. Nature's beauty never ceased to amaze, reminding me of the simple joys that life has to offer"
                              }}
                            </div>
                            <div
                              class="flex text-sm font-light text-gray-600 space-x-2"
                            >
                              <p class="text-gray-600">Text Generation</p>

                              <div class="flex gap-1">
                                <ChartBarIcon class="w-5 hover:fill-grey-500" />
                                55.4k
                              </div>
                              <div class="flex gap-1">
                                <HeartOutlineIcon
                                  v-if="!prompt?.isLiked"
                                  @click="onHeartClick(prompt)"
                                  class="w-5 hover:fill-red-200 hover:stroke-red-200"
                                />
                                <HeartOutlineIcon
                                  v-else
                                  @click="onHeartClick(prompt)"
                                  class="w-5 fill-red-400 stroke-red-400"
                                />
                                55.4k
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="flex text-center text-md">
                      <div class="inline-flex gap-x-1.5 cursor-pointer">
                        <ChevronLeftIcon
                          class="-mr-1 h-4 w-4 text-gray-400 self-center"
                          aria-hidden="true"
                        />
                        Previous
                      </div>
                      <div class="flex-grow">2/10000 prompts</div>
                      <div class="inline-flex gap-x-1.5 cursor-pointer">
                        Next
                        <ChevronRightIcon
                          class="-mr-1 h-4 w-4 text-gray-400 self-center"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel :key="2">
                  <div>
                    <div class="flex-grow overflow-y-auto">hi</div>
                    <div
                      class="flex relative w-full bg-white-100 border-t-1 border-slate-400 flex-shrink-0 mt-auto"
                      style="
                        border-top: solid;
                        border-width: 1px;
                        border-color: #cfd8dc;
                      "
                    >
                      <textarea
                        v-model="questionInput"
                        :disabled="isLoading"
                        ref="messageInput"
                        type="search"
                        id="message-input"
                        :class="isLoading ? 'cursor-wait' : ''"
                        class="block w-full m-2 z-20 text-md text-slate-900 font-sans overflow-y-auto"
                        rows="1"
                        style="
                          background: transparent;
                          border: none;
                          outline: none;
                          resize: none;
                        "
                        :placeholder="
                          !isLoading ? 'Ask a question...' : 'Loading...'
                        "
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
                          class="text-slate-700 text-lg w-5 h-5 focus:text-blue-500 hover:text-blue-300"
                        />
                      </button>
                      <button
                        v-else
                        type="button"
                        class="bg-white border-none"
                        disabled
                      >
                        <svg
                          aria-hidden="true"
                          class="inline w-5 h-5 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
                </TabPanel>
              </TabPanels>
              <TabList
                class="absolute bottom-0 right-0 w-full mx-auto flex space-x-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 p-[10px] px-2"
              >
                <Tab
                  v-for="(tab, index) in sidebarTabHeaders"
                  as="template"
                  :key="index"
                  v-slot="{ selected }"
                >
                  <button
                    :class="[
                      'flex-1 rounded-lg py-1 text-[14px] font-medium leading-5 !text-white',
                      'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400  ',
                      selected
                        ? 'bg-cyan-600 shadow'
                        : 'text-gray-700 hover:bg-white/[0.12] hover:text-gray-300',
                    ]"
                  >
                    {{ tab.name }}
                  </button>
                </Tab>
              </TabList>
            </TabGroup>
          </div>
          <div
            v-if="messageData.length > 0"
            ref="chatContainer"
            class="flex-grow overflow-y-auto rounded-lg"
          >
            <div
              v-for="(msgGrp, index) in messageData"
              :key="index"
              style="border-bottom: 1px solid rgb(235, 234, 226); padding: 10px"
              class="chat-group d-flex align-start"
              :class="
                msgGrp.senderId ? 'sender-msg-container' : 'bot-msg-container'
              "
            >
              <div
                v-for="(msgData, msgIndex) in msgGrp.messages"
                :key="msgIndex"
                class="chat-font ml-3"
                :class="[
                  msgGrp?.messages.length - 1 !== msgIndex ? 'mb-3' : 'mb-1',
                ]"
                :style="`font-size: ${settings.fontSize}px`"
              >
                <pre
                  class="formatted-text my-0"
                  :style="`font-size: ${settings.fontSize}px; `"
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
                  :style="`font-size: ${settings.fontSize}px`"
                >
                  Copied
                </p>
              </div>
            </div>
          </div>
        </div>
      </TransitionChild>
    </TransitionRoot>
    <div
      :style="{ right: `${right}px`, bottom: `${bottom}px` }"
      class="fixed flex right-0 bottom-0 m-5 z-100 flex items-end font-sans leading-1em"
    >
      <button
        class="flex rounded-full cursor-pointer border-none bg-transparent"
        id="respond-buddy-fba-button"
        ref="fbaButton"
        @mousedown.prevent="dragStart"
        @click.stop="toggle()"
      >
        <img
          src="/assets/rb-icon-2.png"
          class="text-lg"
          style="
            width: 50px;
            padding-top: 3px;
            border-radius: 100%;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
          "
        />
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Add rotating animation to the icon */

* {
  font-family: "Open Sans", sans-serif;
  color: #212121;
}
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

.drag-icon {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  background-image: url("../../assets/drag.svg");
  background-size: contain;
  cursor: grab;
}

.chat-font {
  font-style: normal;
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
  font-weight: 400;
  font-family: "circular";
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
  z-index: 99999;
}

.overlay {
  position: fixed;
  top: 0;
  right: 0;
  width: 500px;
  height: 100%;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: end;
}

.sidebar {
  background-color: white;
  width: 100%;
  height: 99%;
  overflow-y: auto;
  border-radius: 12px;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.5);
}

.overlay-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 9998;
}

.expand-on-hover {
  transition: transform 0.3s ease-in-out;
}

.expand-on-hover:hover {
  transform: scale(1.2);
}
</style>
