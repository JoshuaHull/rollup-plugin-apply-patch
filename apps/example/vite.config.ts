import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { rollupPluginApplyPatch } from "rollup-plugin-apply-patch";
import path from "path";

export default defineConfig({
  plugins: [
    vue(),
    rollupPluginApplyPatch({
      fileName: path.join(__dirname, "./src/toPatch.ts").split(path.sep).join("/"),
      pluginOptions: {
        debug: true,
      },
      diffOptions: {
      },
      patch: `
@@ -1,2 +1,2 @@
 export function getOutputOfRollupPluginApplyPatch() {
-  return "rollup-plugin-apply-patch has not modified this code";
+  return "rollup-plugin-apply-patch has successfully applied changes to the \`toPatch.ts\` file.";
`,
    }),
  ],
});
