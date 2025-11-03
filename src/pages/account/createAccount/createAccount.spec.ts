import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { nextTick } from "vue";
import { describe, it, beforeEach, expect, vi } from "vitest";

import CreateAccount from "./createAccount.vue";
import { useAccountStore } from "@/stores/accountStore/accountStore";

//  Mock the wallet module
vi.mock("@/lib/wallet", async () => {
  return {
    createNewWallet: vi.fn().mockResolvedValue({
      mnemonic: "mock-mnemonic",
      accounts: [
        {
          getReceiveAddressDetails: vi.fn().mockReturnValue({
            bech32: "addr_mock",
            paymentCredential: {
              pubKeyHex: "pub",
              privKeyHex: "priv",
            },
            stakeCredential: {
              pubKeyHex: "stake_pub",
              privKeyHex: "stake_priv",
            },
          }),
          getStakeAddress: vi.fn().mockReturnValue({
            address: { getBech32: vi.fn().mockReturnValue("stake_addr") },
          }),
        },
      ],
    }),
    updateExistingWallet: vi.fn(),
    CardanoWallet: vi.fn(),
  };
});

describe("CreateAccount.vue", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  // 1 creates account and displays wallet info
  it("creates account and displays wallet info", async () => {
    const wrapper = mount(CreateAccount);
    const store = useAccountStore();

    expect(store.account).toBeUndefined();
    expect(store.wallet.mnemonic).toBe("");

    // Click the "Create Account" button
    await wrapper.find("button").trigger("click");

    // Wait for all async operations + reactivity
    await flushPromises();
    await nextTick();

    // Store should now have updated mnemonic
    expect(store.wallet.mnemonic).toBe("mock-mnemonic");

    // UI should reflect it
    expect(wrapper.text()).toContain("mock-mnemonic");
  });
});
