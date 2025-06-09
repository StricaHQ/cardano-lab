import type { Account } from "@/lib/account";
import { createNewWallet } from "@/lib/wallet";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useAccountStore = defineStore("accountStore", () => {
  const account = ref<Account>();

  async function setAccount() {
    const wallet = await createNewWallet("cardano_testnet");
    account.value = wallet.accounts[0];
  }

  const getReceiveAddress = computed(() => {
    return account.value?.getReceiveAddressDetails().bech32;
  });

  const getPaymentPrivateKey = computed(() =>{
    return account.value?.getReceiveAddressDetails().paymentCredential.privKeyHex
  })
  const getStakingPrivateKey = computed(() =>{
    return account.value?.getReceiveAddressDetails().stakeCredential.privKeyHex
  })

  return {
    account,
    setAccount,
    getReceiveAddress,
    getPaymentPrivateKey,
    getStakingPrivateKey
  };
});
