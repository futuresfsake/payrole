import { defineConfig } from "@playwright/test";

/** Uses the installed Microsoft Edge so no browser download is needed. CI can switch the channel. */
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  reporter: "list",
  use: { baseURL: "http://127.0.0.1:3100", channel: process.env.PW_CHANNEL ?? "msedge" },
  webServer: {
    command: "npm run start",
    url: "http://127.0.0.1:3100/catalogue",
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    { name: "mobile-360", use: { viewport: { width: 360, height: 780 } } },
    { name: "desktop-1280", use: { viewport: { width: 1280, height: 900 } } },
  ],
});
