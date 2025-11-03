import { Network } from "@/enums/networks";
import type { Account } from "@/lib/account";
import {
  CardanoWallet,
  createNewWallet,
  updateExistingWallet,
} from "@/lib/wallet";
import { useTransactionsStore } from "@/pages/Transaction/store/store";
import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";

export const useAccountStore = defineStore("accountStore", () => {
  const account = ref<Account>();
  const wallet = ref<{ mnemonic: string }>({ mnemonic: "" });

  const setAccount = async () => {
    const currentNetwork = computed(
      () => useTransactionsStore().currentNetwork,
    );

    const newWallet = ref<CardanoWallet>(
      await createNewWallet(
        currentNetwork.value == Network.MAINNET ? "cardano" : "cardano_testnet",
      ),
    );

    watch(currentNetwork, async () => {
      newWallet.value = await updateExistingWallet({
        currencyId:
          currentNetwork.value == Network.MAINNET
            ? "cardano"
            : "cardano_testnet",
        mnemonic: wallet.value.mnemonic,
      });
    });

    watch(
      newWallet,
      () => {
        wallet.value.mnemonic = newWallet.value.mnemonic;
        account.value = newWallet.value.accounts[0] as Account;
      },
      { immediate: true },
    );
  };

  return {
    account,
    wallet,
    setAccount,
  };
});
