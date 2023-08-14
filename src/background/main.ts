import { onMessage, sendMessage } from "webext-bridge/background";
import type { Tabs } from "webextension-polyfill";
import { generateUUID } from "~/logic/helper";
import {
  messages,
  token,
  userId,
  credits,
  newCreditDate,
  fontSize,
} from "~/logic/storage";

// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import("/@vite/client");
  // load latest content script
  import("./contentScriptHMR");
}

const creditResetAmount = 10;

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
  // sendMessage(
  //   "tab-prev",
  //   { title: tab.title },
  //   { context: "content-script", tabId }
  // );
});

browser.action.onClicked.addListener(async () => {});

browser.contextMenus.onClicked.addListener(async (info, tab) => {
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
    const tabs = await browser?.tabs.query({
      active: true,
      currentWindow: true,
    });
    await processMessage(message?.data?.message, tabs[0].id);
    return {
      credits: credits.value,
    };
  } catch (error) {}
});

onMessage("get-credits", async (message) => {
  return {
    credits: credits.value,
  };
});

onMessage("settings", async (message) => {
  const tabs = await browser?.tabs.query({
    active: true,
    currentWindow: true,
  });

  console.log("🚀 ~ file: main.ts:149 ~ onMessage ~ message", message);

  let settings = {
    fontSize: fontSize.value,
  };

  if (!message?.data?.type) {
    await sendMessage("settings", settings, {
      context: "content-script",
      tabId: tabs[0].id,
    });
  }

  return settings;
});

onMessage("toggle-chat", async (message) => {
  const tabs = await browser?.tabs.query({
    active: true,
    currentWindow: true,
  });

  await sendMessage("toggle-chat", message?.data, {
    context: "content-script",
    tabId: tabs[0].id,
  });
});

onMessage("get-access-token", async (data) => {
  if (!data.data.accessToken) return;
  token.value = data.data.accessToken.trim();
});

// onMessage("get-current-tab", async () => {
//   try {
//     const tab = await browser.tabs.get(previousTabId);
//     return {
//       title: tab?.title,
//     };
//   } catch {
//     return {
//       title: undefined,
//     };
//   }
// });

const processMessage = async (message: string, tabId: number) => {
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

// browser.tabs.query({ active: true, currentWindow: true }).then(async (tabs) => {
//   const currentTab = tabs[0];

//   // Get a value from local storage
//   let res = await sendMessage(
//     "get-access-token",
//     { key: "accessToken" },
//     { context: "content-script", tabId: currentTab.id }
//   );
// });

const callGPTMessage = async (message: string) => {
  try {
    if (credits.value <= 0)
      return "You have no credits left, please upgrade your plan.";

    if (message) {
      const data = await fetch(
        "https://api.respondbuddy.com/api/v1/message/free",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            user_id: userId.value,
          }),
        }
      );

      credits.value = credits.value - 1;

      let response = await data.json();

      return response?.data?.message || "";
    }
  } catch (error) {
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
// };i

// const scheduleDailyReset = (amount: number) => {
//   // Calculate the time until the next reset (24 hours from now)
//   // if (newCreditDate.value > new Date().getTime()) return;

//   // const currentTime = new Date();
//   // const nextResetTime = new Date(currentTime);
//   // nextResetTime.setDate(currentTime.getDate() + 1);
//   // nextResetTime.setHours(0, 0, 0, 0); // Reset time to midnight

//   // credits.value = amount;
//   newCreditDate.value = 1000;

//   // Schedule the reset and recursively call this function to schedule the next one
// };

// scheduleDailyReset(creditResetAmount);

// sendMessageToActiveTab();
