import { useStorageLocal } from "~/composables/useStorageLocal";

export const token = useStorageLocal("access_token", "");
export const messages = useStorageLocal("messages", []);
export const userId = useStorageLocal("user_id", "");
export const credits = useStorageLocal("credits", 10);
export const newCreditDate = useStorageLocal("new_credit_date", 0);
export const fontSize = useStorageLocal("font_size", 15);
export const chatButtonPosition = useStorageLocal("chat_button_position", {
  right: 0,
  bottom: 40,
});
