<template>
  <div
    class="max-w-max h-9 rounded-md bg-primary/[0.2] pl-0.5 pr-2 py-0.5 border border-primary/[0.1] flex gap-x-2 items-center"
  >
    <div
      class="h-full min-w-12 max-w-max px-5 bg-white rounded-md flex justify-center items-center"
    >
      <span class="text-xs textColor font-medium">{{ tokenName }}</span>
    </div>
    <div class="w-full flex items-center justify-between gap-x-8">
      <div>
        <span class="textColor1 text-sm font-LabMono">{{ tokenAmount }}</span>
      </div>
      <button v-if="enableDelete" @click="deleteToken">
        <font-awesome-icon
          class="text-red-400 text-sm"
          :icon="['fas', 'xmark']"
        />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    tokenName: { type: String, required: true },
    tokenAmount: { type: String, required: true },
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
