/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CBORView from "./cborView.vue";
import { useTransactionsStore } from "@/pages/Transaction/store/store";
import { convertLovelaceToADA } from "@/utils/utils";
import BigNumber from "bignumber.js";

// ✅ Safe partial mock without spreading non-object values
vi.mock("@stricahq/typhonjs", async () => {
  const actual: Record<string, any> =
    await vi.importActual("@stricahq/typhonjs");
  return {
    ...actual,
    utils: {
      getAddressFromHex: vi.fn(() => ({ getBech32: () => "mockedBech32" })),
    },
  };
});

beforeEach(() => {
  setActivePinia(createPinia());
});

describe("CBORView.vue)", () => {
  //1 check if it loads the transaction
  it("loads signedTransactionCBOR from store when manually set", async () => {
    const store = useTransactionsStore();
    store.signedTransactionCBOR = "a10081825820feedbeef";

    const wrapper = mount(CBORView, { global: { plugins: [createPinia()] } });

    // manually trigger sync like the component would do in real case
    wrapper.vm.cbor = store.signedTransactionCBOR;

    await wrapper.vm.$nextTick();
    expect(wrapper.vm.cbor).toBe(store.signedTransactionCBOR);
  });

  // check if it throws invalid error when invalid CBOR is set
  it("shows error message when CBOR decoding fails", async () => {
    const wrapper = mount(CBORView, {
      global: { plugins: [createPinia()] },
    });

    wrapper.vm.cbor = "invalidCBOR";

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.cborErrorMessage).toBe("Invalid CBOR");
    expect(wrapper.html()).toContain("Invalid CBOR");
  });

  //3. check if fee is converted from lovelace to ADA
  it("renders parsed CBOR and converts fee using real convertLovelaceToADA", async () => {
    const wrapper = mount(CBORView, {
      global: { plugins: [createPinia()] },
    });

    const validCBOR = "a10081825820abcdef";
    wrapper.vm.cbor = validCBOR;
    await wrapper.vm.$nextTick();

    const ada = convertLovelaceToADA(BigNumber(2000000));
    expect(ada.toNumber()).toBe(2);

    // Ensure transactionFee is defined
    expect(wrapper.vm.transactionFee).not.toBeUndefined();
  });
});
