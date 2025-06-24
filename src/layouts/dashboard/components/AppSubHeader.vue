<template>
  <header class="bgGradient py-4">
    <div class="w-full max-w-[1300px] mx-auto px-5">
      <nav class="grid grid-cols-5 text-xs text-gray-100">
        <div class="hidden col-span-1 lg:block"></div>
        <div
          class="flex justify-start gap-x-4 col-span-5 lg:col-span-3 overflow-auto no-scrollbar"
        >
          <AppButton btnClass="btnColor">
            <span class="text-xs">Create New Account</span>
          </AppButton>
        </div>
        <div class="hidden col-span-1 lg:block"></div>
      </nav>
    </div>
  </header>
</template>

<script lang="ts">
import AppButton from "@/components/buttons/AppButton.vue";
export default {
  components: {
    AppButton,
  },
};
</script>

<style scoped>
.btnColor {
  @apply bg-[#1242B7];
}
</style>
