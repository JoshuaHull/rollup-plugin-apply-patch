<template>
<main>
  This is the output after <code>rollup-plugin-apply-patch</code> has run:<br/>
  <code>{{patched}}</code>
</main>
</template>

<script setup lang="ts">
import { getOutputOfRollupPluginApplyPatch } from "./toPatch";

const patched = getOutputOfRollupPluginApplyPatch();
</script>

<style scoped>
</style>
