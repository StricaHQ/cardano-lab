/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount, flushPromises } from "@vue/test-utils";
import SignTransaction from "./signTransaction.vue";
import { createPinia, setActivePinia } from "pinia";
import { useTransactionsStore } from "../store/store";
import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import BigNumber from "bignumber.js";

const mockRouter = {
  push: vi.fn(),
};

vi.mock("vue-router", () => ({
  useRouter: () => mockRouter,
}));

vi.mock("axios");

describe("SignTransaction.vue (real store)", () => {
  let pinia: ReturnType<typeof createPinia>;
  let trxStore: ReturnType<typeof useTransactionsStore>;

  const mountComponent = () =>
    mount(SignTransaction, {
      global: {
        plugins: [pinia],
      },
    });

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    trxStore = useTransactionsStore();

    trxStore.transaction = {
      getInputs: vi.fn(() => [
        {
          txId: "inputTx1",
          index: 0,
          address: { getBech32: () => "addr_input_1" },
          amount: BigNumber(1000000),
          tokens: [],
        },
      ]),
      getOutputs: vi.fn(() => [
        {
          address: { getBech32: () => "addr_output_1" },
          amount: BigNumber(2500000),
          tokens: [],
        },
      ]),
      getMints: vi.fn(() => []),
      getCertificates: vi.fn(() => []),
      getWithdrawals: vi.fn(() => []),
      getRequiredWitnesses: vi.fn(() => []),
      getTransactionHash: vi.fn(() => "txhash123"),
      buildTransaction: vi.fn(() => ({ payload: "deadbeef" })),
    } as any;

    trxStore.transactionResponse = {
      transactionHash: "txhash123",
      unsignedTransaction: "unsignedTxHex",
    };

    trxStore.trxSubmitEndPoint = "https://mock.endpoint";
    trxStore.fee = "0.25 ADA";
    trxStore.witnesses = [];
    trxStore.signedTransactionCBOR = "deadbeef";

    mockRouter.push.mockClear();
  });

  // 1 Verify rendering of transaction info
  it("renders transaction info correctly", async () => {
    const wrapper = mountComponent();
    await flushPromises();

    const text = wrapper.text();

    expect(text).toContain("Sign Transaction");
    expect(text).toContain("txhash123");
    expect(text).toContain("0.25 ADA");
    expect(text).toContain("addr_input_1");
    expect(text).toContain("addr_output_1");
  });

  // 2 Handles successful transaction submission
  it("handles successful submitTransaction", async () => {
    (axios.post as any).mockResolvedValue({ status: 202 });
    const wrapper = mountComponent();

    await (wrapper.vm as any).submitTransaction();
    await flushPromises();

    expect(wrapper.vm.isTransactionSubmitted).toBe(true);
    expect(wrapper.findComponent({ name: "DialogBox" }).exists()).toBe(true);
  });

  // 3 Handles failed transaction submission gracefully
  it("handles failed submitTransaction", async () => {
    (axios.post as any).mockRejectedValue(new Error("network error"));
    const wrapper = mountComponent();

    await (wrapper.vm as any).submitTransaction();
    await flushPromises();

    expect(wrapper.vm.submitTransactionError).toBe(
      "Transaction submission failed",
    );
    expect(wrapper.vm.isTransactionSubmitted).toBe(false);
  });

  // 4 Navigates after closing success dialog
  it("navigates after closing success dialog", async () => {
    const wrapper = mountComponent();

    wrapper.vm.isTransactionSubmitted = true;

    await (wrapper.vm as any).closeTransactionSubmissionSuccessDialog();
    await flushPromises();

    expect(mockRouter.push).toHaveBeenCalledWith(
      "/transaction/buildTransaction",
    );
  });
});
