import type { Account } from "@/lib/account";
import { createNewWallet } from "@/lib/wallet";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useAccountStore = defineStore("accountStore", () => {
  const account = ref<Account>();
  const wallet = ref<{ mnemonic: string }>({ mnemonic: "" });

  async function setAccount() {
    const newWallet = await createNewWallet("cardano_testnet");
    wallet.value.mnemonic = newWallet.mnemonic;
    account.value = newWallet.accounts[0];
  }

  return {
    account,
    wallet,
    setAccount,
  };
});
