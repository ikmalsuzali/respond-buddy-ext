import { useStorageLocal } from "~/composables/useStorageLocal";

export const storageDemo = useStorageLocal("webext-demo", "Storage Demo");
export const token = useStorageLocal("access_token", "Token");
export const messages = useStorageLocal("messages", []);
export const userId = useStorageLocal("user_id", "");
