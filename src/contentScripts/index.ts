/* eslint-disable no-console */
import { onMessage, sendMessage } from "webext-bridge/content-script";
import { createApp } from "vue";
import App from "./views/App.vue";
import { setupApp } from "~/logic/common-setup";

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
(() => {
  let url = "https://respond-buddy-web.vercel.app";

  console.log(window.location);
  console.log(localStorage?.getItem("accessToken"));
  if (
    window.location.href.includes(url) &&
    localStorage.getItem("accessToken")
  ) {
    sendMessage("get-access-token", {
      accessToken: JSON.parse(localStorage?.getItem("accessToken") || ""),
    });
    return localStorage?.getItem("accessToken");
  }
  // communication example: send previous tab title from background page

  // mount component to context window

  const container = document.createElement("div");
  container.id = __NAME__;
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
  document.body.appendChild(container);
  const app = createApp(App);
  setupApp(app);
  app.mount(root);
})();
