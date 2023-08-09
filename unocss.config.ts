import { defineConfig } from "unocss/vite";
import {
  presetAttributify,
  presetIcons,
  presetWind,
  transformerDirectives,
} from "unocss";

export default defineConfig({
  presets: [presetWind(), presetAttributify(), presetIcons()],
  transformers: [transformerDirectives()],
});
