<template>
  <div class="flex-grow flex overflow-y-auto">
    <div class="flex-grow">
      <div class="w-[300px]">
        <div
          v-if="showPromptListButton"
          :key="componentRenderingCount"
          class="inline-flex w-[170px] justify-center gap-x-1.5 rounded-lg bg-transparent px-2 py-2 text-sm text-slate-100 shadow-sm ring-1 ring-inset ring-gray-500 hover:bg-slate-700 cursor-pointer"
          @click.stop="onPromptListButtonClick"
        >
          <div class="flex-grow px-1">Prompt List</div>
          <QueueListIcon
            class="mr-1 h-5 w-5 text-gray-400 ml-auto"
            aria-hidden="true"
          />
        </div>
        <div
          v-else-if="selectedPrompt?.key"
          class="inline-flex w-full justify-center gap-x-1.5 rounded-lg bg-transparent px-2 py-2 text-sm text-slate-100 shadow-sm ring-1 ring-inset ring-gray-500 hover:bg-transparent"
        >
          <div class="flex-grow px-1">
            {{ selectedPrompt.name }}
          </div>
          <XMarkIcon
            class="-mr-1 h-5 w-5 text-gray-400 ml-auto"
            aria-hidden="true"
            @click.stop="clearSelectedPrompt"
          />
        </div>
      </div>
    </div>
    <div class="space-y-3 overflow-y-auto">
      <div>
        <div>
          <div class="flex gap-2 place-content-center">
            <Menu as="div" class="relative inline-block text-left">
              <div>
                <MenuButton
                  class="inline-flex w-full justify-center gap-x-1.5 rounded-lg bg-transparent px-2 py-2 text-sm text-slate-100 shadow-sm ring-1 ring-inset ring-gray-500 hover:bg-transparent hover:bg-slate-700 cursor-pointer"
                >
                  {{ currentToneMenuItem?.name || "Tone" }}
                  <ChevronDownIcon
                    v-if="currentToneMenuItem?.key === ''"
                    class="-mr-1 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <XMarkIcon
                    v-else
                    class="-mr-1 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                    @click.stop="setCurrentToneMenuItem({ key: '', name: '' })"
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
                  class="fixed inset-auto bottom-[140px] z-10 mt-2 w-56 max-h-52 overflow-auto origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <div class="py-1">
                    <MenuItem v-for="item in toneMenuItems" v-slot="{ active }">
                      <a
                        href="#"
                        :class="[
                          active
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700',
                          'block px-4 py-2 text-sm',
                        ]"
                        @click="setCurrentToneMenuItem(item)"
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
                  class="inline-flex w-full justify-center gap-x-1.5 rounded-lg bg-transparent px-2 py-2 text-sm text-slate-100 shadow-sm ring-1 ring-inset ring-gray-500 hover:bg-transparent hover:bg-slate-700 cursor-pointer"
                >
                  {{ currentWritingStyleMenuItem?.name || "Writing style" }}
                  <ChevronDownIcon
                    v-if="currentWritingStyleMenuItem?.key === ''"
                    class="-mr-1 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <XMarkIcon
                    v-else
                    class="-mr-1 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                    @click.stop="
                      setCurrentWritingStyleMenuItem({ key: '', name: '' })
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
                  class="fixed inset-auto bottom-[140px] z-10 mt-2 w-56 max-h-52 overflow-auto origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <div class="py-1">
                    <MenuItem
                      v-for="item in writingStyleMenuItems"
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
                        @click="setCurrentWritingStyleMenuItem(item)"
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
                  class="inline-flex w-full justify-center gap-x-1.5 rounded-lg bg-transparent px-2 py-2 text-sm text-slate-100 shadow-sm ring-1 ring-inset ring-gray-500 hover:bg-transparent hover:bg-slate-700 cursor-pointer"
                >
                  {{ currentLanguageMenuItem?.name || "Language" }}
                  <ChevronDownIcon
                    v-if="currentLanguageMenuItem?.key === ''"
                    class="-mr-1 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <XMarkIcon
                    v-else
                    class="-mr-1 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                    @click.stop="
                      setCurrentLanguageMenuItem({ key: '', name: '' })
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
                  class="fixed inset-auto bottom-[140px] z-10 mt-2 w-56 max-h-52 overflow-auto origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <div class="py-1">
                    <MenuItem
                      v-for="item in languageMenuItems"
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
                        @click="setCurrentLanguageMenuItem(item)"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { sendMessage, onMessage } from "webext-bridge/content-script";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { XMarkIcon } from "@heroicons/vue/24/solid";
import { ChevronDownIcon, QueueListIcon } from "@heroicons/vue/24/solid";

const currentUrl = ref("");
const componentRenderingCount = ref(0);
const selectedPrompt = ref({
  key: null,
  name: null,
});

const showPromptListButton = ref(true);

const toneMenuItems: any = ref([]);

const currentToneMenuItem = ref({});

const writingStyleMenuItems: any = ref([]);

const currentWritingStyleMenuItem = ref({});

const languageMenuItems: any = ref([]);

const currentLanguageMenuItem = ref({});

const fetchTemplateLanguages = async (name: string = "") => {
  const data = await sendMessage("fetch-template-languages", name);
  languageMenuItems.value = data || [];
};

const fetchTemplateTones = async (name: string = "") => {
  const data = await sendMessage("fetch-template-tones", name);
  toneMenuItems.value = data || [];
};

const fetchTemplateWritingStyles = async (name: string = "") => {
  const data = await sendMessage("fetch-template-writing-styles", name);
  writingStyleMenuItems.value = data || [];
};

const setCurrentToneMenuItem = async (item: any) => {
  currentToneMenuItem.value = item;
  await sendMessage("set-template-tone", item);
};

const setCurrentWritingStyleMenuItem = async (item: any) => {
  currentWritingStyleMenuItem.value = item;
  await sendMessage("set-template-writing-style", item);
};

const setCurrentLanguageMenuItem = async (item: any) => {
  currentLanguageMenuItem.value = item;
  await sendMessage("set-template-language", item);
};

const clearSelectedPrompt = async () => {
  selectedPrompt.value = {
    key: null,
    name: null,
  };

  await sendMessage("set-selected-prompt", {
    id: null,
    key: null,
    name: null,
    aiTemplate: null,
  });
};

// Reason appending `2` to the event name is because the event name is already used in `useHtmlEmbedding.vue`
onMessage("set-selected-prompt-2", (data) => {
  selectedPrompt.value = {
    id: data.data?.selectedPrompt?.id || null,
    key: data.data?.selectedPrompt?.key || null,
    name: data.data?.selectedPrompt?.name || null,
  };
});

onMounted(async () => {
  fetchTemplateLanguages();
  fetchTemplateTones();
  fetchTemplateWritingStyles();
  componentRenderingCount.value += 1;

  const data = await sendMessage("get-current-url", null);
  checkPromptListButton(data);
});

const onPromptListButtonClick = async () => {
  window.location.replace("https://chat.openai.com/");
};

onMessage("url-changed-2", (message) => {
  checkPromptListButton(message.data?.url);
});

const checkPromptListButton = (url: string) => {
  if (url.includes("chat.openai.com/c/")) {
    showPromptListButton.value = true;
  } else {
    showPromptListButton.value = false;
  }
};
</script>
