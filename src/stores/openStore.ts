import type { Account } from "@/lib/account";
import { createNewWallet } from "@/lib/wallet";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useAccountStore = defineStore("accountStore", () => {
  const account = ref<Account>();

  async function setAccount() {
    const wallet = await createNewWallet("cardano_testnet");
    account.value = wallet.accounts[0];
  }

  return {
    account,
    setAccount,
  };
});
