import { Plugin } from "rollup";
import type { ApplyPatchOptions } from "diff";

export type RollupPluginApplyPatchOptions = {
  debug?: boolean;
};

export type DiffApplyPatchOptions = ApplyPatchOptions;

export type RollupPluginApplyPatchParams = {
  fileName: string;
  patch: string;
  pluginOptions?: RollupPluginApplyPatchOptions,
  diffOptions?: DiffApplyPatchOptions;
};

export function rollupPluginApplyPatch(params: RollupPluginApplyPatchParams): Plugin;
