<template>
  <div
    v-if="openDialog"
    id="dialogContainer"
    class="fixed top-0 right-0 left-0 bottom-0 z-50"
  >
    <div
      class="relative flex items-center justify-center h-screen bg-cover bg-center bg-no-repeat bg-fixed"
    >
      <div
        class="absolute inset-0 bg-gray-800/40 backdrop-blur-[0.5px]"
        @click="closeDialog()"
      ></div>
      <div
        id="dialogBox"
        class="relative z-10 p-4 cardBackgroundColor1 rounded-xl w-full overflow-scroll no-scrollbar max-h-max"
        :class="dialogWidth"
      >
        <div class="flex justify-center w-full mb-2 relative">
          <div class="text-center w-full font-semibold textColo1">
            <header><slot name="header"></slot></header>
          </div>
          <div v-if="showCloseButton">
            <button
              type="button"
              class="textColor1 hover:bg-[#D7D7F4] p-1 rounded-full focus:outline-none absolute right-0"
              @click="closeDialog()"
            >
              <Close class="h-4" />
            </button>
          </div>
        </div>
        <div><slot name="body"></slot></div>
        <div><slot name="footer"></slot></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Close from "@/assets/icons/close.vue";
import { computed, defineComponent } from "vue";

export default defineComponent({
  components: { Close },
  props: {
    openDialog: { required: true, default: false, type: Boolean },
    dialogSize: { type: String, default: "maxContent", required: false },
    showCloseButton: { type: Boolean, default: true, required: false },
  },
  emits: ["closeDialog"],
  setup(props, { emit }) {
    const dialogWidth = computed(() => {
      switch (props.dialogSize) {
        case "xs":
          return "max-w-xs";
        case "sm":
          return "max-w-sm";
        case "md":
          return "max-w-md";
        case "lg":
          return "max-w-lg";
        case "2xl":
          return "max-w-2xl";
        case "4xl":
          return "max-w-4xl";
        case "6xl":
          return "max-w-6xl";
        case "7xl":
          return "max-w-7xl";
        case "full":
          return "max-w-full";
        case "maxContent":
          return "max-w-max";
        default:
          return "max-w-md";
      }
    });

    const closeDialog = () => {
      emit("closeDialog");
    };

    return { dialogWidth, closeDialog };
  },
});
</script>
