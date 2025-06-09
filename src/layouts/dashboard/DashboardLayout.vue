<template>
  <app-header />
  <app-sub-header />
  <div class="flex justify-center">
    <div class="w-full max-w-[1024px] px-5">
      <div class="mt-16 mb-12">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from "./components/AppHeader.vue";
import AppSubHeader from "./components/AppSubHeader.vue";
</script>
