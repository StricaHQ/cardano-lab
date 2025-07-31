<template>
  <div class="text-gray-800 w-full max-w-[1300px] mx-auto px-5">
    <header class="grid grid-cols-2 md:grid-cols-5 items-center py-2">
      <div
        class="text-xl font-semibold col-span-1 flex items-center gap-x-2 w-40"
      >
        <img class="w-10" src="../../../assets/image/logo.svg" alt="" />
        <span class="text-lg">Cardano Lab</span>
      </div>
      <div class="hidden md:block col-span-3">
        <nav class="flex justify-center gap-x-10 text-sm">
          <RouterLink
            :to="item.link === '/cbor' ? '' : item.link"
            v-for="item in menuItems"
            class="relative"
            :key="item.name"
            :class="item.link === '/cbor' ? 'pointer-events-none' : ''"
          >
            <span
              :class="
                activeNavItem === item.link ? 'text-primary' : 'textColor1'
              "
              class="font-semibold"
            >
              {{ item.name }}
            </span>
            <div
              :class="
                activeNavItem === item.link ? 'bg-primary' : 'bg-transparent'
              "
              class="w-5 h-[10px] rounded-t-full absolute -bottom-[18px] inset-x-0 m-auto"
            ></div>
          </RouterLink>
        </nav>
      </div>
      <div class="hidden md:block">
        <div class="col-span-1 flex justify-end">
          <AppButton
            btnClass="border border-primary hover:bg-primary/[0.1] group"
            size="sm"
          >
            <span class="text-primary text-xs font-medium"
              >Preprod</span
            ></AppButton
          >
        </div>
      </div>
      <!-- mobile view -->
      <div class="col-span-1 flex justify-end md:hidden relative z-40">
        <button @click="openMenu">
          <Bars class="text-primary size-6 mt-2" />
        </button>
        <div
          v-if="isMenuOpen"
          class="fixed top-0 right-0 left-0 bottom-0 bg-black/50 transition-all duration-400 ease-in-out z-40"
          @click="closeMenu"
        >
          <div
            class="fixed right-0 bg-white transition-opacity duration-400 ease-in-out overflow-scroll no-scrollbar"
            :class="isMenuOpen ? 'w-[70%] md:w-[50%] h-full ' : ''"
          >
            <div
              class="flex justify-end p-2"
              :class="
                isMenuOpen
                  ? ' transition-opacity-increase opacity-100'
                  : ' transition-opacity-decrease opacity-0'
              "
            >
              <button @click="closeMenu">
                <Close class="text-primary size-6 mt-2" />
              </button>
            </div>

            <div class="flex flex-col items-start gap-y-0.5 text-sm w-full">
              <RouterLink
                :to="item.link === '/cbor' ? '' : item.link"
                v-for="item in menuItems"
                :key="item.name"
                class="w-full px-5 flex items-start py-2 hover:bg-blue-50 hover:text-primary"
                :class="item.link === '/cbor' ? 'pointer-events-none' : ''"
              >
                {{ item.name }}</RouterLink
              >

              <div class="px-5 mt-2 w-full">
                <AppButton
                  btnClass="border border-primary hover:bg-primary/[0.1] group w-full"
                  size="sm"
                >
                  <span class="text-primary text-xs font-medium"
                    >Preprod</span
                  ></AppButton
                >
              </div>
            </div>
            <div class="flex flex-col"></div>
          </div>
        </div>
      </div>
    </header>
  </div>
</template>

<script lang="ts">
import { computed, onMounted, ref } from "vue";
import AppButton from "@/components/buttons/AppButton.vue";
import { useRoute } from "vue-router";
import Bars from "@/assets/icons/bars.vue";
import Close from "@/assets/icons/close.vue";

export default {
  components: { AppButton, Bars, Close },
  setup() {
    const menuItems = ref<Array<{ name: string; link: string }>>([
      { name: "Account", link: "/account/createAccount" },
      { name: "Transaction", link: "/transaction/buildTransaction" },
      { name: "Cbor View", link: "/cbor" },
    ]);
    const activeLink = ref<string>("/account/createAccount");
    const isMenuOpen = ref<boolean>(false);
    const route = useRoute();

    const activeNavItem = computed(() => {
      if (route.path.startsWith("/account")) {
        return "/account/createAccount";
      } else if (route.path.startsWith("/transaction")) {
        return "/transaction/buildTransaction";
      } else {
        return "/cbor";
      }
    });

    function openMenu() {
      isMenuOpen.value = true;
    }

    function closeMenu() {
      isMenuOpen.value = false;
    }

    onMounted(() => {
      activeLink.value = route.path;
    });

    return {
      menuItems,
      activeLink,
      isMenuOpen,
      openMenu,
      closeMenu,
      activeNavItem,
    };
  },
};
</script>
