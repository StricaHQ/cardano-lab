<template>
  <div class="min-h-screen flex flex-col">
    <app-header />
    <app-sub-header />
    <div class="flex justify-center grow h-full">
      <div class="w-full max-w-[1024px] px-5">
        <div class="mt-16 mb-12">
          <router-view />
        </div>
      </div>
    </div>
    <app-footer />
  </div>
</template>

<script setup lang="ts">
import AppHeader from "./components/AppHeader.vue";
import AppSubHeader from "./components/AppSubHeader.vue";
import AppFooter from "./components/AppFooter.vue";
</script>
