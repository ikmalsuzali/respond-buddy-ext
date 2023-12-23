import { useStorageLocal } from "~/composables/useStorageLocal";

export const token = useStorageLocal("access_token", "");
export const messages = useStorageLocal("messages", []);
export const userId = useStorageLocal("user_id", "");
export const credits = useStorageLocal("credits", 10);
export const newCreditDate = useStorageLocal("new_credit_date", 0);
export const fontSize = useStorageLocal("font_size", 18);
export const templates = useStorageLocal("templates", []);
export const templateLanguages = useStorageLocal("template-languages", []);
export const templateCategories = useStorageLocal("template-categories", []);
export const templateTones = useStorageLocal("template-tones", []);
export const templateWritingStyles = useStorageLocal(
  "template-writing-styles",
  []
);
export const prompts = useStorageLocal("prompts", []);
export const chatButtonPosition = useStorageLocal("chat_button_position", {
  right: 0,
  bottom: 40,
});

// model tags {
//   id               String        @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
//   created_at       DateTime?     @default(now()) @db.Timestamptz(6)
//   name             String?       @db.VarChar
//   workspace        String?       @db.Uuid
//   is_system_tag    Boolean?      @default(true)
//   used_description String?       @default("") @db.VarChar
//   ai_template      String?       @db.VarChar
//   key              String?       @db.VarChar
//   command_type     String?       @db.VarChar
//   function         String?       @db.VarChar
//   base_message     Json?         @default("[]")
//   workspaces       workspaces?   @relation(fields: [workspace], references: [id], onDelete: NoAction, onUpdate: NoAction)
//   rule_tags        rule_tags[]
//   store_tags       store_tags[]
//   tag_aliases      tag_aliases[]
// }
