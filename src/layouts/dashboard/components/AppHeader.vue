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
          <button
            v-for="item in menuItems"
            :key="item.name"
            @click="navigateToLink(item.link)"
            :class="item.link === '/cbor' ? 'pointer-events-none' : ''"
            class="relative"
          >
            <span
              :class="activeLink === item.link ? 'text-primary' : 'textColor1'"
              class="font-semibold"
            >
              {{ item.name }}
            </span>
            <div
              :class="
                activeLink === item.link ? 'bg-primary' : 'bg-transparent'
              "
              class="w-5 h-[10px] rounded-t-full absolute -bottom-[18px] inset-x-0 m-auto"
            ></div>
          </button>
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
          <font-awesome-icon
            class="text-primary text-xl"
            :icon="['fas', 'bars']"
          />
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
                <font-awesome-icon
                  class="text-primary text-xl"
                  :icon="['fas', 'xmark']"
                />
              </button>
            </div>

            <div class="flex flex-col items-start gap-y-0.5 text-sm w-full">
              <button
                class="w-full px-5 flex items-start py-2 hover:bg-blue-50 hover:text-primary"
                v-for="item in menuItems"
                :key="item.name"
                @click="navigateToLink(item.link)"
                :class="item.link === '/cbor' ? 'pointer-events-none' : ''"
              >
                {{ item.name }}
              </button>
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
import { onMounted, ref } from "vue";
import AppButton from "@/components/buttons/AppButton.vue";
import { useRoute, useRouter } from "vue-router";

export default {
  components: { AppButton },
  setup() {
    const menuItems = ref<Array<{ name: string; link: string }>>([
      { name: "Account", link: "/account/createAccount" },
      { name: "Transaction", link: "/transaction/buildTransaction" },
      { name: "Cbor View", link: "/cbor" },
    ]);
    const activeLink = ref<string>("/account");
    const isMenuOpen = ref<boolean>(false);
    const router = useRouter();
    const route = useRoute();

    function navigateToLink(link: string) {
      activeLink.value = link;
      router.push(link);
    }
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
      navigateToLink,
      openMenu,
      closeMenu,
    };
  },
};
</script>
