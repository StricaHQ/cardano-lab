<template>
  <div class="flex flex-col gap-y-12">
    <div class="flex flex-col gap-y-10">
      <div>
        <div class="text-xl font-bold textColor">Create New Account</div>
        <p class="text-normal textColor1 mt-1">
          Create a new account by generating a secure key pair. This keys are
          essential for managing your account signing transaction and
          interacting with the Cardano blockchain.
        </p>
        <AppButton
          size="lg"
          btnClass="bgGradient"
          class="mt-5"
          @onClick="setAccount()"
        >
          <span class="text-sm text-white">Create Account</span>
        </AppButton>
      </div>
      <div class="flex flex-col gap-y-10" v-if="account">
        <div>
          <span class="text-sm textColor">Wallet Seed</span>
          <div
            class="w-full border borderColor mt-2 rounded-sm py-3 px-8 flex gap-x-8 justify-between items-center"
          >
            <span class="text-sm textColor1 font-LabMono">
              {{ wallet?.mnemonic }}
            </span>
            <CopyButton :content="wallet?.mnemonic" />
          </div>
        </div>

        <div>
          <span class="text-sm textColor">Account Receive Address</span>
          <div class="mt-4 flex flex-col gap-y-1">
            <span class="text-xs textColor1">1852' / 1815' / 0' / 0 / 0</span>
            <div
              class="w-full border borderColor rounded-sm py-3 px-8 flex gap-x-8 justify-between items-center"
            >
              <span class="text-sm textColor1 break-all">
                {{ account.getReceiveAddressDetails().bech32 }}
              </span>

              <CopyButton
                :content="account.getReceiveAddressDetails().bech32"
              />
            </div>
          </div>
        </div>

        <div>
          <span class="text-sm textColor">Account Stake Address</span>
          <div class="mt-4 flex flex-col gap-y-1">
            <span class="text-xs textColor1">1852' / 1815' / 0' / 2 / 0</span>
            <div
              class="w-full border borderColor rounded-sm py-3 px-8 flex gap-x-8 justify-between items-center"
            >
              <span class="text-sm textColor1 break-all">
                {{ account.getStakeAddress().bech32 }}
              </span>

              <CopyButton :content="account.getStakeAddress().bech32" />
            </div>
          </div>
        </div>
        <div>
          <span class="text-sm textColor">Account Details</span>
          <div class="w-full border borderColor mt-2 rounded-sm text-gray-700">
            <div
              class="flex flex-col lg:flex-row gap-y-2 items-start lg:items-center py-3 px-8"
            >
              <div class="w-60">
                <span class="font-semibold text-sm textColor"
                  >Payment Public Key</span
                >
              </div>

              <div class="flex gap-x-8 justify-between items-center w-full">
                <span class="text-sm textColor1 break-all">
                  {{
                    account.getReceiveAddressDetails().paymentCredential
                      .pubKeyHex
                  }}
                </span>
                <CopyButton
                  :content="
                    account.getReceiveAddressDetails().paymentCredential
                      .pubKeyHex
                  "
                />
              </div>
            </div>
            <div class="w-full h-[1px] borderBgColor"></div>
            <div
              class="flex flex-col lg:flex-row gap-y-2 items-start lg:items-center py-3 px-8"
            >
              <div class="w-60">
                <span class="font-semibold text-sm textColor"
                  >Payment Private Key</span
                >
              </div>

              <div class="flex gap-x-8 justify-between items-center w-full">
                <span class="text-sm textColor1 break-all">
                  {{
                    account.getReceiveAddressDetails().paymentCredential
                      .privKeyHex
                  }}
                </span>
                <CopyButton
                  :content="
                    account.getReceiveAddressDetails().paymentCredential
                      .privKeyHex
                  "
                />
              </div>
            </div>
            <div class="w-full h-[1px] borderBgColor"></div>
            <div
              class="flex flex-col lg:flex-row gap-y-2 items-start lg:items-center py-3 px-8"
            >
              <div class="w-60">
                <span class="font-semibold text-sm textColor"
                  >Staking Public Key</span
                >
              </div>
              <div class="flex gap-x-8 justify-between items-center w-full">
                <span class="text-sm textColor1 break-all">
                  {{
                    account.getReceiveAddressDetails().stakeCredential.pubKeyHex
                  }}
                </span>
                <CopyButton
                  :content="
                    account.getReceiveAddressDetails().stakeCredential.pubKeyHex
                  "
                />
              </div>
            </div>
            <div class="w-full h-[1px] borderBgColor"></div>
            <div
              class="flex flex-col lg:flex-row gap-y-2 items-start lg:items-center py-3 px-8"
            >
              <div class="w-60">
                <span class="font-semibold text-sm textColor"
                  >Staking Private Key</span
                >
              </div>
              <div class="flex gap-x-8 justify-between items-center w-full">
                <span class="text-sm textColor1 break-all">
                  {{
                    account.getReceiveAddressDetails().stakeCredential
                      .privKeyHex
                  }}
                </span>
                <CopyButton
                  :content="
                    account.getReceiveAddressDetails().stakeCredential
                      .privKeyHex
                  "
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import AppButton from "@/components/buttons/AppButton.vue";
import CopyButton from "@/components/buttons/CopyButton.vue";
import { useAccountStore } from "@/stores/openStore";
import { computed } from "vue";

export default {
  components: { AppButton, CopyButton },
  setup() {
    const accountStore = useAccountStore();

    const account = computed(() => {
      return accountStore.account;
    });

    const wallet = computed(() => accountStore.wallet);

    function setAccount() {
      accountStore.setAccount();
    }

    return { account, wallet, setAccount };
  },
};
</script>
