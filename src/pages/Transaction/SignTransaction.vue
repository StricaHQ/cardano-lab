<template>
  <div class="flex flex-col gap-y-5">
    <div>
      <span class="textColor font-bold text-xl">Sign Transaction</span>
    </div>
    <div class="flex flex-col gap-y-4">
      <div class="w-full card1 flex flex-col gap-y-2">
        <div class="cardWhite cardWhite flex flex-col gap-y-4">
          <div class="flex flex-col gap-y-0.5">
            <span class="textColor2 text-xs">Transaction Hash</span>
            <div class="w-full flex gap-x-4 items-center">
              <span class="text-sm textColor1 break-all">
                addr_test1qzxh5m2nyfr4xztkcyxe0q0pllf9ewa390mhanhwdu9c5s3m94x2grl62tts72s7gspgt8kzpspvzdw3tu59rnulp0dql8lz67
              </span>

              <CopyButton
                content="
                  addr_test1qzxh5m2nyfr4xztkcyxe0q0pllf9ewa390mhanhwdu9c5s3m94x2grl62tts72s7gspgt8kzpspvzdw3tu59rnulp0dql8lz67
                "
              />
            </div>
          </div>
          <div class="flex flex-col gap-y-0.5">
            <span class="textColor2 text-xs">Fee</span>
            <div class="w-full flex gap-x-8 justify-between items-center">
              <span class="text-sm textColor1 break-all"> 24.0000 A </span>
            </div>
          </div>
        </div>
      </div>
      <!-- input -->
      <div class="w-full card1 flex flex-col gap-y-2">
        <div class="flex items-center gap-x-2">
          <div class="w-2 h-2 rounded-full bg-gray-800"></div>
          <div>
            <span class="textColor1 text-sm font-medium">INPUTS</span>
          </div>
        </div>
        <div class="cardWhite cardWhite flex flex-col gap-y-4">
          <div class="headingBadge">
            <span>Input #1</span>
          </div>
          <div class="flex flex-col gap-y-0.5">
            <span class="textColor2 text-xs">UTXO</span>
            <div class="w-full flex gap-x-4 items-center">
              <span class="text-sm textColor1 break-all">
                97c213d07b2269f97890640adf98425070bf8cd7e3b86ba9057c888074514b09
                #0
              </span>
            </div>
          </div>
          <div class="flex flex-col gap-y-0.5">
            <span class="textColor2 text-xs">ADA</span>
            <div class="w-full flex gap-x-8 justify-between items-center">
              <span class="text-sm textColor1 break-all"> 1234.789654 A </span>
            </div>
          </div>
          <div class="flex flex-col gap-y-0.5">
            <span class="textColor2 text-xs">Tokens</span>
            <div
              class="flex gap-x-4 items-center flex-wrap justify-start gap-y-4"
            >
              <TokenBadge tokenName="Min" tokenAmount="1.234567" />
            </div>
          </div>
        </div>
      </div>
      <!-- output -->
      <div class="w-full card1 flex flex-col gap-y-2">
        <div class="flex items-center gap-x-2">
          <div class="w-2 h-2 rounded-full bg-gray-800"></div>
          <div>
            <span class="textColor1 text-sm font-medium">OUTPUTS</span>
          </div>
        </div>
        <div class="cardWhite cardWhite flex flex-col gap-y-4">
          <div class="headingBadge">
            <span>Input #1</span>
          </div>
          <div class="flex flex-col gap-y-0.5">
            <span class="textColor2 text-xs">ADDRESS</span>
            <div class="w-full flex gap-x-4 items-center">
              <span class="text-sm textColor1 break-all">
                addr1q9dhugez3ka82k2kgh7r2lg0j7aztr8uell46kydfwu3vk6n8w2cdu8mn2ha278q6q25a9rc6gmpfeekavuargcd32vsvxhl7e
              </span>
            </div>
          </div>
          <div class="flex flex-col gap-y-0.5">
            <span class="textColor2 text-xs">ADA</span>
            <div class="w-full flex gap-x-8 justify-between items-center">
              <span class="text-sm textColor1 break-all"> 1234.789654 A </span>
            </div>
          </div>
          <div class="flex flex-col gap-y-0.5">
            <span class="textColor2 text-xs">Tokens</span>
            <div
              class="flex gap-x-4 items-center flex-wrap justify-start gap-y-4"
            >
              <TokenBadge tokenName="Min" tokenAmount="1.234567" />
            </div>
          </div>
        </div>
      </div>
      <!-- sign -->
      <div class="w-full card1 flex flex-col gap-y-2">
        <div class="flex items-center gap-x-2">
          <div class="w-2 h-2 rounded-full bg-gray-800"></div>
          <div>
            <span class="textColor1 text-sm font-medium">SIGN</span>
          </div>
        </div>
        <div class="cardWhite cardWhite flex flex-col gap-y-4">
          <div class="headingBadge">
            <span>Private Keys</span>
          </div>
          <div v-for="key in privateKeys" :key="key.id" class="flex gap-x-4">
            <input type="text" class="inputField" />
            <AppButton
              @onClick="deletePrivateKey(key.id)"
              btnClass="bg-red-50 space-x-2"
              size="xs"
            >
              <span>
                <font-awesome-icon
                  class="text-red-500 text-xs"
                  :icon="['fas', 'trash']"
              /></span>
            </AppButton>
          </div>

          <AppButton
            size="sm"
            btnClass="bg-secondary max-w-max"
            @onClick="addPrivateKey"
          >
            <span class="text-xs text-white">Add</span></AppButton
          >
        </div>
      </div>
      <!-- signature -->
      <div class="w-full card1 flex flex-col gap-y-2">
        <div class="flex items-center gap-x-2">
          <div class="w-2 h-2 rounded-full bg-gray-800"></div>
          <div>
            <span class="textColor1 text-sm font-medium">SIGNATURE</span>
          </div>
        </div>
        <div class="cardWhite cardWhite flex flex-col gap-y-4">
          <div class="headingBadge">
            <span>Signature #1</span>
          </div>
          <div class="flex flex-col gap-y-0.5">
            <span class="textColor2 text-xs">Public key</span>
            <div class="w-full flex gap-x-4 items-center">
              <span class="text-sm textColor1 break-all">
                addr1q9dhugez3ka82k2kgh7r2lg0j7aztr8uell46kydfwu3vk6n8w2cdu8mn2ha278q6q25a9rc6gmpfeekavuargcd32vsvxhl7e
              </span>
            </div>
          </div>
          <div class="flex flex-col gap-y-0.5">
            <span class="textColor2 text-xs">signature</span>
            <div class="w-full flex gap-x-8 justify-between items-center">
              <span class="text-sm textColor1 break-all">
                addr1q9dhugez3ka82k2kgh7r2lg0j7aztr8uell46kydfwu3vk6n8w2cdu8mn2ha278q6q25a9rc6gmpfeekavuargcd32vsvxhl7e
              </span>
            </div>
          </div>
        </div>
      </div>
      <AppButton btn-class="bgGradient max-w-max" size="lg"
        ><span class="text-sm text-white">Submit Transaction</span></AppButton
      >
    </div>
  </div>
</template>

<script lang="ts">
import CopyButton from "@/components/buttons/CopyButton.vue";
// import { useTransactionsStore } from "./store";
import { ref } from "vue";
import TokenBadge from "@/components/TokenBadge.vue";
import AppButton from "@/components/buttons/AppButton.vue";
export default {
  components: { CopyButton, TokenBadge, AppButton },
  setup() {
    // const trxStore = useTransactionsStore();

    const privateKeyId = ref<number>(0);
    const privateKeys = ref<Array<{ id: number; keys: string }>>([
      { id: privateKeyId.value++, keys: "" },
    ]);

    function addPrivateKey() {
      privateKeys.value.push({ id: privateKeyId.value++, keys: "" });
    }

    function deletePrivateKey(id: number) {
      privateKeys.value = privateKeys.value.filter((key) => key.id !== id);
      if (!privateKeys.value.length) {
        addPrivateKey();
      }
    }

    return {
      privateKeys,
      addPrivateKey,
      deletePrivateKey,
    };
  },
};
</script>
