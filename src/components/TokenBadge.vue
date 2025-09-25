<template>
  <div
    class="max-w-max h-9 rounded-md bg-primary/[0.2] pl-0.5 py-0.5 border border-primary/[0.1] flex items-center"
  >
    <div
      class="h-full min-w-12 max-w-max px-4 bg-white rounded-l-md flex justify-center items-center"
    >
      <span class="text-xs textColor flex break-all font-medium">{{
        policyId
      }}</span>
    </div>
    <div
      class="h-full min-w-12 max-w-max px-4 bg-gray-200 rounded-r-md flex justify-center items-center"
    >
      <span class="text-xs textColor flex break-all font-medium">{{
        assetName
      }}</span>
    </div>
    <div class="w-max flex items-center justify-between gap-x-4 px-4">
      <span class="textColor1 text-sm font-LabMono">{{ amount }}</span>

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
