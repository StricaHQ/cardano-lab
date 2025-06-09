<template>
  <div class="flex flex-col gap-y-12">
    <div class="flex flex-col gap-y-10">
      <div>
        <div class="text-xl font-bold text-gray-800">Create New Account</div>
        <p class="text-normal text-gray-700 mt-1">
          Create a new account by generating a secure key pair. This keys are
          essential for managing your account signing transaction and
          interacting with the Cardano blockchain.
        </p>
        <button
          class="mt-5 px-8 py-2 bg-primary text-sm text-white rounded-sm text-center w-fit hover:shadow-inner hover:bg-blue-800 duration-200 transition-all ease-in-out"
          @click="accountStore.setAccount()"
        >
          Create Account
        </button>
      </div>
      <div class="flex flex-col gap-y-10" v-if="accountStore.account">
        <div>
          <span class="text-sm text-gray-700">Account Receive Address</span>
          <div
            class="w-full border border-gray-300 mt-2 rounded-sm py-3 px-8 flex gap-x-8 justify-between items-center"
          >
            <span class="text-sm text-gray-600 break-all">
              {{ accountStore.getReceiveAddress }}
            </span>

            <button
              @click="copyButton(accountStore.getReceiveAddress, 0)"
              class="w-6 h-6 rounded-md border-[0.5px] border-primary bg-blue-50 flex justify-center items-center shrink-0 hover:bg-blue-100"
            >
              <font-awesome-icon
                v-if="!copyButtonIndex[0]"
                class="text-primary text-xs"
                :icon="['far', 'copy']"
              />
              <font-awesome-icon
                v-else
                class="text-green-500 text-xs"
                :icon="['fas', 'check']"
              />
            </button>
          </div>
        </div>
        <div>
          <span class="text-sm text-gray-700">Private Keys</span>
          <div
            class="w-full border border-gray-300 mt-2 rounded-sm text-gray-700"
          >
            <div
              class="flex flex-col lg:flex-row gap-y-2 items-start lg:items-center py-3 px-8"
            >
              <div class="w-60">
                <span class="font-semibold text-sm text-gray-800"
                  >Payment Private Key</span
                >
              </div>
              <div class="flex gap-x-8 justify-between items-center">
                <span class="text-sm text-gray-600 break-all">
                  {{ accountStore.getPaymentPrivateKey }}
                </span>
                <button
                  @click="copyButton(accountStore.getPaymentPrivateKey, 1)"
                  class="w-6 h-6 rounded-md border-[0.5px] border-primary bg-blue-50 flex justify-center items-center shrink-0 hover:bg-blue-100"
                >
                  <font-awesome-icon
                    v-if="!copyButtonIndex[1]"
                    class="text-primary text-xs"
                    :icon="['far', 'copy']"
                  />
                  <font-awesome-icon
                    v-else
                    class="text-green-500 text-xs"
                    :icon="['fas', 'check']"
                  />
                </button>
              </div>
            </div>
            <div class="w-full h-[1px] bg-gray-300"></div>
            <div
              class="flex flex-col lg:flex-row gap-y-2 items-start lg:items-center py-3 px-8"
            >
              <div class="w-60">
                <span class="font-semibold text-sm text-gray-800"
                  >Staking Private Key</span
                >
              </div>
              <div class="flex gap-x-8 justify-between items-center">
                <span class="text-sm text-gray-600 break-all">
                  {{ accountStore.getStakingPrivateKey }}
                </span>
                <button
                  @click="copyButton(accountStore.getStakingPrivateKey, 2)"
                  class="w-6 h-6 rounded-md border-[0.5px] border-primary bg-blue-50 flex justify-center items-center shrink-0 hover:bg-blue-100"
                >
                  <font-awesome-icon
                    v-if="!copyButtonIndex[2]"
                    class="text-primary text-xs"
                    :icon="['far', 'copy']"
                  />
                  <font-awesome-icon
                    v-else
                    class="text-green-500 text-xs"
                    :icon="['fas', 'check']"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useAccountStore } from "@/stores/openStore";
import { ref } from "vue";

export default {
  setup() {
    const accountStore = useAccountStore();
    const copyButtonIndex = ref<Array<boolean>>([]);

    async function copyButton(hex: string, index: number) {
      copyButtonIndex.value[index] = true;
      await navigator.clipboard.writeText(hex);
      setTimeout(() => {
        copyButtonIndex.value[index] = false;
      }, 2000);
    }
    return {
      accountStore,
      copyButton,
      copyButtonIndex,
    };
  },
};
</script>
