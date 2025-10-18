<template>
  <header class="bgGradient py-4">
    <div class="w-full max-w-[1300px] mx-auto px-5">
      <nav class="grid grid-cols-5 text-xs text-gray-100">
        <div class="hidden col-span-1 lg:block"></div>
        <div
          class="flex justify-start gap-x-6 col-span-5 lg:col-span-3 overflow-auto no-scrollbar"
        >
          <RouterLink
            v-for="item in subHeaderItem"
            :key="item.itemLabel"
            :to="item.link"
          >
            <AppButton btnClass="bg-secondary">
              <span class="text-xs">{{ item.itemLabel }}</span>
            </AppButton></RouterLink
          >
        </div>
        <div class="hidden col-span-1 lg:block"></div>
      </nav>
    </div>
  </header>
</template>

<script lang="ts">
import AppButton from "@/components/buttons/AppButton.vue";
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
export default {
  components: {
    AppButton,
  },
  setup() {
    const route = useRoute();
    const accountHeaderMenu = ref([
      { itemLabel: "Create New Account", link: "/account/createAccount" },
    ]);
    const transactionHeaderMenu = ref([
      { itemLabel: "Build Transaction", link: "/transaction/buildTransaction" },
      { itemLabel: "Sign Transaction", link: "/transaction/signTransaction" },
    ]);
    const cborHeaderMenu = ref([
      { itemLabel: "CBOR View", link: "/cbor/cborView" },
    ]);

    const subHeaderItem = computed(() => {
      if (route.path.startsWith("/transaction")) {
        return transactionHeaderMenu.value;
      } else if (route.path.startsWith("/account")) {
        return accountHeaderMenu.value;
      } else if (route.path.startsWith("/cbor")) {
        return cborHeaderMenu.value;
      } else {
        return [];
      }
    });

    return {
      route,
      subHeaderItem,
    };
  },
};
</script>
