<template>
  <div :class="width">
    <Combobox v-model="selected">
      <div class="relative mt-1">
        <ComboboxLabel class="block text-sm font-medium leading-6 text-white">{{
          label
        }}</ComboboxLabel>
        <div
          :class="[
            'relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300',
            {
              'text-xs': size === 'small',
              'text-sm': size === 'medium',
              'text-base': size === 'large',
            },
          ]"
        >
          <ComboboxInput
            class="w-full bg-white border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
            :displayValue="displayValue"
            @change="query = $event.target.value"
          />
          <ComboboxButton
            class="absolute inset-y-0 right-0 flex items-center pr-2"
          >
            <ChevronUpDownIcon
              class="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </ComboboxButton>
        </div>
        <TransitionRoot
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          @after-leave="query = ''"
        >
          <ComboboxOptions
            class="mt-1 -translate-y-[calc(100%+50px)] max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
            <div
              v-if="filteredItems.length === 0 && query !== ''"
              class="relative cursor-default select-none py-2 px-4 text-gray-700"
            >
              Nothing found.
            </div>

            <ComboboxOption
              v-for="item in filteredItems"
              as="template"
              :key="item.id"
              :value="item"
              v-slot="{ selected, active }"
            >
              <li
                class="relative cursor-default select-none py-2 pl-10 pr-4"
                :class="{
                  'bg-teal-600 text-white': active,
                  'text-gray-900': !active,
                }"
              >
                <span
                  class="block truncate"
                  :class="{ 'font-medium': selected, 'font-normal': !selected }"
                >
                  {{ item[displayValueKey] }}
                </span>
                <span
                  v-if="selected"
                  class="absolute inset-y-0 left-0 flex items-center pl-3"
                  :class="{ 'text-white': active, 'text-teal-600': !active }"
                >
                  <CheckIcon class="h-5 w-5" aria-hidden="true" />
                </span>
              </li>
            </ComboboxOption>
          </ComboboxOptions>
        </TransitionRoot>
      </div>
    </Combobox>
  </div>
</template>

<script setup lang="ts">
import { withDefaults, defineEmits, ref, computed } from "vue";
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  ComboboxLabel,
  TransitionRoot,
} from "@headlessui/vue";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/vue/20/solid";

interface Item {
  id: number;
  [key: string]: any;
}

interface Props {
  items: Item[];
  label: string;
  displayValueKey: string;
  width?: string;
}

const props = withDefaults(defineProps<Props>(), {
  items: [{ id: 1, name: "Durward Reynolds" }],
  width: "w-72",
  displayValueKey: "name",
  size: "small",
  direction: "both",
});

defineEmits(["update:modelValue"]);

const selected = ref<Item>(props.items[0]);
const query = ref<string>("");

const filteredItems = computed<Item[]>(() =>
  query.value === ""
    ? props.items
    : props.items.filter((item) =>
        item[props.displayValueKey]
          .toLowerCase()
          .replace(/\s+/g, "")
          .includes(query.value.toLowerCase().replace(/\s+/g, ""))
      )
);

const displayValue = (item: Item) => item[props.displayValueKey];
</script>
