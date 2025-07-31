<template>
  <div
    class="max-w-max h-9 rounded-md bg-primary/[0.2] pl-0.5 pr-2 py-0.5 border border-primary/[0.1] flex gap-x-2 items-center"
  >
    <div
      class="h-full min-w-12 max-w-max px-4 bg-white rounded-md flex justify-center items-center"
    >
      <span class="text-xs textColor flex break-all font-medium">{{
        policyId
      }}</span>
    </div>
    <div class="w-max flex items-center justify-between gap-x-4">
      <div class="flex gap-8">
        <span class="textColor1 text-sm break-all">{{ assetName }}</span>
        <span class="textColor1 text-sm font-LabMono">{{ amount }}</span>
      </div>
      <button @click="deleteToken()">
        <Close class="text-red-500 size-3.5" />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Close from "@/assets/icons/close.vue";

export default {
  components: { Close },
  props: {
    assetName: { type: String, required: true },
    policyId: { type: String, required: true },
    amount: { type: String, required: true },
    enableDelete: { type: Boolean, required: false, default: false },
  },
  emits: ["deleteToken"],
  setup(props, ctx) {
    function deleteToken() {
      ctx.emit("deleteToken");
    }

    return {
      deleteToken,
    };
  },
};
</script>
