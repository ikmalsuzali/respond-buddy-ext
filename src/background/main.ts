import { onMessage, sendMessage } from "webext-bridge/background";
import type { Tabs } from "webextension-polyfill";
import { generateUUID } from "~/logic/helper";
import {
  messages,
  token,
  userId,
  credits,
  fontSize,
  chatButtonPosition,
  templates,
} from "~/logic/storage";

// let webUrl = "https://api.respondbuddy.com";
let webUrl = "http://0.0.0.0:8080";

// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import("/@vite/client");
  // load latest content script
  import("./contentScriptHMR");

  // webUrl = "http://0.0.0.0:8080";
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

  templatesInit();
});

let previousTabId = 0;

// communication example: send previous tab title from background page
// see shim.d.ts for type declaration

browser.tabs.onActivated.addListener(async ({ tabId }) => {
  if (!previousTabId) {
    previousTabId = tabId;
    return;
  }

  creditInit();
  messagesInit();

  let tab: Tabs.Tab;

  try {
    tab = await browser.tabs.get(previousTabId);
    previousTabId = tabId;
  } catch {
    return;
  }
});

browser.action.onClicked.addListener(async () => {});

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "summarize") {
    processMessage(`Summarize: ${info.selectionText}`, tab.id, {});
  } else if (info.menuItemId === "respond") {
    processMessage(`Respond: ${info.selectionText}`, tab.id, {});
  } else if (info.menuItemId === "simplify") {
    processMessage(`Simplify: ${info.selectionText}`, tab.id, {});
  } else if (info.menuItemId === "custom-response") {
    processMessage(`Respond: ${info.selectionText}`, tab.id, {});
  }

  // sendMessage(info.selectionText);
});

