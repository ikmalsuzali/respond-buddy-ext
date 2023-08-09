import { onMessage, sendMessage } from "webext-bridge/background";
import type { Tabs } from "webextension-polyfill";
import { generateUUID } from "~/logic/helper";
import { messages, token, userId } from "~/logic/storage";

// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import("/@vite/client");
  // load latest content script
  import("./contentScriptHMR");
}

browser.runtime.onInstalled.addListener((): void => {
  // eslint-disable-next-line no-console
  userId.value = generateUUID();
  messages.value = [];

  browser.contextMenus.create({
    id: "respond-buddy-parent",
    title: "RespondBuddy",
    type: "normal",
    contexts: ["selection"],
  });

  browser.contextMenus.create({
    parentId: "respond-buddy-parent",
    id: "summarize",
    title: "Summarize",
    contexts: ["selection"],
  });

  browser.contextMenus.create({
    parentId: "respond-buddy-parent",
    id: "respond",
    title: "Respond",
    contexts: ["selection"],
  });

  browser.contextMenus.create({
    parentId: "respond-buddy-parent",
    id: "translate",
    title: "Translate",
    contexts: ["selection"],
  });

  browser.contextMenus.create({
    parentId: "respond-buddy-parent",
    id: "simplify",
    title: "Simplify",
    contexts: ["selection"],
  });

  browser.contextMenus.create({
    parentId: "respond-buddy-parent",
    id: "custom-response",
    title: "Custom Response",
    contexts: ["selection"],
  });
});

if (typeof chrome?.app?.isInstalled !== "undefined") {
  browser.runtime.sendMessage("test");
}

let previousTabId = 0;

// communication example: send previous tab title from background page
// see shim.d.ts for type declaration

browser.tabs.onActivated.addListener(async ({ tabId }) => {
  console.log("tabId", tabId);

  if (!previousTabId) {
    previousTabId = tabId;
    return;
  }

  let tab: Tabs.Tab;

  try {
    tab = await browser.tabs.get(previousTabId);
    previousTabId = tabId;
  } catch {
    return;
  }

  // eslint-disable-next-line no-console
  console.log("previous tab", tab);
  // sendMessage(
  //   "tab-prev",
  //   { title: tab.title },
  //   { context: "content-script", tabId }
  // );
});

browser.action.onClicked.addListener(async () => {
  console.log("action clicked");
});

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  console.log({ info, tab });
  if (info.menuItemId === "summarize") {
    processMessage(`Summarize: ${info.selectionText}`, tab.id);
  } else if (info.menuItemId === "respond") {
    processMessage(`Respond: ${info.selectionText}`, tab.id);
  } else if (info.menuItemId === "simplify") {
    processMessage(`Simplify: ${info.selectionText}`, tab.id);
  } else if (info.menuItemId === "custom-response") {
    processMessage(`Respond: ${info.selectionText}`, tab.id);
  }

  // sendMessage(info.selectionText);
});

onMessage("ask-chat", async (message) => {
  try {
    console.log("🚀 ~ file: main.ts:142 ~ onMessage ~ message:", message);
    const tab = await browser.tabs.get(previousTabId);
    console.log("current tab", tab);
    await processMessage(message?.data?.message, tab.id);
  } catch (error) {}
});

onMessage("get-current-tab", async () => {
  try {
    const tab = await browser.tabs.get(previousTabId);
    console.log("current tab", tab);
    return {
      title: tab?.title,
    };
  } catch {
    return {
      title: undefined,
    };
  }
});

const processMessage = async (message: string, tabId: number) => {
  console.log("🚀 ~ file: main.ts:165 ~ processMessage ~ tabId:", tabId);
  console.log("🚀 ~ file: main.ts:165 ~ processMessage ~ message:", message);
  const senderMessage = {
    senderId: userId.value,
    messages: [
      {
        message,
        time: new Date().getTime(),
      },
    ],
  };
  messages.value.push(senderMessage);

  await sendMessage(
    "app-message",
    { appMessages: senderMessage },
    { context: "content-script", tabId }
  );

  const responseMessage = await callGPTMessage(message);

  const botMessage = {
    senderId: null,
    messages: [
      {
        message: responseMessage,
        time: new Date().getTime(),
      },
    ],
  };

  messages.value.push(botMessage);

  await sendMessage(
    "app-message",
    { appMessages: botMessage },
    { context: "content-script", tabId }
  );
};

const callGPTMessage = async (message: string) => {
  try {
    console.log("🚀 ~ file: main.ts:141 ~ callGPTMessage ~ message:", message);
    if (message) {
      const data = await fetch("http://0.0.0.0:8080/api/v1/message/free", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          user_id: userId.value,
        }),
      });

      let response = await data.json();
      console.log(
        "🚀 ~ file: main.ts:221 ~ callGPTMessage ~ response:",
        response
      );

      return response?.data?.message || "";
    }
  } catch (error) {
    console.log(error);
    return "Failed to get response, try again later.";
  }
};

// const ensureSendMessage = async (tabId, message, callback) => {
//   try {
//     const response = await chrome.tabs.sendMessage(tabId, { ping: true });
//     if (response && response.pong) {
//       // Content script ready
//       browser.tabs.sendMessage(tabId, message, callback);
//     } else {
//       // No listener on the other end
//       await injectScript(tabId, message, callback);
//     }
//   } catch (error) {
//     if (
//       error.message &&
//       error.message.includes("Extension context invalidated")
//     ) {
//       // Handle the extension context invalidated error here.
//       // You may want to retry the injection or log a specific message.
//       await injectScript(tabId, message, callback);
//     } else {
//       console.error(error);
//       throw new Error(`Unable to inject script into tab ${tabId}`);
//     }
//   }
// };

// const injectScript = async (tabId, message, callback) => {
//   try {
//     await browser.tabs.executeScript(tabId, { file: "content_script.js" });
//     browser.tabs.sendMessage(tabId, message, callback);
//   } catch (error) {
//     console.error(browser.runtime.lastError || error);
//     throw new Error(`Unable to inject script into tab ${tabId}`);
//   }
// };

// const sendMessageToActiveTab = () => {
//   browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     ensureSendMessage(tabs[0].id, { greeting: "hello" });
//   });
// };

// sendMessageToActiveTab();
