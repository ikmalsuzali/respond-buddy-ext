import { onMessage, sendMessage } from "webext-bridge/content-script";
import PromptListing from "../views/PromptListing.vue";
import MessageListing from "../views/MessageListing.vue";

const useHtmlEmbedding = () => {
  const imageConfig = ref({
    selector: "img",
    actions: ["download-image"],
  });

  const webConfig = ref([
    {
      website: "Medium",
      matchUrl: "medium.com/",
      selector: "section",
      selectionPosition: "firstChild",
      single: true,
      actions: [
        {
          name: "Summarize Page",
          key: "summarize-page",
        },
        {
          name: "Summarize Page",
          key: "summarize-page",
        },
      ],
      style: {
        "text-align": "center",
        padding: "20px",
        "margin-bottom": "-25px",
      },
    },
    {
      website: "Chat GPT",
      matchUrl: "chat.openai.com",
      selector: "section",
      selectionPosition: "firstChild",
      single: true,
      actions: [
        {
          name: "Summarize Page",
          key: "summarize-page",
        },
        {
          name: "Summarize Page",
          key: "summarize-page",
        },
      ],
      style: {
        "text-align": "center",
        padding: "20px",
        "margin-bottom": "-25px",
      },
    },
    {
      website: "CNN",
      matchUrl: "cnn.com/",
      selector: "section",
      selectionPosition: "firstChild",
      single: true,
      actions: [
        {
          name: "Summarize Page",
          key: "summarize-page",
        },
        {
          name: "Summarize Page",
          key: "summarize-page",
        },
      ],
      style: {
        "text-align": "center",
        padding: "20px",
        "margin-bottom": "-25px",
      },
    },
    {
      website: "OpenAI",
      matchUrl: "chat.openai.com/",
      selector: "div.flex.h-full.flex-col.items-center.justify-center",
      selectionPosition: "firstChild",
      single: true,
      actions: [
        {
          name: "Summarize Page",
          key: "summarize-page",
        },
        {
          name: "Summarize Page",
          key: "summarize-page",
        },
      ],
      style: {
        "text-align": "center",
        padding: "20px",
        "margin-bottom": "-25px",
      },
    },
    // ...other objects for different websites or conditions
  ]);

  const documentImages = ref([]);
  const documentWeb = ref(null);
  const prevUrl = ref("");

  const embedChatGPT = () => {
    const selector = document.querySelector(
      "#__next > div.relative.z-0.flex.h-full.w-full.overflow-hidden > div.relative.flex.h-full.max-w-full.flex-1.flex-col.overflow-hidden > main > div.flex.h-full.flex-col > div.flex-1.overflow-hidden > div > div.flex.h-full.flex-col.items-center.justify-center"
    );

    const chatgptPromptSelector = document.querySelector(
      "#__next > div.relative.z-0.flex.h-full.w-full.overflow-hidden > div.relative.flex.h-full.max-w-full.flex-1.flex-col.overflow-hidden > main > div.flex.h-full.flex-col > div.w-full.pt-2.md\\:pt-0.dark\\:border-white\\/20.md\\:border-transparent.md\\:dark\\:border-transparent.md\\:w-\\[calc\\(100\\%-\\.5rem\\)\\] > form > div > div:nth-child(1) > div"
    );

    const chatgptMessageOptionSelector = document.querySelector(
      "#__next > div.relative.z-0.flex.h-full.w-full.overflow-hidden > div.relative.flex.h-full.max-w-full.flex-1.flex-col.overflow-hidden > main > div.flex.h-full.flex-col > div.w-full.pt-2.md\\:pt-0.dark\\:border-white\\/20.md\\:border-transparent.md\\:dark\\:border-transparent.md\\:w-\\[calc\\(100\\%-\\.5rem\\)\\] > form"
    );

    const foundChatgptMessageOptionContainer = document.querySelector(
      "#embed-gpt-message-option"
    );

    const foundChatgptPromptContainer = document.querySelector("#embed-gpt");

    if (foundChatgptMessageOptionContainer) return;

    if (!chatgptMessageOptionSelector) return;
    const chatgptMessageOptionContainer = document.createElement("div");
    chatgptMessageOptionSelector.classList.remove("flex-row");
    chatgptMessageOptionSelector.classList.add("flex-col");
    chatgptMessageOptionSelector.insertBefore(
      chatgptMessageOptionContainer,
      chatgptMessageOptionSelector.firstChild
    );

    const chatgptMessageOptionRoot = document.createElement("div");
    const chatgptMessageOptionStyleEl = document.createElement("link");
    const chatgptMessageOptionShadowDOM =
      chatgptMessageOptionContainer.attachShadow?.({
        mode: __DEV__ ? "open" : "closed",
      }) || chatgptMessageOptionContainer;
    chatgptMessageOptionStyleEl.setAttribute("rel", "stylesheet");
    chatgptMessageOptionStyleEl.setAttribute(
      "href",
      browser.runtime.getURL("dist/contentScripts/style.css")
    );
    chatgptMessageOptionShadowDOM.appendChild(chatgptMessageOptionStyleEl);
    chatgptMessageOptionShadowDOM.appendChild(chatgptMessageOptionRoot);

    chatgptMessageOptionContainer.id = "embed-gpt-message-option";
    chatgptMessageOptionContainer.style.width = "100%";

    createApp(MessageListing, {
      selector: `#${chatgptMessageOptionContainer.id}`,
    }).mount(chatgptMessageOptionRoot);

    if (foundChatgptPromptContainer) return;
    if (!selector) return;
    // remove all child element
    while (selector.firstChild) {
      selector.removeChild(selector.firstChild);
    }

    const embedPromptContainer = document.createElement("div");
    selector.insertBefore(embedPromptContainer, selector.firstChild);
    const root = document.createElement("div");
    const styleEl = document.createElement("link");
    const shadowDOM =
      embedPromptContainer.attachShadow?.({
        mode: __DEV__ ? "open" : "closed",
      }) || embedPromptContainer;
    styleEl.setAttribute("rel", "stylesheet");
    styleEl.setAttribute(
      "href",
      browser.runtime.getURL("dist/contentScripts/style.css")
    );
    shadowDOM.appendChild(styleEl);
    shadowDOM.appendChild(root);

    embedPromptContainer.id = "embed-gpt";
    embedPromptContainer.style.width = "100%";
    // const app = createApp({
    //   data() {
    //     return {
    //       selector: `#${container.id}`,
    //       actions: config.actions,
    //       style: config.style,
    //     };
    //   },
    // });
    // app.component("test", test).mount(root);
    createApp(PromptListing, {
      selector: `#${embedPromptContainer.id}`,
    }).mount(root);

    if (chatgptPromptSelector) {
      chatgptPromptSelector?.remove();
    }

    // // Iterate over each element and remove it from the document
    // chatgptPrompts.forEach((element) => {
    //   element.remove();
    // });
  };

  const embedWeb = (currentUrl: string) => {
    // Loop through web config and check if the current url matches any of the matchUrlj
    // If it matches, then check if the selector exists on the page
    // If it exists, then append the style and actions to the selector
    webConfig.value.forEach((config) => {
      if (
        currentUrl.includes(config.matchUrl) &&
        currentUrl !== prevUrl.value
      ) {
        prevUrl.value = currentUrl;
        const selectors = document.querySelectorAll(config.selector);

        selectors.forEach((selector, index) => {
          if (config.single && index > 0) return;
          const container = document.createElement("div");
          selector.insertBefore(container, selector.firstChild);
          const root = document.createElement("div");
          const styleEl = document.createElement("link");
          const shadowDOM =
            container.attachShadow?.({ mode: __DEV__ ? "open" : "closed" }) ||
            container;
          styleEl.setAttribute("rel", "stylesheet");
          styleEl.setAttribute(
            "href",
            browser.runtime.getURL("dist/contentScripts/style.css")
          );
          shadowDOM.appendChild(styleEl);
          shadowDOM.appendChild(root);

          container.id = "embed-web-" + index;
          // const app = createApp({
          //   data() {
          //     return {
          //       selector: `#${container.id}`,
          //       actions: config.actions,
          //       style: config.style,
          //     };
          //   },
          // });
          // app.component("test", test).mount(root);
          // createApp(ButtonGroup, {
          //   selector: `#${container.id}`,
          //   prompts: config.actions,
          //   style: config.style,
          // }).mount(root);

          //   documentWeb.value.push({
          //     selector: `#${selector.id}`,
          //     actions: config.actions,
          //     style:
          //       "text-align: center; padding: 20px; margin-bottom: -25px; width: 100%;",
          //   } as never);
        });
      }
    });
  };

  const embedImages = () => {
    const images = document.querySelectorAll("img");
    // Get all unique images from the page and filter images with height and width less than 70px

    // Loop through images and document createElement div and append image to it
    images.forEach((image, index) => {
      const container = document.createElement("div");
      container.style.position = "relative";
      container.style.display = "inline-block";
      container.id = "embed-image-" + index;
      if (image.parentNode instanceof HTMLElement) {
        image.parentNode.insertBefore(container, image);
        container.appendChild(image);
        documentImages.value.push({
          id: container.id,
        } as never);
      }
    });
  };

  onMessage("fetch-html-embedding-configs", (message) => {});

  const listenSendButtonClick = () => {
    document.addEventListener("mousedown", (event) => {
      if (!selectedPrompt.value.aiTemplate) return;
      const sendButton = document.querySelector('[data-testid="send-button"]');
      if (!sendButton?.contains(event.target)) return;
      updateTextToPrompt();

      sendMessage("update-template-count", {
        id: selectedPrompt.value.id,
      });
      sendMessage(
        "set-selected-prompt",
        {
          id: null,
          key: null,
          name: null,
          aiTemplate: null,
        },
        "background"
      );
    });
  };

  const listenEnterKeyPress = () => {
    const promptTextArea = document.querySelector("#prompt-textarea");
    const sendButton = document.querySelector('[data-testid="send-button"]');
    promptTextArea?.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && selectedPrompt.value.aiTemplate) {
        event.preventDefault();
        event.stopPropagation();
        updateTextToPrompt();
        sendButton?.click();

        sendMessage("update-template-count", {
          id: selectedPrompt.value.id,
        });
        sendMessage(
          "set-selected-prompt",
          {
            id: null,
            key: null,
            name: null,
            aiTemplate: null,
          },
          "background"
        );
      }

      // event.preventDefault();
      // event.stopPropagation();
      // console.log(
      //   "🚀 ~ file: useHtmlEmbedding.ts:324 ~ promptTextArea?.addEventListener ~ promptTextArea:",
      //   promptTextArea
      // );

      if (event.key !== "Enter" || !selectedPrompt.value.aiTemplate) return;
    });

    document.addEventListener("keydown", (event) => {
      console.log(
        "🚀 ~ file: useHtmlEmbedding.ts:315 ~ document.addEventListener ~ event:",
        event
      );
      if (event.key !== "Enter" || !selectedPrompt.value.aiTemplate) return;

      event.preventDefault();
      event.stopPropagation();

      updateTextToPrompt();
    });
  };

  const updateTextToPrompt = () => {
    const textArea = document.querySelector("#prompt-textarea");

    if (textArea) {
      textArea.value = generatePrompt(
        selectedPrompt.value.aiTemplate,
        textArea.value
      );
      textArea.dispatchEvent(new Event("input", { bubbles: true }));
    }

    return;
  };

  const generatePrompt = (promptTemplate: string, promptValue: string) => {
    if (!promptTemplate && promptValue) return promptValue;
    let prompt = "";
    prompt += `${
      promptTemplate.includes("[input]")
        ? replaceInputWithValue(promptTemplate, promptValue)
        : promptTemplate
    }\n`;
    prompt += `Below is the parameters to build this response prompt:\n`;
    prompt += `Please include, "Created by Respond Buddy - https://respondbuddy.com"`;
    prompt += `\n Please write in ${
      selectedTemplateTone.value.name
        ? `${selectedTemplateTone.value.name.toLowerCase()} tone,`
        : ""
    } ${
      selectedTemplateWritingStyle.value.name
        ? `${selectedTemplateWritingStyle.value.name.toLowerCase()} writing style`
        : ""
    } written in ${selectedTemplateLanguage.value.name || "English"}.\n\n`;

    return prompt;
  };

  const replaceInputWithValue = (
    inputString: string | null,
    replacementValue: string
  ) => {
    if (!inputString) return "";
    const pattern = /\[input\]/g;
    const replacedString = inputString.replace(pattern, replacementValue);
    return replacedString || "";
  };

  const selectedTemplateWritingStyle = ref({
    name: "",
    key: "",
  });

  const selectedTemplateLanguage = ref({
    name: "",
    key: "",
  });

  const selectedTemplateTone = ref({
    name: "",
    key: "",
  });

  const selectedPrompt = ref({
    id: "",
    name: "",
    key: "",
    ai_template: "",
  });

  onMessage("set-selected-prompt-1", (data) => {
    selectedPrompt.value = data.data.selectedPrompt;
  });

  onMessage("set-template-tone", (data) => {
    selectedTemplateTone.value = data.data.selectedTemplateTone;
  });

  onMessage("set-template-writing-style", (data) => {
    selectedTemplateWritingStyle.value =
      data.data?.selectedTemplateWritingStyle;
  });

  onMessage("set-template-language", (data) => {
    selectedTemplateLanguage.value = data.data?.selectedTemplateLanguage;
  });

  return {
    imageConfig,
    embedImages,
    documentImages,
    embedWeb,
    embedChatGPT,
    documentWeb,
    // listenAndAppendRequestPayload,
    listenEnterKeyPress,
    listenSendButtonClick,
  };
};

export default useHtmlEmbedding;
