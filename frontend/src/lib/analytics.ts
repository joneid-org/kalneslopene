import type { ConfigDTO } from "@/model/DTO.ts";

let initialized = false;

export function initAnalytics(config: ConfigDTO) {
  if (initialized || !config.umamiScriptUrl || !config.umamiWebsiteId) return;
  initialized = true;

  const script = document.createElement("script");
  script.defer = true;
  script.src = config.umamiScriptUrl;
  script.dataset.websiteId = config.umamiWebsiteId;
  document.head.appendChild(script);
}
