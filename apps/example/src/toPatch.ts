/**
 * We add some comments here to show that they need to be discarded when writing a patch.
 */

export function getOutputOfRollupPluginApplyPatch(): string {
  // I prefer double quotes but we use single quotes here to show that
  // the patch needs to account for which quote type is being outputted by ESBuild.
  // Also this comment will removed by ESBuild.
  return 'rollup-plugin-apply-patch has not modified this code';
}
