# rollup-plugin-apply-patch

Rollup plugin which runs the `applyPatch` function from [`diff`](https://github.com/kpdecker/jsdiff) on a given file.

## Motivation

I need to modify some code I'm running with Vite, but don't want to actually make changes to the files, maintain a branch, etc.

## Installation

`npm i -D rollup-plugin-apply-patch`

## Usage

Check [the example app](./apps/example/) for a working example.

Otherwise, include the plugin in your Vite config like so (should work just fine for Rollup too):

```ts
// vite.config.ts

import { defineConfig } from "vite";
import { rollupPluginApplyPatch } from "rollup-plugin-apply-patch";
import path from "path";

export default defineConfig({
  plugins: [
    rollupPluginApplyPatch({
      fileName: path.join(__dirname, "./src/toPatch.ts").split(path.sep).join("/"),
      // on Linux, just do:
      // fileName: path.join(__dirname, "./src/toPatch.ts"),
      patch: `
@@ -1,2 +1,2 @@
 export function getOutputOfRollupPluginApplyPatch() {
-  return "rollup-plugin-apply-patch has not modified this code";
+  return "rollup-plugin-apply-patch has successfully applied changes to the \`toPatch.ts\` file.";
`,
    }),
  ],
});
```

The patch syntax is a less strict implementation of the [Unified Diff Format](https://www.gnu.org/software/diffutils/manual/html_node/Example-Unified.html). Anything supported by the `applyPatch` function from [`diff`](https://github.com/kpdecker/jsdiff) will work.

### Options

`fileName` - full file path for the file you're applying a patch to

`patch` - the unified diff patch being applied

`pluginOptions` - options specifically controlling the plugin
  - `debug` - enables logging and will re-apply patches with an increased `fuzzFactor` if they fail the first time

`diffOptions` - options controlling the `applyPatch` function, as described [here](https://github.com/kpdecker/jsdiff).

### Vite Usage

Rollup plugins in Vite are run after ESBuild has already transformed your files. This means your patch is not being applied to Typescript/JSX/TSX code, but to the already transformed Javascript. You must modify your patch to account for this.

Likewise if you are not using Vite, but have prior Rollup plugins which do similar transformations.

For example, if you have a Typescript file like so:

```ts
// apps/example/src/toPatch.ts

/**
 * We add some comments here to show that they need to be discarded when writing a patch.
 */

export function getOutputOfRollupPluginApplyPatch(): string {
  // I prefer double quotes but we use single quotes here to show that
  // the patch needs to account for which quote type is being outputted by ESBuild.
  // Also this comment will removed by ESBuild.
  return 'rollup-plugin-apply-patch has not modified this code';
}
```

You want to modify the string being returned to say `hello world`. You might expect to apply the following patch:

```ts
rollupPluginApplyPatch({
  fileName: path.join(__dirname, "./src/toPatch.ts"),
  patch: `
@@ -9,2 +9,2 @@
   // Also this comment will removed by ESBuild.
-  return 'rollup-plugin-apply-patch has not modified this code';
+  return 'hello world';
`,
    }),
```

But you must actually modify the patch to:

```ts
rollupPluginApplyPatch({
  fileName: path.join(__dirname, "./src/toPatch.ts"),
  patch: `
@@ -1,2 +1,2 @@
 export function getOutputOfRollupPluginApplyPatch() {
-  return "rollup-plugin-apply-patch has not modified this code";
+  return 'hello world';
`,
    }),
```

Take note of:
- the removal of the return type declaration from the `export function getOutputOfRollupPluginApplyPatch() {` line
- the use of double quotes instead of single quotes in the `return "rollup-plugin-apply-patch has not modified this code";` line
- the absence of comments
- the updated line numbers starting at line 1 rather than line 9

All of the above, and much more, is transformed by ESBuild before `rollup-plugin-apply-patch` has a chance to run.

If you're having trouble applying a patch, enable the `debug` switch which will print the transformed code whenever the plugin fails.

## License

MIT
