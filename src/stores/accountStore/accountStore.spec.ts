/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from "vitest";

// mock must appear before imports that use "@/lib/wallet"
vi.mock("@/lib/wallet", () => ({
  createNewWallet: vi.fn().mockResolvedValue({
    mnemonic: "mock-mnemonic",
    accounts: [{ mockAccount: true }],
  }),
  updateExistingWallet: vi.fn().mockResolvedValue({
    mnemonic: "updated-mnemonic",
    accounts: [{ mockAccount: true }],
  }),
}));

import { setActivePinia, createPinia } from "pinia";
import { flushPromises } from "@vue/test-utils";
import { useAccountStore } from "./accountStore";
import { useTransactionsStore } from "@/pages/Transaction/store/store";
import { Network } from "@/enums/networks";
import * as walletModule from "@/lib/wallet";
import { nextTick } from "vue";

describe("useAccountStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  // 1 Should create a new wallet and set account properly
  it("creates a new wallet and sets account", async () => {
    const { createNewWallet } = walletModule as any;
    const txStore = useTransactionsStore();
    txStore.currentNetwork = Network.MAINNET;

    const accountStore = useAccountStore();
    await accountStore.setAccount();

    expect(createNewWallet).toHaveBeenCalledWith("cardano");
    expect(accountStore.wallet.mnemonic).toBe("mock-mnemonic");
    expect(accountStore.account).toBeDefined();
  });

  // 2 Should update wallet when current network changes
  it("updates wallet when current network changes", async () => {
    const { updateExistingWallet } = walletModule as any;
    const txStore = useTransactionsStore();
    txStore.currentNetwork = Network.MAINNET;

    const accountStore = useAccountStore();
    await accountStore.setAccount();

    // simulate network change
    txStore.currentNetwork = Network.PREPROD;
    await nextTick();
    await flushPromises();

    expect(updateExistingWallet).toHaveBeenCalledWith({
      currencyId: "cardano_testnet",
      mnemonic: "mock-mnemonic",
    });

    expect(accountStore.wallet.mnemonic).toBe("updated-mnemonic");
    expect(accountStore.account).toBeDefined();
  });
});
