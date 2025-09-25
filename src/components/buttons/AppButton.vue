<template>
  <button
    class="rounded-[3px] hover:opacity-90 duration-300 transition-all ease-in-out flex items-center justify-center disabled:opacity-70 disabled:brightness-75"
    :class="finalClass"
    @click="onClick"
    :disabled="isDisabled"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import { computed } from "vue";

export default {
  props: {
    btnClass: { type: String, default: "", required: true },
    size: {
      type: String as () => "xs" | "sm" | "md" | "lg",
      default: "md",
    },
    isDisabled: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  emits: ["onClick"],
  setup(props, ctx) {
    const btnSizeClass = computed(() => {
      const sizeMap: Record<string, string> = {
        xs: "max-w-max px-2 py-2",
        sm: "min-w-24 px-5 py-2 ",
        md: "min-w-32 px-5 py-2 ",
        lg: "min-w-44 px-8 py-2 ",
      };
      return sizeMap[props.size] || sizeMap["md"];
    });

    const finalClass = computed(() => {
      return `${btnSizeClass.value} ${props.btnClass}`;
    });

    function onClick() {
      ctx.emit("onClick");
    }

    return {
      onClick,
      btnSizeClass,
      finalClass,
    };
  },
};
</script>
