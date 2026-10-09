import { withRsbuildConfig } from "@rstest/adapter-rsbuild";
import { defineConfig } from "@rstest/core";

export default defineConfig({
  extends: withRsbuildConfig(),
  testEnvironment: "happy-dom",
  setupFiles: ["./rstest.setup.ts"],
  include: ["src/**/*.test.{ts,tsx}"],
  exclude: ["**/node_modules/**", "src/**/*.live.test.ts"],
});
