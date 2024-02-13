import * as diff from "diff";

const name = "rollup-plugin-apply-patch";

/**
 * @type {import("./rollup-plugin-apply-patch.d.ts").rollupPluginApplyPatch}
 */
export function rollupPluginApplyPatch({
  fileName,
  patch,
  pluginOptions,
  diffOptions
}) {
  return {
    name,
    transform(code, id) {
      if (id !== fileName)
        return;

      const diffOpts = diffOptions ?? {};
      const pluginOpts = pluginOptions ?? {};
      const patched = diff.applyPatch(code, patch, diffOpts);

      if (patched === false) {
        if (pluginOpts.debug) {
          console.log(`[${name}] failing to patch "${fileName}". The code printed below, between the ====== lines, is the output after being transformed by any previous plugins:`);
          console.log("==========================================");
          console.log(code);
          console.log("==========================================");

          const fuzzFactor = diffOpts.fuzzFactor ?? 0;

          /**
           * @param {number} fuzz
           * @returns {string}
           */
          const increaseFuzzMessage = fuzz => {
            const itMeansYourPatchIsIncorrectBy = `It means your patch is incorrect by ${fuzzFactor + fuzz} ${fuzzFactor + fuzz === 1 ? "line" : "lines"}${fuzzFactor === 0 ? "" : ` (your original fuzzFactor + ${fuzz})`}`
            return `[${name}] the patch would apply if the fuzzFactor were increased by ${fuzz}. This doesn't mean you should increase the fuzzFactor. ${itMeansYourPatchIsIncorrectBy}. Compare the code printed above to what your patch is expecting.`;
          }

          if (diff.applyPatch(code, patch, { ...diffOpts, fuzzFactor: fuzzFactor + 1 }))
            console.log(increaseFuzzMessage(1));
          else if (diff.applyPatch(code, patch, { ...diffOpts, fuzzFactor: fuzzFactor + 2 }))
            console.log(increaseFuzzMessage(2));
          else if (diff.applyPatch(code, patch, { ...diffOpts, fuzzFactor: fuzzFactor + 3 }))
            console.log(increaseFuzzMessage(3));
          else
            console.log(`[${name}] increasing the fuzzFactor does not appear to fix your patch. Are you patching the right file?`);
        }

        throw new Error(`[${name}] failed to patch "${fileName}".`);
      }

      if (pluginOpts.debug)
        console.log(`[${name}] patched "${fileName}".`);

      return {
        code: patched,
      };
    },
  };
};