onMessage("ask-chat", async (message) => {
  try {
    const tabs = await browser?.tabs.query({
      active: true,
      currentWindow: true,
    });

    await processMessage(
      message?.data?.message,
      tabs[0].id,
      message.data?.metadata || {}
    );
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

// onMessage("get", (key) => {
//   return storage[key];
// });

// onMessage("set", ({ key, value }) => {
//   storage[key] = value;
// });

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

const processMessage = async (message: string, tabId: number, metadata: {}) => {
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

  const responseMessage = await callGPTMessage(message, metadata, tabId);

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

  // await sendMessage(
  //   "app-message",
  //   { appMessages: botMessage },
  //   { context: "content-script", tabId }
  // );
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
const templatesInit = async () => {
  try {
    const data = await fetch(`${webUrl}/api/v1/tags`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    let response = await data.json();

    if (!response.data || response?.data.length === 0) return;
    console.log(response?.data);
    templates.value = response?.data || [];
  } catch (error) {}
};

const creditInit = async () => {
  if (!token.value) return credits.value;
  try {
    const data = await fetch(`${webUrl}/api/v1/credit`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token.value}`,
      },
    });

    let response = await data.json();

    if (response.credits) {
      credits.value = response.credits;
    }

    return credits.value;
  } catch (error) {}
};

const callGPTMessage = async (message: string, metadata: any, tabId: any) => {
  try {
    let userIdentity = !token.value ? userId.value : null;
    if (credits.value <= 0) {
      let botMessage = {
        update: false,
        loading: false,
        senderId: null,
        messages: [
          {
            message: "You have no credits left, please upgrade your plan.",
            time: new Date().getTime(),
          },
        ],
      };

      // If stream is supported, push the response to the stream
      await sendMessage(
        "app-message",
        { appMessages: botMessage },
        { context: "content-script", tabId }
      );

      return;
    }

    if (!message) return "Please enter a message.";

    let botMessage = {
      update: false,
      loading: true,
      senderId: null,
      messages: [
        {
          message: "Loading...",
          time: new Date().getTime(),
        },
      ],
    };

    // If stream is supported, push the response to the stream
    await sendMessage(
      "app-message",
      { appMessages: botMessage },
      { context: "content-script", tabId }
    );

    const data = await fetch(`${webUrl}/api/v1/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify({
        message,
        user_identity: userIdentity,
        metadata,
      }),
    });

    credits.value = credits.value - 1;

    const transferEncoding = data.headers.get("Transfer-Encoding");
    const contentLength = data.headers.get("Content-Length");
    const isMissingContentLength =
      !contentLength || parseInt(contentLength) > 1000000; // Adjust the threshold as needed
    if (
      (transferEncoding && transferEncoding.toLowerCase() === "chunked") ||
      isMissingContentLength
    ) {
      botMessage.update = true;

      const reader = data.body.getReader();
      // Start reading the stream and processing its content
      let responseString = "";
      let chunks = [];
      while (true) {
        const { done, value } = await reader.read();

        // When the stream is fully consumed, done will be true
        if (done) {
          botMessage.loading = false;
          await sendMessage(
            "app-message",
            { appMessages: botMessage },
            { context: "content-script", tabId }
          );

          break;
        }

        // For the sake of this example, we convert each chunk to text and log it
        if (value) {
          let streamData = new TextDecoder("utf-8").decode(value);
          if (!streamData) return;

          responseString += streamData.toString();
          botMessage.messages[0].message = responseString;

          await sendMessage(
            "app-message",
            { appMessages: botMessage },
            { context: "content-script", tabId }
          );
        }
      }

      return responseString;
    } else {
      const response = await data.json();

      botMessage.loading = false;
      botMessage.update = true;
      botMessage.messages[0].message = response?.data?.message || "";

      await sendMessage(
        "app-message",
        { appMessages: botMessage },
        { context: "content-script", tabId }
      );

      if (response?.data?.message) {
        return response?.data?.message || "";
      }

      // Return the entire content (concatenated chunks)
      // return chunks.join("");

      // return response?.data?.message || "";
    }
  } catch (error) {
    let botMessage = {
      update: true,
      loading: false,
      senderId: null,
      messages: [
        {
          message: "Failed to get response, try again later",
          time: new Date().getTime(),
        },
      ],
    };

    await sendMessage(
      "app-message",
      { appMessages: botMessage },
      { context: "content-script", tabId }
    );

    return "Failed to get response, try again later.";
  }
};

const messagesInit = async () => {
  try {
    const data = await fetch(`${webUrl}/api/v1/message`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify({
        user_id: userId.value,
        token: token.value,
      }),
    });

    let response = await data.json();

    messages.value = response?.data?.messages || [];
    messages.value = messages.value.slice(-20);
  } catch (error) {
    return "Failed to get response, try again later.";
  }
};

// creditInit();
// messagesInit();

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

// -- Template -- //

// onMessage('get', (key) => {
//   return storage[key];
// });

// onMessage('set', ({ key, value }) => {
//   storage[key] = value;
// });

// Chat Button Position
onMessage("get-chat-button-position", () => {
  return chatButtonPosition.value;
});

onMessage("set-chat-button-position", (message) => {
  chatButtonPosition.value = {
    right: message.data?.right,
    bottom: message.data?.bottom,
  };
});

// Chat Button Position
onMessage("get-font-size", () => {
  return fontSize.value;
});

onMessage("set-font-size", (message) => {
  fontSize.value = message.data?.fontSize;
});

// Token
onMessage("get-token", () => {
  return token.value;
});

onMessage("set-token", (message) => {
  token.value = message.data?.token;
});

// Credit
onMessage("get-credits", () => {
  return credits.value;
});

onMessage("get-credits-api", async () => {
  let credits = await creditInit();
  return credits;
});

onMessage("set-credits", (message) => {
  credits.value = message.data?.credits;
});

// User id
onMessage("get-user-id", () => {
  return userId.value;
});

onMessage("set-user-id", (message) => {
  userId.value = message.data?.userId;
});

// Messages
onMessage("get-messages", () => {
  return messages.value;
});

onMessage("set-messages", (message) => {
  messages.value = message.data?.messages;
});

// Templates
onMessage("get-templates", () => {
  if (templates.value.length > 0) return templates.value;
  templatesInit();
  return templates.value;
});

onMessage("set-templates", (templates) => {
  templatesInit();
});
