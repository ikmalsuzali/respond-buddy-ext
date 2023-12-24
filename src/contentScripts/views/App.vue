<script setup lang="ts">
import "../../styles/main.css";
import { ref, onMounted, onBeforeUnmount, unref } from "vue";
import { useToggle } from "@vueuse/core";
import { onMessage, sendMessage } from "webext-bridge/content-script";
// import "uno.css";

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
  PaperClipIcon,
} from "@heroicons/vue/24/solid";
import {
  TrashIcon,
  PlusCircleIcon,
  DocumentMinusIcon,
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
import {
  CheckIcon,
  ChevronDownIcon,
  PhotoIcon,
  UserCircleIcon,
} from "@heroicons/vue/20/solid";
import { useDebounce } from "@vueuse/core";
import {
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import HomeTabPanel from "./HomeTabPanel.vue";
import useHtmlEmbeddings from "../composables/useHtmlEmbedding";
import ButtonGroup from "./ButtonGroup.vue";

const {
  embedWeb,
  documentWeb,
  embedChatGPT,
  listenEnterKeyPress,
  listenSendButtonClick,
} = useHtmlEmbeddings();

// let prevUrl = ref("");

// watch(
//   currentUrl,
//   () => {
//     console.log("🚀 ~ file: App.vue:76 ~ currentUrl:", currentUrl);

//     nextTick(() => {
//       setTimeout(() => {
//         embedWeb(currentUrl.value);
//         embedChatGPT();
//       }, 1000);
//     });
//     prevUrl.value = currentUrl.value;
//   },
//   { immediate: true }
// );

let currentUrl = ref("");

const init = async () => {
  currentUrl.value = window.location.href;
  nextTick(() => {
    setTimeout(() => {
      embedWeb(currentUrl.value);
      embedChatGPT();
    }, 1000);
  });
};

init();

onMessage("url-changed", (message) => {
  console.log("🚀 ~ file: App.vue:105 ~ onMessage ~ url changes:", message);
  currentUrl.value = message?.data?.url;
  nextTick(() => {
    setTimeout(() => {
      embedWeb(currentUrl.value);
      embedChatGPT();
    }, 1500);
  });
});

// watchEffect(() => {
//   // check if the url has changed

//   if (currentUrl.value !== prevUrl.value) {
//     console.log("🚀 ~ file: App.vue:78 ~ watchEffect ~ prevUrl:", prevUrl)
//     console.log("🚀 ~ file: App.vue:78 ~ watchEffect ~ currentUrl:", currentUrl)
//     nextTick(() => {
//       setTimeout(() => {
//         embedWeb(currentUrl.value);
//         embedChatGPT();
//       }, 1000);
//     });
//     prevUrl.value = currentUrl.value;
//   }
// });

listenEnterKeyPress();
listenSendButtonClick();

// document.addEventListener("mousedown", async (event) => {
//   console.log("🚀 ~ file: App.vue:91 ~ event:", event);
//   const sendButton = document.querySelector('[data-testid="send-button"]');
//   if (!sendButton?.contains(event.target)) return;

//   await triggerSendButton(event);
// });

// document.addEventListener("keydown", async (event) => {
//   console.log("🚀 ~ file: App.vue:91 ~ event:", event);
//   if (event.key === "Enter") {
//     await triggerSendButton(event);
//   }
// });

// const triggerSendButton = async (event) => {
//   console.log("🚀 ~ file: App.vue:91 ~ event:", event);

//   const textArea = document.querySelector("#prompt-textarea");
//   console.log(textArea.value);

//   if (textArea) {
//     console.log(
//       "🚀 ~ file: App.vue:101 ~ sendButton.addEventListener ~ textArea:",
//       textArea
//     );

//     const templateTone = await sendMessage(
//       "get-template-tone",
//       null,
//       "background"
//     );

//     console.log(
//       "🚀 ~ file: App.vue:104 ~ document.addEventListener ~ templateTone:",
//       templateTone
//     );

//     const templateLanguage = await sendMessage(
//       "get-template-language",
//       null,
//       "background"
//     );

//     console.log(
//       "🚀 ~ file: App.vue:112 ~ document.addEventListener ~ templateLanguage:",
//       templateLanguage
//     );

//     const templateWritingStyle = await sendMessage(
//       "get-template-writing-style",
//       null,
//       "background"
//     );

//     console.log(
//       "🚀 ~ file: App.vue:120 ~ document.addEventListener ~ templateWritingStyle:",
//       templateWritingStyle
//     );

//     textArea.value = generatePrompt(
//       "Using this topic [input], create a twitter post that will get a lot of engagement.",
//       textArea.value,
//       templateTone.name,
//       templateWritingStyle.name,
//       templateLanguage.name
//     );
//     textArea.dispatchEvent(new Event("input", { bubbles: true }));
//   }

//   console.log("send button clicked");
//   return;
// };

// const generatePrompt = (
//   promptTemplate: string,
//   promptValue: string,
//   tone: string,
//   writingStyle: string,
//   language: string = "English"
// ) => {
//   if (!promptTemplate && promptValue) return promptValue;
//   let prompt = "";
//   prompt += `${
//     promptTemplate.includes("[input]")
//       ? replaceInputWithValue(promptTemplate, promptValue)
//       : promptTemplate
//   }\n`;
//   prompt += `Below is the parameters to build this response prompt:\n`;
//   prompt += `Please include, "Created by Respond Buddy - https://respondbuddy.com"`;
//   prompt += `\n Please write in ${tone ? `${tone} tone,` : ""} ${
//     writingStyle ? `${writingStyle} writing style` : ""
//   } written in ${language}.\n\n`;

//   return prompt;
// };

// const replaceInputWithValue = (
//   inputString: string | null,
//   replacementValue: string
// ) => {
//   if (!inputString) return "";
//   const pattern = /\[input\]/g;
//   const replacedString = inputString.replace(pattern, replacementValue);
//   return replacedString || "";
// };

// const nativeFetch = window.fetch;
// window.fetch = async (...args) => {
//   console.log("detected fetch call");
//   return nativeFetch.apply(window, args);
// };

const promptRoute = ref("listing");

const onAskMeAnythingClick = () => {
  console.log("onAskMeAnythingClick");
  selectedTab.value = 2;
  nextTick(() => {
    messageInput.value.focus();
  });
};

const onHomePromptClick = (prompt: any) => {
  selectedPrompt.value = {
    key: prompt.key,
    name: prompt.name,
  };
  selectedTab.value = 2;
  nextTick(() => {
    messageInput.value.focus();
  });
};

const selectedPrompt = ref({
  key: "",
  name: "",
});

const sendMessageRequestData = ref({
  message: "",
  metadata: {
    tag_tone: "",
    tag_writing_style: "",
    tag_language: "",
    tag_key: "",
    current_website_url: "",
    url_body_content: "",
  },
});

const onRemoveSelectedPromptClick = () => {
  selectedPrompt.value = {
    key: "",
    name: "",
  };
};

const onPromptClick = (prompt: any) => {
  selectedPrompt.value = {
    key: prompt.key,
    name: prompt.name,
  };

  selectedTab.value = 2;
};

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
    name: "Relevance",
    current: false,
    key: "relevance",
  },
  {
    name: "Newest",
    current: false,
    key: "created_at",
  },
]);

