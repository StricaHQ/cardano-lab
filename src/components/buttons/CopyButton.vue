<template>
  <button
    @click="copyContent"
    class="w-6 h-6 rounded-md border-[0.5px] border-primary bg-blue-50 flex justify-center items-center shrink-0 hover:bg-blue-100"
  >
    <Copy v-if="!isCopied" class="text-primary size-4" />
    <Check v-else class="text-green-500 size-4" />
  </button>
</template>

<script lang="ts">
import Check from "@/assets/icons/check.vue";
import Copy from "@/assets/icons/copy.vue";
import { useCopyContent } from "@/composables/copyContent";

export default {
  components: { Copy, Check },
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
