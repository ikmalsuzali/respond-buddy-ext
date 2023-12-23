<template>
  <div
    class="flex-grow flex overflow-y-auto w-11/12"
    style="height: calc(100vh - 150px)"
  >
    <div class="mt-12 pb-20 px-6 space-y-3 overflow-y-auto w-full">
      <div>
        <div class="flex my-4">
          <div class="font-bold text-xl w-full text-center">
            RespondBuddy Prompts
          </div>
        </div>
        <div>
          <div class="flex gap-2 place-content-center">
            <input
              v-model="promptSearch"
              type="text"
              name="name"
              id="name"
              class="block rounded-lg border-0 px-4 py-1.5 text-slate-200 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-slate-200 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 bg-transparent"
              placeholder="Search for prompt"
            />
            <Menu as="div" class="relative inline-block text-left">
              <div>
                <MenuButton
                  class="inline-flex w-full justify-center gap-x-1.5 rounded-lg bg-transparent px-2 py-2 text-sm text-slate-100 shadow-sm ring-1 ring-inset ring-gray-500 hover:bg-transparent"
                >
                  {{
                    sortByMenuItems.find(
                      (item) => item.key === promptsRequestData.sort_by
                    )?.name || "Sort By"
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
                        >{{ item?.name }}</a
                      >
                    </MenuItem>
                  </div>
                </MenuItems>
              </transition>
            </Menu>
            <Menu as="div" class="relative inline-block text-left">
              <div>
                <MenuButton
                  class="inline-flex w-full justify-center gap-x-1.5 rounded-lg bg-transparent px-2 py-2 text-sm text-slate-100 shadow-sm ring-1 ring-inset ring-gray-500 hover:bg-transparent"
                >
                  {{ currentCategoryItem?.name }}
                  <ChevronDownIcon
                    v-if="currentCategoryItem?.key === ''"
                    class="-mr-1 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <XMarkIcon
                    v-else
                    class="-mr-1 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                    @click.stop="onFilterCategoryItem(categoryItems[0])"
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
        </div>
      </div>

      <div class="flex flex-wrap gap-4 place-content-center">
        <div
          v-if="isPromptsLoading"
          class="w-full flex flex-wrap gap-4 justify-between"
        >
          <div
            v-for="_ in 9"
            class="min-w-[300px] max-w-[350px] mx-auto overflow-hidden rounded-lg shadow-lg animate-pulse bg-slate-300"
          >
            <div class="w-full p-4 md:p-4">
              <h1 class="w-40 h-2 bg-gray-200 rounded-lg"></h1>

              <p class="w-48 h-2 mt-4 bg-gray-200 rounded-lg"></p>

              <div class="flex mt-4 item-center gap-x-2">
                <p class="w-5 h-2 bg-gray-200 rounded-lg"></p>
                <p class="w-5 h-2 bg-gray-200 rounded-lg"></p>
                <p class="w-5 h-2 bg-gray-200 rounded-lg"></p>
                <p class="w-5 h-2 bg-gray-200 rounded-lg"></p>
                <p class="w-5 h-2 bg-gray-200 rounded-lg"></p>
              </div>

              <div class="flex justify-between mt-6 item-center">
                <h1 class="w-10 h-2 bg-gray-200 rounded-lg"></h1>

                <div class="h-4 bg-gray-200 rounded-lg w-28"></div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-else
          class="cursor-pointer flex-grow w-full min-w-[300px] max-w-[350px] h-[125px]"
          v-for="prompt in promptsResponseData.prompts"
        >
          <!-- Prompt Card -->
          <div
            class="prompt-card rounded-xl border-gray-500 border-[0.5px] h-full hover:bg-slate-900 hover:bg-opacity-30"
            @click="onPromptClick(prompt)"
          >
            <div
              class="rounded-xl flex items-center justify-between px-4 py-2 h-full"
            >
              <div
                class="flex items-center space-x-2 dark:text-gray-200 light:text-gray-800 h-full"
              >
                <div class="flex flex-col h-full justify-between">
                  <div>
                    <h2 class="text-lg">{{ prompt?.name }}</h2>
                    <div
                      class="text-sm font-light text-gray-400 space-x-2 line-clamp-3 leading-5"
                    >
                      {{
                        prompt?.used_description ||
                        "The sun dipped below the horizon, casting a warm, golden glow across the tranquil lake. The gentle ripples on the water's surface mirrored the fading colors of the sky, creating a breathtaking panorama. As the stars began to emerge one by one, the world around me grew quiet, and I couldn't help but feel a sense of peace and wonder. Nature's beauty never ceased to amaze, reminding me of the simple joys that life has to offer"
                      }}
                    </div>
                  </div>

                  <div class="flex text-sm font-light text-gray-400 space-x-2">
                    <p class="text-gray-200 font-semibold">
                      {{ prompt?.tag_categories?.name || "" }}
                    </p>

                    <div class="flex gap-1">
                      <ChartBarIcon class="w-5 hover:fill-grey-200" />
                      <span class="pt-0.5">
                        {{ prompt?.usage_count || 0 }}
                      </span>
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
                      {{
                        (prompt?.user_has_liked === true ? 1 : 0) +
                          prompt?.tag_liked_count || 0
                      }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex text-center text-md gap-8 justify-center">
        <div
          class="inline-flex gap-x-1.5 cursor-pointer"
          @click="onPreviousPageClick"
        >
          <ChevronLeftIcon
            class="-mr-1 h-4 w-4 text-gray-300 self-center"
            aria-hidden="true"
            :class="{
              'cursor-not-allowed text-gray-300': promptsResponseData.page == 1,
            }"
            @click="onPreviousPageClick"
          />
          <div class="text-md">Previous</div>
        </div>
        <!-- Get current records -->

        <div class="text-md">
          {{
            `${getCurrentAmount(
              promptsResponseData.page,
              promptsResponseData.limit
            )} / ${promptsResponseData.total} prompts`
          }}
        </div>
        <div
          class="inline-flex gap-x-1.5 cursor-pointer"
          @click="onNextPageClick"
        >
          <div class="text-md">Next</div>
          <ChevronRightIcon
            class="-mr-1 h-4 w-4 text-gray-300 self-center"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDebounce } from "@vueuse/core";
import { sendMessage } from "webext-bridge/content-script";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/vue/24/solid";
import {
  HeartIcon as HeartOutlineIcon,
  ChartBarIcon,
} from "@heroicons/vue/24/outline";

const promptSearch = ref("");
const isPromptsLoading = ref(true);
const debouncedPromptQuery = useDebounce(promptSearch, 300);

const categoryItems: any[] = [
  {
    name: "Use case",
    current: false,
    key: "",
  },
];
const promptCategoriesData: Ref<any[]> = ref([]);

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

const promptsRequestData = ref({
  search: "",
  category: "",
  sort_by: "top_usage",
  page: 1,
  limit: 10,
});

const promptsResponseData = ref({
  prompts: [],
  limit: 10,
  page: 1,
  total: 0,
  totalPages: 2,
});

const selectedPrompt = ref({
  key: "",
  name: "",
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

const fetchTemplates = async (templateData = {}) => {
  console.log(
    "🚀 ~ file: PromptListing.vue:304 ~ fetchTemplates ~ templateData:",
    templateData
  );
  isPromptsLoading.value = true;
  const data = await sendMessage("get-templates-api", templateData);
  console.log("🚀 ~ file: App.vue:794 ~ fetchTemplates ~ data:", data);

  promptsResponseData.value = {
    prompts: data?.data || [],
    limit: data?.limit || 50,
    page: data?.page || 1,
    total: data?.total || 0,
    totalPages: data?.total_pages || 2,
  };

  isPromptsLoading.value = false;
};

const onSortByMenuItemClick = (item: any) => {
  promptsRequestData.value = {
    ...promptsRequestData.value,
    sort_by: item.key,
  };
};

const fetchTemplateCategories = async (name: string = "") => {
  const data = await sendMessage("fetch-template-categories-api", name);
  promptCategoriesData.value = data || [];
};

const currentCategoryItem = ref(categoryItems[0]);

const onFilterCategoryItem = (item: any) => {
  currentCategoryItem.value = item;
  promptsRequestData.value = {
    ...promptsRequestData.value,
    category: item.id,
  };
};

const onPromptClick = (prompt: any) => {
  selectedPrompt.value = {
    key: prompt.key,
    name: prompt.name,
  };

  console.log(
    "🚀 ~ file: PromptListing.vue:388 ~ onPromptClick ~ selectedPrompt:",
    selectedPrompt
  );

  sendMessage("set-selected-prompt", {
    key: prompt.key,
    name: prompt.name,
  });
};

const onHeartClick = (prompt: any) => {
  prompt.user_has_liked = !prompt.user_has_liked;

  sendMessage("set-liked-prompt", {
    id: prompt.id,
    isLiked: prompt.user_has_liked,
  });
};

const getCurrentAmount = (page: number, limit: number) => {
  const startIndex = (page - 1) * limit;
  const count = startIndex + promptsResponseData.value.prompts.length;
  // const endIndex = startIndex + limit;
  // const currentPrompts = promptsData.value.prompts.slice(startIndex, endIndex);
  return count;
};

const onNextPageClick = () => {
  if (
    getCurrentAmount(
      promptsRequestData.value.page,
      promptsRequestData.value.limit
    ) === promptsResponseData.value.total
  )
    return;

  if (promptsRequestData.value.page < promptsResponseData.value.totalPages) {
    promptsRequestData.value = {
      ...promptsRequestData.value,
      page: promptsRequestData.value.page + 1,
    };
  }
};

const onPreviousPageClick = () => {
  if (promptsRequestData.value.page > 1) {
    promptsRequestData.value = {
      ...promptsRequestData.value,
      page: promptsRequestData.value.page - 1,
    };
  }
};

onMounted(() => {
  fetchTemplates(promptsRequestData.value);
  fetchTemplateCategories();
});
</script>
