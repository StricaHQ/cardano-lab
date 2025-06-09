<template>
  <div class="text-gray-800 w-full max-w-[1300px] mx-auto px-5">
    <header class="grid grid-cols-2 md:grid-cols-5 items-center py-2">
      <div class="text-xl font-semibold col-span-1">Cardano Lab</div>
      <div class="hidden md:block col-span-3">
        <nav class="flex justify-center gap-x-10 text-sm">
          <button
            v-for="item in menuItems"
            :key="item"
            @click="navigateMenu(item)"
            class="relative"
          >
            <span
              :class="activeLink === item ? 'font-semibold' : 'font-medium'"
              class="text-gray-800"
            >
              {{ item }}
            </span>
            <div
              :class="activeLink === item ? 'bg-primary' : 'bg-transparent'"
              class="w-5 h-5 rounded-full absolute -bottom-7 inset-x-0 m-auto"
            ></div>
          </button>
          <!-- <button class="font-semibold relative">
            <span> Transaction </span>
            <div
              class="w-5 h-5 rounded-full bg-transparent absolute -bottom-7 inset-x-0 m-auto"
            ></div>
          </button>
          <button class="font-semibold relative">
            <span>Cbor View </span>
            <div
              class="w-5 h-5 rounded-full bg-transparent absolute -bottom-7 inset-x-0 m-auto"
            ></div>
          </button> -->
        </nav>
      </div>
      <div class="hidden md:block">
        <div class="col-span-1 flex justify-end">
          <button
            class="text-sm border border-primary hover:bg-blue-50 hover:text-primary rounded-sm px-4 py-1 duration-200 transition-all ease-in-out"
          >
            Preprod
          </button>
        </div>
      </div>
      <!-- mobile view -->
      <div class="col-span-1 flex justify-end md:hidden">
        <button @click="openMenu">
          <font-awesome-icon
            class="text-primary text-xl"
            :icon="['fas', 'bars']"
          />
        </button>
        <div
          v-if="isOpenMenu"
          class="w-[200px] bg-white border border-gray-200 shadow-sm shadow-gray-300 absolute top-8 rounded-md py-4 px-2"
        >
          <div class="flex flex-col items-start gap-y-0.5 text-sm w-full">
            <button
              class="w-full px-5 flex items-start py-2 hover:bg-blue-50 hover:text-primary rounded-md"
              v-for="item in menuItems"
              :key="item"
            >
              {{ item }}
            </button>
            <div class="px-5 mt-2">
              <button
                class="text-sm border border-primary hover:bg-blue-50 hover:text-primary rounded-sm px-4 py-1 duration-200 transition-all ease-in-out"
              >
                Preprod
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";

export default {
  setup() {
    const menuItems = ref<Array<string>>([
      "Account",
      "Transaction",
      "Cbor View",
    ]);
    const activeLink = ref<string>("Account");
    const isOpenMenu = ref<boolean>(false);

    function navigateMenu(link: string) {
      activeLink.value = link;
    }
    function openMenu() {
      isOpenMenu.value = !isOpenMenu.value;
    }

    return {
      menuItems,
      activeLink,
      isOpenMenu,
      navigateMenu,
      openMenu,
    };
  },
};
</script>
