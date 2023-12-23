import { ref, onMounted, onUnmounted, watchEffect } from "vue";
import { onMessage } from "webext-bridge/content-script";

const useUrlWatcher = () => {
  // watch window.location.href changes
  const url = ref(window.location.href);

  onMessage("url-changed", (message) => {
    console.log(
      "🚀 ~ file: useUrlWatcher.ts:15 ~ onMessage ~ message:",
      message
    );
    url.value = message?.data?.url;
  });

  // Optionally, return any data or methods that should be exposed to the component
  return {
    url,
  };
};

export default useUrlWatcher;
