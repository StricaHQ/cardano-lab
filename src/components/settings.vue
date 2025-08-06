<template>
  <div class="space-y-8 my-8">
    <div class="card1">
      <div class="flex justify-between">
        <div class="text-sm">Network</div>
        <div
          ref="networksDropdownRef"
          class="text-xs border borderColor px-2 py-1 rounded flex gap-2 items-center hover:border-gray-400 hover:bg-gray-100 cursor-pointer relative"
          @click="openNetworksDropdown"
        >
          <div>
            {{ currentNetwork }}
          </div>
          <ChevronDown class="size-3" />

          <div
            v-if="isNetworksDropdownOpen"
            class="absolute top-7 right-0 bg-gray-200 rounded px-1 py-1 w-full shadow-lg"
          >
            <div
              v-for="network in networksList"
              :key="network"
              class="p-2 hover:bg-gray-100 rounded"
              @click.stop="updateNetwork(network)"
            >
              {{ network }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card1 space-y-2">
      <div class="text-sm">Cardanoscan Submit Endpoint</div>
      <div class="flex gap-4">
        <input
          id="cardanoscanEndPoint"
          class="inputField-2"
          type="text"
          placeholder="URL"
          v-model="cardanoscanEndPoint"
        />
        <div class="flex justify-end">
          <AppButton
            size="sm"
            :btnClass="
              isCardanoscanEndPointUpdated
                ? 'bg-green-500/10 text-green-700 text-[10px] border border-green-500/50'
                : 'bg-secondary text-gray-100 text-[10px] '
            "
            @onClick="updateCardanoscanEndPoint"
          >
            <Check v-if="isCardanoscanEndPointUpdated" class="size-3.5" />
            <span v-else> Update </span>
          </AppButton>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  ref,
} from "vue";
import AppButton from "./buttons/AppButton.vue";
import ChevronDown from "@/assets/icons/chevronDown.vue";
import { Network } from "@/enums/networks";
import { useTransactionsStore } from "@/pages/Transaction/store";
import Check from "@/assets/icons/check.vue";

export default defineComponent({
  components: { AppButton, ChevronDown, Check },
  setup() {
    const trxStore = useTransactionsStore();

    const cardanoscanEndPoint = ref(trxStore.cardanoscanEndPoint);
    const isNetworksDropdownOpen = ref(false);
    const isCardanoscanEndPointUpdated = ref(false);

    const updateCardanoscanEndPoint = () => {
      isCardanoscanEndPointUpdated.value = true;
      trxStore.updateCardanoscanEndPoint(cardanoscanEndPoint.value);

      setTimeout(() => {
        isCardanoscanEndPointUpdated.value = false;
      }, 3000);
    };

    const currentNetwork = computed(() => trxStore.currentNetwork);

    const updateNetwork = (network: Network) => {
      trxStore.updateNetwork(network);
      closeNetworksDropdown();
    };

    const openNetworksDropdown = () => {
      isNetworksDropdownOpen.value = true;
    };

    const closeNetworksDropdown = () => {
      isNetworksDropdownOpen.value = false;
    };

    const networksDropdownRef = ref();

    function onClickOutside(event: MouseEvent) {
      if (
        isNetworksDropdownOpen.value &&
        networksDropdownRef.value &&
        !networksDropdownRef.value.contains(event.target as Node)
      ) {
        closeNetworksDropdown();
      }
    }

    onMounted(() => {
      document.addEventListener("click", onClickOutside);
    });

    onBeforeUnmount(() => {
      document.removeEventListener("click", onClickOutside);
    });
    return {
      isCardanoscanEndPointUpdated,
      cardanoscanEndPoint,
      networksDropdownRef,
      isNetworksDropdownOpen,
      openNetworksDropdown,
      closeNetworksDropdown,
      currentNetwork,
      updateCardanoscanEndPoint,
      updateNetwork,
      networksList: Network,
    };
  },
});
</script>
