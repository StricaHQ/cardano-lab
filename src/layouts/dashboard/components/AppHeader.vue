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
            :to="item.link"
            v-for="item in menuItems"
            class="relative"
            :key="item.name"
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
      <div class="flex items-center justify-end gap-4">
        <button class="" @click="openSettings">
          <SettingsIcon class="text-primary size-6" />
        </button>
        <!-- mobile view -->
        <div class="col-span-1 flex justify-end md:hidden relative z-40">
          <button @click="openMenu">
            <Bars class="text-primary size-6" />
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
                  :to="item.link"
                  v-for="item in menuItems"
                  :key="item.name"
                  class="w-full px-5 flex items-start py-2 hover:bg-blue-50 hover:text-primary"
                >
                  {{ item.name }}</RouterLink
                >
              </div>
              <div class="flex flex-col"></div>
            </div>
          </div>
        </div>
      </div>

      <DialogBox
        :openDialog="isSettingsOpen"
        dialogSize="lg"
        @closeDialog="closeSettings"
      >
        <template #header> Settings </template>
        <template #body>
          <Settings />
        </template>
      </DialogBox>
    </header>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import Bars from "@/assets/icons/bars.vue";
import Close from "@/assets/icons/close.vue";
import SettingsIcon from "@/assets/icons/settings.vue";
import DialogBox from "@/components/dialog/dialog.vue";
import Settings from "@/components/settings.vue";
import { Network } from "@/enums/networks";

export default defineComponent({
  components: {
    Bars,
    Close,
    SettingsIcon,
    Settings,
    DialogBox,
  },
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
      if (!localStorage.getItem("cardanoLabSelectedNetwork")) {
        localStorage.setItem("cardanoLabSelectedNetwork", Network.MAINNET);
      }
    });

    const isSettingsOpen = ref(false);

    function openSettings() {
      isSettingsOpen.value = true;
    }

    function closeSettings() {
      isSettingsOpen.value = false;
    }

    return {
      menuItems,
      activeLink,
      isMenuOpen,
      openMenu,
      closeMenu,
      activeNavItem,

      isSettingsOpen,
      openSettings,
      closeSettings,
    };
  },
});
</script>