const isPromptsLoading = ref(true);
const selectedTab = ref(0);

const categoryItems = [
  {
    name: "All",
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

const assignees = [
  { name: "Unassigned", value: null },
  {
    name: "Wade Cooper",
    value: "wade-cooper",
    avatar:
      "https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  // More items...
];
const labels = [
  { name: "Unlabelled", value: null },
  { name: "Engineering", value: "engineering" },
  // More items...
];
const dueDates = [
  { name: "No due date", value: null },
  { name: "Today", value: "today" },
  // More items...
];

const assigned = ref(assignees[0]);
const labelled = ref(labels[0]);
const dated = ref(dueDates[0]);

const currentCategoryItem = ref(categoryItems[0]);
const onFilterCategoryItem = (item: any) => {
  currentCategoryItem.value = item;
  promptsRequestData.value = {
    ...promptsRequestData.value,
    category: item.id,
  };
};

const promptHints = ref([
  {
    name: "input",
    value: "Give a template name",
    disabled: true,
  },
]);

const onAddPromptClick = () => {
  promptHints.value.push({
    name: "",
    value: "",
    disabled: false,
  });
};

const onDeletePromptClick = (index: number) => {
  if (promptHints.value.length <= 1) return;
  removeDescriptionsBasedOnArray(
    createPromptRequestData.value.description,
    promptHints.value[index].value
  );
  promptHints.value.splice(index, 1);
};

const removeDescriptionsBasedOnArray = (
  description: string,
  matchStrings: any
) => {
  if (!matchStrings) return description;
  if (matchStrings.length === 0) return description;
  if (!description) return "";

  matchStrings.forEach((matchString: string) => {
    const regex = new RegExp(matchString, "g");
    description = description.replace(regex, "");
  });
  return description;
};

const getCurrentAmount = (page: number, limit: number) => {
  const startIndex = (page - 1) * limit;
  const count = startIndex + promptsData.value.prompts.length;
  // const endIndex = startIndex + limit;
  // const currentPrompts = promptsData.value.prompts.slice(startIndex, endIndex);
  return count;
};

const selected = ref(publishingOptions[0]);
const promptsRequestData = ref({
  search: "",
  category: "",
  sort_by: "top_usage",
  page: 1,
  limit: 20,
});

const createPromptRequestData = ref({
  name: "",
  description: "",
  category: "",
  privacy_type: "public",
  ai_template: "",
  is_liked: false,
});

const promptSearch = ref("");
const debouncedPromptQuery = useDebounce(promptSearch, 300);

const promptsData = ref({
  prompts: [],
  limit: 20,
  page: 1,
  total: 0,
  totalPages: 2,
});

const privacyFilterItems = ref([
  {
    name: "Public",
    key: "public",
  },
  {
    name: "Private",
    key: "private",
  },
]);

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

const currentSortByItem = ref(sortByMenuItems.value[0]);
const onSortByMenuItemClick = (item: any) => {
  promptsRequestData.value = {
    ...promptsRequestData.value,
    sort_by: item.key,
  };
};

const onUsedByWhoClick = (categoryId: string) => {
  if (isCreatePromptLoading.value) return;

  createPromptRequestData.value = {
    ...createPromptRequestData.value,
    category: categoryId,
  };
};

const onPrivacyFilterItemClick = (key: string) => {
  if (isCreatePromptLoading.value) return;
  createPromptRequestData.value = {
    ...createPromptRequestData.value,
    privacy_type: key || "Public",
  };
};

const right = ref(0);
const bottom = ref(45);
const sidebarKey = ref(0);

let startX = 0;
let startY = 0;

let messageData = ref([]);
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
  // {
  //   key: "translate",
  //   name: "Translate",
  //   icon: languageSvg,
  //   options: [
  //     {
  //       key: "english",
  //       name: "English",
  //       template: "Translate to English: ",
  //     },
  //     {
  //       key: "spanish",
  //       name: "Spanish",
  //       template: "Translate to Spanish: ",
  //     },
  //     {
  //       key: "french",
  //       name: "French",
  //       template: "Translate to French: ",
  //     },
  //     {
  //       key: "german",
  //       name: "German",
  //       template: "Translate to German: ",
  //     },
  //     {
  //       key: "italian",
  //       name: "Italian",
  //       template: "Translate to Italian: ",
  //     },
  //     // {
  //     //   key: "chinese",
  //     //   name: "Chinese",
  //     //   template: "Translate to Cfhinese: ",
  //     // },
  //   ],
  //   isHovered: false,
  //   isDropdownOpen: false,
  // },
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

const onPromptHintClick = (prompt: any) => {
  if (isCreatePromptLoading.value) return;
  createPromptRequestData.value.ai_template += ` [${prompt.name}]`;
};

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

  selectedTab.value = 2;
  // If the toolbar item is "copy", don't send a message to the background script
  if (toolbarItems.value[index]?.key === "copy") {
    await navigator.clipboard.writeText(selectedText.value);
    sendMessageRequestData.value.message = selectedText.value;
    adjustHeight();
    return;
  }

  nextTick(() => {
    selectedPrompt.value = {
      key: toolbarItems.value[index]?.key,
      name: toolbarItems.value[index]?.name,
    };

    console.log(
      "🚀 ~ file: App.vue:519 ~ nextTick ~ selectedPrompt.value :",
      selectedPrompt.value
    );

    sendMessageRequestData.value.message = selectedText.value;
    messageInput.value.focus();
    adjustHeight();
  });

  // If the toolbar item has template, send a message to the background script
  // await sendMessage("ask-chat", {
  //   message: `${toolbarItems.value[index]?.template}${selectedText.value}`,
  // });
};

const startSidebarDrag = (event: any) => {
  sidebarKey.value += 1;
  isSidebarDragging.value = true;
  sidebarStartX.value = event.clientX;
  sidebarWidth.value = sidebar.value?.offsetWidth;
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

    if (newWidth >= 450) {
      sidebar.value.style.width = `${newWidth}px`;
      const disp = sidebar.value.style.display;
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

// watch sendMessageRequestData.value.message
watch(sendMessageRequestData.value.message, () => {
  adjustHeight();
});

const onNextPageClick = () => {
  if (
    getCurrentAmount(promptsData.value.page, promptsData.value.limit) ===
    promptsData.value.total
  )
    return;

  if (promptsData.value.page < promptsData.value.totalPages) {
    promptsRequestData.value = {
      ...promptsRequestData.value,
      page: promptsData.value.page + 1,
    };
  }
};

const onPreviousPageClick = () => {
  if (promptsData.value.page > 1) {
    promptsRequestData.value = {
      ...promptsRequestData.value,
      page: promptsData.value.page - 1,
    };
  }
};

const adjustHeight = () => {
  console.log("adjustHeight");
  nextTick(() => {
    const textarea = messageInput.value;
    console.log(
      "🚀 ~ file: App.vue:562 ~ nextTick ~ messageInput:",
      messageInput
    );
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`; // Limit to 100px or five lines
  });
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

const onHeartClick = (prompt: any) => {
  prompt.user_has_liked = !prompt.user_has_liked;

  sendMessage("set-liked-prompt", {
    id: prompt.id,
    isLiked: prompt.user_has_liked,
  });
};

const createPromptError = ref({
  name: "",
  description: "",
  category: "",
  ai_template: "",
});

onMessage("toggle-chat", (_) => {
  toggle(true);
});

// onMessage("url-changed", (message) => {
//   console.log("🚀 ~ file: app.ts:15 ~ onMessage ~ message:", message);
// });

onMessage("app-message", (message) => {
  // promptRoute.value = "";
  selectedTab.value = 2;

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
  sendMessageRequestData.value.message = value;
};

const onSendClick = async () => {
  if (!sendMessageRequestData.value.message) {
    return;
  }

  console.log("send message", sendMessageRequestData.value);

  let response = await sendMessage(
    "ask-chat",
    {
      message: sendMessageRequestData.value.message,
      metadata: {
        tag_writing_style:
          sendMessageRequestData.value?.metadata?.tag_writing_style || "",
        tag_language:
          sendMessageRequestData.value?.metadata?.tag_language || "",
        tag_tone: sendMessageRequestData.value?.metadata?.tag_tone || "",
        tag_key: selectedPrompt.value?.key || "",
        current_website_url: window.location.href,
        url_body_content: !selectedPrompt.value?.key
          ? document.body.innerText
          : "",
      },
    },
    "background"
  );
  sendMessageRequestData.message.value = "";

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

watch(debouncedPromptQuery, async () => {
  promptsRequestData.value = {
    ...promptsRequestData.value,
    search: debouncedPromptQuery.value,
  };
});

watch(promptsRequestData, async () => {
  await fetchTemplates(promptsRequestData.value);
});

const updatePromptRoute = (route: string) => {
  promptRoute.value = route;
};

const fetchTemplates = async (templateData = {}) => {
  isPromptsLoading.value = true;
  const data = await sendMessage("get-templates-api", templateData);
  console.log("🚀 ~ file: App.vue:794 ~ fetchTemplates ~ data:", data);

  promptsData.value = {
    prompts: data?.data || [],
    limit: data?.limit || 50,
    page: data?.page || 1,
    total: data?.total || 0,
    totalPages: data?.total_pages || 2,
  };

  isPromptsLoading.value = false;
};

const promptCategoriesData = ref([]);

const fetchTemplateCategories = async (name: string = "") => {
  const data = await sendMessage("fetch-template-categories-api", name);
  console.log("🚀 ~ file: App.vue:749 ~ watch ~ data: categories", data);
  promptCategoriesData.value = data || [];
};

const promptLanguagesData = ref([]);

const fetchTemplateLanguages = async (name: string = "") => {
  const data = await sendMessage("fetch-template-languages", name);
  console.log("🚀 ~ file: App.vue:749 ~ watch ~ data:", data);
  promptLanguagesData.value = data || [];
};

const promptTonesData = ref([]);

const fetchTemplateTones = async (name: string = "") => {
  const data = await sendMessage("fetch-template-tones", name);
  console.log("🚀 ~ file: App.vue:749 ~ watch ~ data:", data);
  promptTonesData.value = data || [];
};

const promptWritingStylesData = ref([]);

const fetchTemplateWritingStyles = async (name: string = "") => {
  const data = await sendMessage("fetch-template-writing-styles", name);
  console.log("🚀 ~ file: App.vue:749 ~ watch ~ data:", data);
  promptWritingStylesData.value = data || [];
};

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

const onCancelCreatePromptClick = () => {
  console.log("onCancelCreatePromptClick");
  promptRoute.value = "listing";
  createPromptRequestData.value = {
    name: "",
    description: "",
    category: "",
    ai_template: "",
    is_liked: false,
  };
};

const showIconOnSelection = () => {
  const selectedText = window.getSelection().toString().trim();

  if (selectedText.length > 0) {
    browser.runtime.sendMessage({ type: "highlight", text: selectedText });
  }
};

const onNewPrompt = () => {
  promptRoute.value = "create";
};

const onCreatePromptClick = async () => {
  isCreatePromptLoading.value = true;

  let output = {};
  promptHints.value.forEach((hint: any) => {
    if (!hint?.name) return;
    output[hint?.name] = {
      description: hint.value,
    };
  });

  createPromptRequestData.value.structured_output = output;

  createPromptError.value = {
    name: "",
    description: "",
    category: "",
    ai_template: "",
  };

  let hasError = ref(false);

  // Handle errors
  if (!createPromptRequestData.value.name) {
    createPromptError.value.name = "Please enter a name";
    hasError.value = true;
  }
  if (!createPromptRequestData.value.description) {
    createPromptError.value.description = "Please enter a description";
    hasError.value = true;
  }
  if (!createPromptRequestData.value.category) {
    createPromptError.value.category = "Please select a category";
    hasError.value = true;
  }
  if (!createPromptRequestData.value.ai_template) {
    createPromptError.value.ai_template = "Please enter a template";
    hasError.value = true;
  }

  createPromptError.value = {
    ...createPromptError.value,
    hint_description: {},
    hint_name: {},
  };
  // Loop through output and check if there are any empty descriptions and name
  let i = 0;
  for (const [key, value] of Object.entries(output)) {
    if (!key) {
      createPromptError.value = {
        ...createPromptError.value,
        hint_name: {
          ...createPromptError.value.hint_name,
          [`${i}`]: "Please enter a prompt hint",
        },
      };
      hasError.value = true;
    }
    if (!value?.description && !key) {
      createPromptError.value = {
        ...createPromptError.value,
        hint_description: {
          ...createPromptError.value.hint_description,
          [`${i}`]: "Please enter a hint description",
        },
      };
      hasError.value = true;
    }
    i++;
  }

  console.log(createPromptError.value);

  if (hasError.value === true) {
    console.log(
      "🚀 ~ file: App.vue:859 ~ onCreatePromptClick ~ hasError:",
      hasError.value
    );
    hasError.value = false;
    return;
  }

  const data = await sendMessage(
    "create-prompt",
    createPromptRequestData.value
  );

  isCreatePromptLoading.value = false;

  console.log(data);

  if (!data) return;

  createPromptRequestData.value = {
    name: "",
    description: "",
    category: "",
    ai_template: "",
    is_liked: false,
    privacy_type: "private",
  };

  promptRoute.value = "listing";
  fetchTemplates(promptsRequestData.value);
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

const isCreatePromptLoading = ref(false);

const onClickLoginRegister = (type: string) => {
  const loginWebUrl = "https://app.respondbuddy.com/";
  const registerWebUrl = "https://app.respondbuddy.com/register";
  if (type === "register") {
    window.open(registerWebUrl, "_blank");
    return;
  }
  window.open(loginWebUrl, "_blank");
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

const limitArrayLength = (array: Array<any>, maxLength: number) => {
  if (array.length > maxLength) {
    return array.slice(0, maxLength);
  }
  return array;
};

const homePagePrompts = computed(() => {
  if (!promptsData.value?.prompts) return [];
  if (promptsData.value?.prompts?.length < 20)
    return promptsData.value?.prompts;
  return limitArrayLength(promptsData.value.prompts, 20);
});

onMounted(() => {
  getToken();
  getFontSize();
  getChatButtonPosition();
  fetchTemplates();
  fetchTemplateCategories();
  fetchTemplateLanguages();
  fetchTemplateTones();
  fetchTemplateWritingStyles();
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
    {{ documentWeb }}
    <div v-for="webComponent in documentWeb">
      <teleport to="#embed-web-0">
        <div :style="webComponent?.style">
          <ButtonGroup :prompts="webComponent?.actions" />
        </div>
      </teleport>
    </div>
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
      class="popup border border-gray-300 shadow-md rounded-lg flex p-1 space-x-2"
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
          class="px-1 text-xs text-gray-100 rounded-md absolute left-1/2 -translate-x-1/2 translate-y-1/2"
          style="
            background-color: #448aff;
            --un-translate-y: 100%;
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
    <TransitionRoot as="template" :show="show">
      <TransitionChild
        class="overlay"
        as="div"
        enter="transform transition ease-in-out duration-500 sm:duration-700"
        enter-from="translate-x-full"
        enter-to="translate-x-0"
        leave="transform transition ease-in-out duration-500 sm:duration-700"
        leave-from="translate-x-0"
        leave-to="translate-x-full"
      >
        <div ref="sidebar" class="sidebar flex flex-col">
          <div
            class="drag-icon"
            @mousedown.prevent="startSidebarDrag"
            @mouseup.prevent="stopSidebarDrag"
          ></div>

          <div class="w-full h-full px-2 sm:px-0 self-center">
            <TabGroup :selectedIndex="selectedTab">
              <TabPanels class="h-full">
                <TabPanel :key="0">
                  <HomeTabPanel
                    :token="token"
                    :settings="settings"
                    :prompts="homePagePrompts"
                    @on-ask-me-anything-click="onAskMeAnythingClick"
                    @on-prompt-click="onHomePromptClick"
                  />
                </TabPanel>
                <TabPanel :key="1" class="flex flex-col h-full">
                  <div class="flex-grow flex overflow-y-auto w-full">
                    <div
                      v-if="promptRoute == 'listing'"
                      class="px-6 space-y-3 overflow-y-auto mb-14 w-full"
                    >
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
                                @click.stop="onNewPrompt"
                              >
                                <PlusIcon
                                  class="-ml-0.5 h-5 w-5 fill-white"
                                  aria-hidden="true"
                                />
                                <p class="text-sm font-semibold !text-white">
                                  {{ "New Prompt" }}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Listbox>
                      </div>
                      <div>
                        <input
                          v-model="promptSearch"
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
                              {{
                                sortByMenuItems.find(
                                  (item) =>
                                    item.key === promptsRequestData.sort_by
                                ).name || "Sort By"
                              }}
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
                              class="absolute left-0 z-10 mt-2 w-56 max-h-52 overflow-auto origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                            >
                              <div class="py-1">
                                <MenuItem
                                  v-for="item in promptCategoriesData"
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
                      <div class="flex flex-wrap gap-4 place-content-center">
                        <div
                          v-if="isPromptsLoading"
                          class="w-full flex flex-wrap gap-4 justify-between"
                        >
                          <div
                            v-for="_ in 5"
                            class="w-full max-w-md mx-auto overflow-hidden rounded-lg shadow-lg animate-pulse bg-slate-300"
                          >
                            <div class="w-full p-4 md:p-4">
                              <h1 class="w-40 h-2 bg-gray-200 rounded-lg"></h1>

                              <p
                                class="w-48 h-2 mt-4 bg-gray-200 rounded-lg"
                              ></p>

                              <div class="flex mt-4 item-center gap-x-2">
                                <p class="w-5 h-2 bg-gray-200 rounded-lg"></p>
                                <p class="w-5 h-2 bg-gray-200 rounded-lg"></p>
                                <p class="w-5 h-2 bg-gray-200 rounded-lg"></p>
                                <p class="w-5 h-2 bg-gray-200 rounded-lg"></p>
                                <p class="w-5 h-2 bg-gray-200 rounded-lg"></p>
                              </div>

                              <div
                                class="flex justify-between mt-6 item-center"
                              >
                                <h1
                                  class="w-10 h-2 bg-gray-200 rounded-lg"
                                ></h1>

                                <div
                                  class="h-4 bg-gray-200 rounded-lg w-28"
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          v-else-if="
                            !isPromptsLoading &&
                            promptsData.prompts.length === 0
                          "
                          class="p-4"
                        >
                          <DocumentMinusIcon
                            class="w-20 p-2 stroke-[0.5]"
                            style="margin-inline: auto"
                          />
                          <div>No records founds</div>
                        </div>
                        <div
                          v-else
                          class="cursor-pointer flex-grow w-full min-w-[300px] max-w-[430px] height-[312px]"
                          v-for="prompt in promptsData.prompts"
                        >
                          <!-- Prompt Card -->
                          <div
                            class="prompt-card shadow-md bg-gradient-to-r from-blue-400 to-blue-600 hover:bg-gradient-to-bl rounded-xl hover:shadow-xl h-full"
                            @click="onPromptClick(prompt)"
                          >
                            <div
                              class="bg-white rounded-xl shadow-md hover:shadow-lg flex items-center justify-between px-4 py-2 h-full"
                            >
                              <div class="flex items-center space-x-2">
                                <div class="space-y-1">
                                  <h2 class="text-lg">{{ prompt?.name }}</h2>
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
                                    <p class="text-gray-600">
                                      {{ prompt?.tag_categories?.name || "" }}
                                    </p>

                                    <div class="flex gap-1">
                                      <ChartBarIcon
                                        class="w-5 hover:fill-grey-500"
                                      />
                                      <span class="pt-0.5">{{
                                        prompt?.usage_count || 0
                                      }}</span>
                                    </div>
                                    <div class="flex gap-1">
                                      <HeartOutlineIcon
                                        v-if="!prompt?.user_has_liked"
                                        @click.stop="onHeartClick(prompt)"
                                        class="w-5 hover:fill-red-200 hover:stroke-red-200"
                                      />
                                      <HeartOutlineIcon
                                        v-else
                                        @click.stop="onHeartClick(prompt)"
                                        class="w-5 fill-red-400 stroke-red-400"
                                      />
                                      <span class="pt-0.5">
                                        {{
                                          (prompt?.user_has_liked === true
                                            ? 1
                                            : 0) + prompt?.tag_liked_count || 0
                                        }}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="flex text-center text-md">
                        <div
                          class="inline-flex gap-x-1.5 cursor-pointer"
                          :class="{
                            'cursor-not-allowed text-gray-200':
                              promptsData.page == 1,
                          }"
                          @click="onPreviousPageClick"
                        >
                          <ChevronLeftIcon
                            class="-mr-1 h-4 w-4 text-gray-800 self-center"
                            aria-hidden="true"
                            :class="{
                              'cursor-not-allowed text-gray-300':
                                promptsData.page == 1,
                            }"
                          />
                          <div class="text-xs">Previous</div>
                        </div>
                        <!-- Get current records -->

                        <div class="flex-grow text-xs">
                          {{
                            `${getCurrentAmount(
                              promptsData.page,
                              promptsData.limit
                            )} / ${promptsData.total} prompts`
                          }}
                        </div>
                        <div
                          class="inline-flex gap-x-1.5 cursor-pointer"
                          @click="onNextPageClick"
                        >
                          <div class="text-xs">Next</div>
                          <ChevronRightIcon
                            class="-mr-1 h-4 w-4 text-gray-300 self-center"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    </div>
                    <TransitionRoot
                      :show="promptRoute == 'create'"
                      enter="transition-opacity duration-500"
                      enter-from="opacity-0"
                      enter-to="opacity-100"
                    >
                      <div class="space-y-12">
                        <div
                          class="flex flex-wrap gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12"
                        >
                          <!-- <div class="flex-1 sm:hidden md:visible">
                              <div
                                class="bg-white p-6 rounded-lg max-w-lg mx-auto"
                              >
                                <h2 class="text-xl font-bold mb-4">
                                  Creating a Custom Prompt - Simplified for
                                  Clarity
                                </h2>
                                <p class="text-gray-700 mb-3">
                                  Hey there! 🌟 Ready to craft a custom prompt?
                                  Great! Here's how:
                                </p>

                                <ol class="list-decimal pl-5">
                                  <li class="mb-2">
                                    <span class="font-semibold"
                                      >Define Your Goal:</span
                                    >
                                    Think about the response you're aiming for.
                                    Whether it's feedback, an answer, or data,
                                    keep that goal in mind.
                                  </li>
                                  <li class="mb-2">
                                    <span class="font-semibold"
                                      >Be Clear & Concise:</span
                                    >
                                    Avoid jargon or lengthy sentences. A simple
                                    and straightforward question or statement
                                    works best.
                                  </li>
                                  <li class="mb-2">
                                    <span class="font-semibold"
                                      >Use the 'Custom Prompt' Field:</span
                                    >
                                    Once you've crafted your prompt, type it
                                    into the 'Custom Prompt' field.
                                  </li>
                                  <li class="mb-2">
                                    <span class="font-semibold"
                                      >Save & Go:</span
                                    >
                                    Once you're satisfied, hit "Save". Your
                                    custom prompt is now active and ready for
                                    responses!
                                  </li>
                                </ol>

                                <p class="text-gray-600 mt-4 italic">
                                  Remember, a clear prompt means clear
                                  responses. Happy prompting!
                                </p>
                              </div>
                            </div> -->
                          <div class="flex-1 md:flex-2 px-12 py-8">
                            <div class="flex">
                              <div @click="updatePromptRoute('listing')">
                                <ChevronLeftIcon
                                  class="mr-2 pt-1 h-6 w-6 text-gray-400"
                                  aria-hidden="true"
                                />
                              </div>
                              <h2 class="text-xl font-bold mb-4">
                                Create a Custom Prompt
                              </h2>
                            </div>
                            <div
                              v-if="!token"
                              class="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-4 mb-4 space-y-4"
                              role="alert"
                            >
                              <p class="font-bold">
                                Please register/login to create prompt
                              </p>

                              <div class="flex mt-3">
                                <button
                                  @click="onClickLoginRegister('login')"
                                  type="button"
                                  class="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2 text-center mr-2 mb-2 border-none"
                                  style="color: white"
                                >
                                  Login
                                </button>
                                <button
                                  @click="onClickLoginRegister('register')"
                                  type="button"
                                  class="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2 text-center mr-2 mb-2 border-none"
                                  style="color: white"
                                >
                                  Register
                                </button>
                              </div>
                            </div>
                            <div
                              class="flex flex-wrap gap-x-4 gap-y-4 max-w-2xl"
                            >
                              <div class="w-full sm:hidden">
                                <div
                                  class="mt-6 flex items-center justify-end gap-x-6"
                                >
                                  <button
                                    type="button"
                                    class="text-sm font-semibold leading-6 text-gray-900"
                                    @click="onCancelCreatePromptClick"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="submit"
                                    class="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold !text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    @click="onCreatePromptClick"
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>

                              <div class="w-full flex gap-x-4">
                                <div class="flex gap-x-4">
                                  <div>
                                    <label
                                      for="about"
                                      class="block text-sm font-medium leading-6 text-gray-900"
                                      >Used By Who?</label
                                    >

                                    <Menu
                                      as="div"
                                      class="relative inline-block text-left mt-2"
                                    >
                                      <MenuButton
                                        class="inline-flex w-32 justify-center gap-x-1.5 rounded-lg bg-gray-50 px-2 py-1 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                        :class="
                                          isCreatePromptLoading
                                            ? 'bg-gray-200'
                                            : null
                                        "
                                      >
                                        <div class="w-full text-right">
                                          {{
                                            promptCategoriesData.find(
                                              (item) =>
                                                item.id ===
                                                createPromptRequestData.category
                                            )?.name || "All"
                                          }}
                                        </div>

                                        <ChevronDownIcon
                                          class="-mr-1 h-5 w-5 text-gray-400"
                                          aria-hidden="true"
                                        />
                                      </MenuButton>

                                      <transition
                                        enter-active-class="transition ease-out duration-100"
                                        enter-from-class="transform opacity-0 scale-95"
                                        enter-to-class="transform opacity-100 scale-100"
                                        leave-active-class="transition ease-in duration-75"
                                        leave-from-class="transform opacity-100 scale-100"
                                        leave-to-class="transform opacity-0 scale-95"
                                      >
                                        <MenuItems
                                          class="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-y-auto h-64"
                                        >
                                          <div class="py-1">
                                            <MenuItem
                                              v-for="item in promptCategoriesData"
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
                                                @click="
                                                  onUsedByWhoClick(item.id)
                                                "
                                                >{{ item.name }}</a
                                              >
                                            </MenuItem>
                                          </div>
                                        </MenuItems>
                                      </transition>
                                    </Menu>
                                  </div>
                                  <div>
                                    <label
                                      for="about"
                                      class="block text-sm font-medium leading-6 text-gray-900"
                                      >Who can see?</label
                                    >
                                    <Menu
                                      as="div"
                                      class="relative inline-block text-left mt-2"
                                    >
                                      <MenuButton
                                        class="bg-gray-50 inline-flex w-32 justify-center gap-x-1.5 rounded-lg px-2 py-1 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                        :class="
                                          isCreatePromptLoading
                                            ? 'bg-gray-200'
                                            : null
                                        "
                                      >
                                        <div class="w-full text-right">
                                          {{
                                            privacyFilterItems.find(
                                              (item) =>
                                                item.key ===
                                                createPromptRequestData.privacy_type
                                            )?.name
                                          }}
                                        </div>
                                        <ChevronDownIcon
                                          class="-mr-1 h-5 w-5 text-gray-400"
                                          aria-hidden="true"
                                        />
                                      </MenuButton>

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
                                              v-for="item in privacyFilterItems"
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
                                                @click="
                                                  onPrivacyFilterItemClick(
                                                    item.key
                                                  )
                                                "
                                                >{{ item.name }}</a
                                              >
                                            </MenuItem>
                                          </div>
                                        </MenuItems>
                                      </transition>
                                    </Menu>
                                  </div>
                                </div>
                              </div>

                              <div class="w-full sm:w-2/3">
                                <label
                                  for="first-name"
                                  class="block text-sm font-medium leading-6 text-gray-900"
                                  >Prompt name</label
                                >
                                <div class="mt-2">
                                  <input
                                    v-model="createPromptRequestData.name"
                                    :disabled="isCreatePromptLoading"
                                    type="text"
                                    name="first-name"
                                    id="first-name"
                                    autocomplete="given-name"
                                    class="placeholder:px-5 px-4 block w-full bg-gray-50 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    :class="
                                      isCreatePromptLoading
                                        ? 'bg-gray-200'
                                        : null
                                    "
                                  />
                                  <p
                                    v-if="createPromptError['name']"
                                    class="!text-red-500 text-xs italic"
                                  >
                                    {{ createPromptError["name"] }}
                                  </p>
                                </div>
                              </div>

                              <div class="w-full">
                                <label
                                  for="about"
                                  class="block text-sm font-medium leading-6 text-gray-900"
                                  >Prompt Description</label
                                >
                                <div class="mt-2">
                                  <textarea
                                    v-model="
                                      createPromptRequestData.description
                                    "
                                    :disabled="isCreatePromptLoading"
                                    id="description"
                                    name="about"
                                    rows="5"
                                    placeholder="Write up to three sentences about your prompt."
                                    maxlength="160"
                                    class="bg-gray-50 px-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    :class="
                                      isCreatePromptLoading
                                        ? 'bg-gray-200'
                                        : null
                                    "
                                  />
                                  <p
                                    v-if="createPromptError['description']"
                                    class="!text-red-500 text-xs italic"
                                  >
                                    {{ createPromptError["description"] }}
                                  </p>
                                </div>
                                <p
                                  class="mt-1 text-sm leading-6 text-gray-600 font-light text-right"
                                >
                                  {{
                                    `${
                                      createPromptRequestData?.description
                                        .length || 0
                                    }/160 characters`
                                  }}
                                </p>
                              </div>

                              <div class="w-full">
                                <label
                                  for="about"
                                  class="block text-sm font-medium leading-6 text-gray-900"
                                  >Prompt Template</label
                                >
                                <div class="mt-2">
                                  <textarea
                                    v-model="
                                      createPromptRequestData.ai_template
                                    "
                                    :disabled="isCreatePromptLoading"
                                    id="description"
                                    name="about"
                                    rows="10"
                                    placeholder="Write a up to three sentences about your prompt."
                                    class="bg-gray-50 resize-none px-4 block w-full rounded-t-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  />
                                  <div
                                    class="bg-gray-50 px-4 block w-full border-t-0 rounded-b-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  >
                                    <div class="flex flex-wrap gap-2">
                                      <button
                                        v-for="hint in promptHints?.filter(
                                          (hint) => hint.name !== ''
                                        )"
                                        type="button"
                                        class="bg-gradient-to-br from-blue-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-1 focus:outline-none focus:ring-blue-200 dark:focus:ring-blue-800 font-medium rounded-full px-2 text-center !text-white text-xs"
                                        @click="onPromptHintClick(hint)"
                                      >
                                        {{ hint.name }}
                                      </button>
                                    </div>
                                  </div>
                                  <p
                                    v-if="createPromptError['ai_template']"
                                    class="!text-red-500 text-xs italic"
                                  >
                                    {{ createPromptError["ai_template"] }}
                                  </p>
                                </div>
                              </div>
                              <div
                                v-for="(hint, index) in promptHints"
                                class="w-full max-w-2xl px-3 py-4 !bg-white rounded-lg shadow-md"
                              >
                                <div>
                                  <div class="flex">
                                    <div class="w-4/12">
                                      <label
                                        for="first-name"
                                        class="block text-sm font-medium leading-6 text-gray-900"
                                        >Prompt Hint</label
                                      >
                                      <div>
                                        <input
                                          v-model="hint.name"
                                          :disabled="
                                            hint.disabled &&
                                            isCreatePromptLoading
                                          "
                                          type="text"
                                          class="placeholder:px-5 block w-full bg-gray-50 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-4"
                                          :class="
                                            hint.disabled
                                              ? 'cursor-not-allowed !bg-gray-200'
                                              : ''
                                          "
                                        />
                                        <p
                                          v-if="
                                            createPromptError?.['hint_name']?.[
                                              index
                                            ]
                                          "
                                          class="!text-red-500 text-xs italic"
                                        >
                                          {{
                                            createPromptError?.["hint_name"]?.[
                                              index
                                            ]
                                          }}
                                        </p>
                                      </div>
                                    </div>
                                    <div class="flex gap-3 ml-auto mt-2">
                                      <PlusCircleIcon
                                        @click="onAddPromptClick"
                                        class="-mr-1 h-6 w-6 hover:fill-blue-200 hover:shadow-sm"
                                        aria-hidden="true"
                                      />
                                      <TrashIcon
                                        @click="onDeletePromptClick(index)"
                                        class="-mr-1 h-6 w-6 hover:fill-blue-200 hover:shadow-sm"
                                        aria-hidden="true"
                                      />
                                    </div>
                                  </div>
                                  <div class="w-full mt-1">
                                    <label
                                      for="first-name"
                                      class="block text-sm font-medium leading-6 text-gray-900"
                                      >Prompt Hint Description
                                    </label>
                                    <div>
                                      <input
                                        v-model="hint.value"
                                        :disabled="isCreatePromptLoading"
                                        type="text"
                                        name="first-name"
                                        id="first-name"
                                        autocomplete="given-name"
                                        class="placeholder:px-5 block w-full bg-gray-50 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-4"
                                        :class="
                                          isCreatePromptLoading
                                            ? 'bg-gray-200'
                                            : null
                                        "
                                      />
                                      <p
                                        v-if="
                                          createPromptError?.[
                                            'hint_description'
                                          ]?.[index]
                                        "
                                        class="!text-red-500 text-xs italic"
                                      >
                                        {{
                                          createPromptError?.[
                                            "hint_description"
                                          ]?.[index]
                                        }}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div class="w-full">
                                <div
                                  v-if="token"
                                  class="mt-6 flex items-center justify-end gap-x-6"
                                >
                                  <button
                                    :disabled="isCreatePromptLoading"
                                    type="button"
                                    class="rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold shadow-sm hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    @click="onCancelCreatePromptClick"
                                  >
                                    <svg
                                      v-if="isCreatePromptLoading"
                                      aria-hidden="true"
                                      role="status"
                                      class="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 border-gray-100"
                                      viewBox="0 0 100 101"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="currentColor"
                                      ></path>
                                      <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="rgb(229 231 235)"
                                      ></path>
                                    </svg>
                                    Cancel
                                  </button>
                                  <button
                                    :disabled="isCreatePromptLoading"
                                    type="submit"
                                    class="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold !text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    @click="onCreatePromptClick"
                                  >
                                    <svg
                                      v-if="isCreatePromptLoading"
                                      aria-hidden="true"
                                      role="status"
                                      class="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600"
                                      viewBox="0 0 100 101"
                                      fill="white"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="#fff"
                                      ></path>
                                      <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="#1C64F2"
                                      ></path>
                                    </svg>
                                    Save
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TransitionRoot>
                  </div>
                </TabPanel>
                <TabPanel :key="2" class="flex flex-col h-full overflow-hidden">
                  <div class="flex-grow flex overflow-y-auto w-full">
                    <div
                      v-if="messageData.length > 0"
                      ref="chatContainer"
                      class="w-full"
                    >
                      <div
                        v-for="(msgGrp, index) in messageData"
                        :key="index"
                        style="
                          border-bottom: 1px solid rgb(235, 234, 226);
                          padding: 10px;
                        "
                        class="chat-group d-flex align-start"
                        :class="msgGrp.senderId ? 'bg-white' : 'bg-blue-100'"
                      >
                        <div
                          v-for="(msgData, msgIndex) in msgGrp.messages"
                          :key="msgIndex"
                          class="chat-font ml-3"
                          :class="[
                            msgGrp?.messages.length - 1 !== msgIndex
                              ? 'mb-3'
                              : 'mb-1',
                          ]"
                          :style="`font-size: ${settings.fontSize}px`"
                        >
                          <pre
                            class="formatted-text my-0"
                            :style="`font-size: ${settings.fontSize}px; `"
                            v-html="formattedText(msgData?.message)"
                          ></pre>
                          <p
                            v-if="
                              isCopiedTriggered === -1 ||
                              isCopiedTriggered !== index
                            "
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
                    <div v-else ref="noChatContainer" class="grow">
                      <div class="flex flex-col mb-4 gap-4 py-4 px-4">
                        <div class="flex justify-start">
                          <div
                            class="bg-blue-500 rounded-lg px-4 py-2 max-w-[80%]"
                          >
                            <p class="!text-white text-sm">
                              How can I help you today?
                            </p>
                          </div>
                        </div>
                        <div class="flex justify-start">
                          <div
                            class="bg-blue-500 rounded-lg px-4 py-2 max-w-[80%]"
                          >
                            <p class="!text-white text-sm">
                              Select a prompt to get started or select any text
                              on the screen to get a response.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    ref="messageContainer"
                    class="w-full mb-12 flex-shrink-0"
                  >
                    <div class="relative w-full bg-gray-50">
                      <div
                        class="overflow-hidden rounded-lg border border-gray-300 shadow-sm focus-within:border-indigo-100 focus-within:ring-1 focus-within:ring-indigo-100"
                      >
                        <span
                          v-if="selectedPrompt.key"
                          id="badge-dismiss-default"
                          class="inline-flex items-center px-2 py-1 my-2 mx-1 text-xs font-medium !text-white rounded bg-blue-600"
                        >
                          {{ selectedPrompt?.name }}
                          <button
                            type="button"
                            class="inline-flex items-center p-1 ml-2 text-sm text-blue-400 bg-transparent rounded-sm hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-300"
                            data-dismiss-target="#badge-dismiss-default"
                            aria-label="Remove"
                            @click="onRemoveSelectedPromptClick"
                          >
                            <svg
                              class="w-2 h-2 stroke-white"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 14 14"
                            >
                              <path
                                stroke="white"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                              />
                            </svg>
                          </button>
                        </span>

                        <textarea
                          v-model="sendMessageRequestData.message"
                          :disabled="isLoading"
                          ref="messageInput"
                          id="message-input"
                          rows="2"
                          name="description"
                          class="outline-none bg-gray-50 block px-2 pt-1 w-full resize-none border-0 py-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 mb-[-2px]"
                          :class="isLoading ? 'cursor-wait' : ''"
                          :placeholder="
                            !isLoading ? 'Ask a question...' : 'Loading...'
                          "
                          @keydown.enter="onSendClick"
                          @input="adjustHeight"
                        />

                        <!-- Spacer element to match the height of the toolbar -->
                        <div aria-hidden="true">
                          <div class="">
                            <div class="" />
                          </div>
                          <div class="h-px" />
                          <div class="py-2">
                            <div class="py-px">
                              <div class="h-9" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="absolute inset-x-px bottom-0">
                        <div
                          class="flex items-center justify-between space-x-3 border-t border-gray-200 px-2 py-2 sm:px-3 bg-white"
                        >
                          <div class="flex flex-wrap gap-2">
                            <Listbox
                              as="div"
                              v-model="sendMessageRequestData.metadata.tag_tone"
                              class="flex-shrink-0"
                            >
                              <ListboxLabel class="sr-only">Tone</ListboxLabel>
                              <div class="relative">
                                <ListboxButton
                                  class="relative inline-flex items-center whitespace-nowrap rounded-full bg-blue-400 px-0.5 py-0.5 text-sm font-medium text-gray-500 hover:bg-blue-500 sm:px-3"
                                >
                                  <span
                                    class="!text-white"
                                    :class="[
                                      !sendMessageRequestData.metadata.tag_tone
                                        ? ''
                                        : 'text-white',
                                      'hidden truncate sm:block text-xs',
                                    ]"
                                    >{{
                                      !sendMessageRequestData.metadata.tag_tone
                                        ? "Tone"
                                        : sendMessageRequestData.metadata
                                            .tag_tone
                                    }}
                                    <button
                                      v-if="
                                        sendMessageRequestData.metadata
                                          ?.tag_tone
                                      "
                                      type="button"
                                      class="inline-flex items-center p-1 ml-2 text-sm text-blue-400 bg-transparent rounded-sm hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-300"
                                      data-dismiss-target="#badge-dismiss-default"
                                      aria-label="Remove"
                                      @click.stop="
                                        sendMessageRequestData.metadata.tag_tone =
                                          ''
                                      "
                                    >
                                      <svg
                                        class="w-2 h-2 stroke-black"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 14 14"
                                      >
                                        <path
                                          stroke="white"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                          stroke-width="2"
                                          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                        />
                                      </svg>
                                    </button>
                                  </span>
                                </ListboxButton>

                                <transition
                                  leave-active-class="transition ease-in duration-100"
                                  leave-from-class="opacity-100"
                                  leave-to-class="opacity-0"
                                >
                                  <ListboxOptions
                                    class="absolute bottom-full left-0 z-10 mt-1 max-h-56 w-52 overflow-auto rounded-lg bg-white py-3 text-base shadow ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                                  >
                                    <ListboxOption
                                      as="template"
                                      v-for="(tone, index) in promptTonesData"
                                      :key="index"
                                      :value="tone?.name"
                                      v-slot="{ active }"
                                    >
                                      <li
                                        :class="[
                                          active ? 'bg-gray-100' : 'bg-white',
                                          'relative cursor-default select-none px-3 py-2',
                                        ]"
                                      >
                                        <div class="flex items-center">
                                          <span
                                            class="ml-3 block truncate font-medium"
                                            >{{ tone.name }}</span
                                          >
                                        </div>
                                      </li>
                                    </ListboxOption>
                                  </ListboxOptions>
                                </transition>
                              </div>
                            </Listbox>

                            <Listbox
                              as="div"
                              v-model="
                                sendMessageRequestData.metadata
                                  .tag_writing_style
                              "
                              class="flex-shrink-0"
                            >
                              <ListboxLabel class="sr-only"
                                >Writing Style</ListboxLabel
                              >
                              <div class="relative">
                                <ListboxButton
                                  class="relative inline-flex items-center whitespace-nowrap rounded-full bg-blue-400 px-0.5 py-0.5 text-sm font-medium text-gray-500 hover:bg-blue-500 sm:px-3"
                                >
                                  <span
                                    class="!text-white"
                                    :class="[
                                      !sendMessageRequestData.metadata
                                        .tag_writing_style
                                        ? ''
                                        : 'text-white',
                                      'hidden truncate sm:block text-xs',
                                    ]"
                                    >{{
                                      !sendMessageRequestData.metadata
                                        .tag_writing_style
                                        ? "Writing Style"
                                        : sendMessageRequestData.metadata
                                            .tag_writing_style
                                    }}
                                    <button
                                      v-if="
                                        sendMessageRequestData.metadata
                                          ?.tag_writing_style
                                      "
                                      type="button"
                                      class="inline-flex items-center p-1 ml-2 text-sm text-blue-400 bg-transparent rounded-sm hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-300"
                                      data-dismiss-target="#badge-dismiss-default"
                                      aria-label="Remove"
                                      @click.stop="
                                        sendMessageRequestData.metadata.tag_writing_style =
                                          ''
                                      "
                                    >
                                      <svg
                                        class="w-2 h-2 stroke-black"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 14 14"
                                      >
                                        <path
                                          stroke="white"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                          stroke-width="2"
                                          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                        />
                                      </svg>
                                    </button>
                                  </span>
                                </ListboxButton>

                                <transition
                                  leave-active-class="transition ease-in duration-100"
                                  leave-from-class="opacity-100"
                                  leave-to-class="opacity-0"
                                >
                                  <ListboxOptions
                                    class="absolute bottom-full right-50 z-10 mt-1 max-h-56 w-52 overflow-auto rounded-lg bg-white py-3 text-base shadow ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                                  >
                                    <ListboxOption
                                      as="template"
                                      v-for="(
                                        writingStyle, index
                                      ) in promptWritingStylesData"
                                      :key="writingStyle.value"
                                      :value="writingStyle.name"
                                      v-slot="{ active }"
                                    >
                                      <li
                                        :class="[
                                          active ? 'bg-gray-100' : 'bg-white',
                                          'relative cursor-default select-none px-3 py-2',
                                        ]"
                                      >
                                        <div class="flex items-center">
                                          <span
                                            class="block truncate font-medium"
                                            >{{ writingStyle.name }}</span
                                          >
                                        </div>
                                      </li>
                                    </ListboxOption>
                                  </ListboxOptions>
                                </transition>
                              </div>
                            </Listbox>

                            <Listbox
                              as="div"
                              v-model="
                                sendMessageRequestData.metadata.tag_language
                              "
                              class="flex-shrink-0"
                            >
                              <ListboxLabel class="sr-only"
                                >Language
                              </ListboxLabel>
                              <div class="relative">
                                <ListboxButton
                                  class="relative inline-flex items-center whitespace-nowrap rounded-full bg-blue-400 px-0.5 py-0.5 text-sm font-medium text-gray-500 hover:bg-blue-500 sm:px-3"
                                >
                                  <span
                                    class="!text-white"
                                    :class="[
                                      !sendMessageRequestData.metadata
                                        .tag_language
                                        ? ''
                                        : 'text-white',
                                      'hidden truncate sm:block text-xs',
                                    ]"
                                    >{{
                                      !sendMessageRequestData.metadata
                                        .tag_language
                                        ? "Language"
                                        : sendMessageRequestData.metadata
                                            .tag_language
                                    }}
                                    <button
                                      v-if="
                                        sendMessageRequestData.metadata
                                          ?.tag_language
                                      "
                                      type="button"
                                      class="inline-flex items-center p-1 ml-2 text-sm text-blue-400 bg-transparent rounded-sm hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-300"
                                      data-dismiss-target="#badge-dismiss-default"
                                      aria-label="Remove"
                                      @click.stop="
                                        sendMessageRequestData.metadata.tag_language =
                                          ''
                                      "
                                    >
                                      <svg
                                        class="w-2 h-2 stroke-black"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 14 14"
                                      >
                                        <path
                                          stroke="white"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                          stroke-width="2"
                                          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                        />
                                      </svg>
                                    </button>
                                  </span>
                                </ListboxButton>

                                <transition
                                  leave-active-class="transition ease-in duration-100"
                                  leave-from-class="opacity-100"
                                  leave-to-class="opacity-0"
                                >
                                  <ListboxOptions
                                    class="absolute bottom-full right-50 z-10 mt-1 max-h-56 w-52 overflow-auto rounded-lg bg-white py-3 text-base shadow ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                                  >
                                    <ListboxOption
                                      as="template"
                                      v-for="(
                                        language, index
                                      ) in promptLanguagesData"
                                      :key="index"
                                      :value="language.name"
                                      v-slot="{ active }"
                                    >
                                      <li
                                        :class="[
                                          active ? 'bg-gray-100' : 'bg-white',
                                          'relative cursor-default select-none px-3 py-2',
                                        ]"
                                      >
                                        <div class="flex items-center">
                                          <span
                                            class="block truncate font-medium"
                                            >{{ language.name }}</span
                                          >
                                        </div>
                                      </li>
                                    </ListboxOption>
                                  </ListboxOptions>
                                </transition>
                              </div>
                            </Listbox>
                          </div>
                          <div class="flex-shrink-0">
                            <PaperAirplaneIcon
                              class="h-5 w-5 fill-gray-400"
                              aria-hidden="true"
                              @click="onSendClick"
                            />
                          </div>
                        </div>
                      </div>
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
                    @click="selectedTab = index"
                  >
                    {{ tab.name }}
                  </button>
                </Tab>
              </TabList>
            </TabGroup>
          </div>
        </div>
      </TransitionChild>
    </TransitionRoot>
    <div
      :style="{ bottom: `${bottom}px` }"
      class="fixed flex right-0 bottom-0 m-3 z-[999999] items-end font-sans leading-1em"
    >
      <button
        class="flex rounded-full cursor-pointer border-none bg-white hover:bg-blue-400 focus:bg-gray-50"
        id="respond-buddy-fba-button"
        ref="fbaButton"
        @mousedown.prevent="dragStart"
        @click.stop="toggle()"
      >
        <img
          src="/assets/rb-icon-2.png"
          class="text-lg"
          alt="Respond Buddy"
          style="
            width: 35px;
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
  /* background-color: rgb(250, 249, 246); */
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
  height: 100%;
  z-index: 9999999999;
  display: flex;
  align-items: center;
  justify-content: end;
}

.sidebar {
  background-color: white;
  width: 450px;
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
  z-index: 9999999999;
}

.expand-on-hover {
  transition: transform 0.3s ease-in-out;
}

.expand-on-hover:hover {
  transform: scale(1.2);
}

.gradient-border {
  @apply relative p-2;

  /* The actual gradient border */
  &::before {
    content: "";
    @apply absolute top-0 left-0 w-full h-full z-10;
    background: linear-gradient(
      to right,
      rgb(96 165 250),
      #2563eb
    ); /* Change gradient colors as needed */
    border-radius: inherit; /* If your element has rounded corners */
    z-index: -1;
    box-sizing: border-box; /* To have consistent sizing */
    /* Adjust width and height for the border effect */
    width: calc(100% + 4px);
    height: calc(100% + 4px);
    transform: translate(
      -2px,
      -2px
    ); /* Half of the total width and height adjustments */
  }
}

.prompt-card {
  @apply relative p-1;

  /* The actual gradient border */
  &::before {
    content: "";
    @apply absolute top-0 left-0 w-full h-full z-10;
    background: linear-gradient(to right, var(--tw-gradient-stops));
    border-radius: inherit; /* If your element has rounded corners */
    z-index: -1;
    box-sizing: border-box; /* To have consistent sizing */
    /* Adjust width and height for the border effect */
    width: calc(100% + 4px);
    height: calc(100% + 4px);
    transform: translate(
      -2px,
      -2px
    ); /* Half of the total width and height adjustments */
  }
}
</style>
