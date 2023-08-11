import type { ProtocolWithReturn } from "webext-bridge";

declare module "webext-bridge" {
  export interface ProtocolMap {
    // define message protocol types
    // see https://github.com/antfu/webext-bridge#type-safe-protocols
    "get-access-token": { accessToken: string | null };
    "get-current-tab": ProtocolWithReturn<
      { tabId: number },
      { title?: string }
    >;
  }
}
