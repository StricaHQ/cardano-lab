<template>
  <button
    @click="copyContent"
    class="w-6 h-6 rounded-md border-[0.5px] border-primary bg-blue-50 flex justify-center items-center shrink-0 hover:bg-blue-100"
  >
    <font-awesome-icon
      v-if="!isCopied"
      class="text-primary text-xs"
      :icon="['far', 'copy']"
    />
    <font-awesome-icon
      v-else
      class="text-green-500 text-xs"
      :icon="['fas', 'check']"
    />
  </button>
</template>

<script lang="ts">
import { useCopyContent } from "@/composables/copyContent";

export default {
  props: { content: { type: String, default: "", required: true } },
  setup(props) {
    const { copyToClipboard, isCopied } = useCopyContent();

    function copyContent() {
      copyToClipboard(props.content);
    }

    return {
      copyToClipboard,
      copyContent,
      isCopied,
    };
  },
};
</script>
