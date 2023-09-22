import { useStorageLocal } from "~/composables/useStorageLocal";

export const token = useStorageLocal("access_token", "");
export const messages = useStorageLocal("messages", []);
export const userId = useStorageLocal("user_id", "");
export const credits = useStorageLocal("credits", 10);
export const newCreditDate = useStorageLocal("new_credit_date", 0);
export const fontSize = useStorageLocal("font_size", 18);
export const templates = useStorageLocal("templates", "");
export const chatButtonPosition = useStorageLocal("chat_button_position", {
  right: 0,
  bottom: 40,
});

export const defaultTemplates = () => {
  return [
    {
      name: "Summarize",
      key: "summarize",
      used_description: "",
      icon: "",
      type: "selection",
      base_message: ["Summarize: "],
    },
    {
      name: "Respond",
      key: "respond",
      used_description: "",
      icon: "",
      type: "selection",
      base_message: ["Respond: "],
    },
    {
      name: "Simplify",
      key: "simplify",
      used_description: "",
      icon: "",
      type: "selection",
      base_message: ["Simplify: "],
    },
    {
      name: "Download Image",
      key: "",
      used_description: "",
      icon: "",
      type: "image",
      base_message: ["Download Image: "],
    },
    {
      name: "Resize Image",
      key: "",
      used_description: "",
      icon: "",
      type: "image",
      base_message: ["Resize Image: "],
    },
    {
      name: "Compress",
      key: "",
      used_description: "",
      icon: "",
      type: "image",
      base_message: ["Compress image: "],
    },
    {
      name: "Summarize page",
      key: "",
      used_description: "",
      icon: "",
      type: "action",
      base_message: ["summarize the current page: "],
    },
    {
      name: "Extract into a list",
      key: "",
      used_description: "",
      icon: "",
      type: "action",
      base_message: [],
    },
    {
      name: "Screenshot page",
      key: "",
      used_description: "",
      icon: "",
      type: "action",
      base_message: ["Take a screenshot of the current page"],
    },
  ];
};

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
