import { resolve } from "path";
import react from "@vitejs/plugin-react";
import dts from "unplugin-dts/vite";
import { defineConfig, UserConfig as UserConfigVite } from "vite";
import { UserConfig as InlineConfigVitest } from "vitest/config";
import pkg from "./package.json" with { type: "json" };

type UserConfig = UserConfigVite & {
  test: InlineConfigVitest["test"];
};

const config: UserConfig = {
  build: {
    lib: {
      entry: resolve(import.meta.dirname, "src/main.ts"),
      fileName: "[name]",
      name: pkg.name,
    },
    rolldownOptions: {
      external: [...Object.keys(pkg.dependencies), ...Object.keys(pkg.peerDependencies), "react/jsx-runtime", "react/jsx-dev-runtime"],
      output: {
        globals: {
          "@getsoren/react-utils": "reactUtils",
          react: "React",
        },
      },
    },
  },
  plugins: [dts(), react()],
  publicDir: false,
  resolve: {
    alias: [
      { find: "@", replacement: resolve(import.meta.dirname, "src") },
      { find: "~", replacement: resolve(import.meta.dirname) },
    ],
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "/test.config.ts",
  },
};


export default defineConfig(config);
