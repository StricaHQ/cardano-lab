/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { nextTick } from "vue";

import inputForm from "./inputForm.vue";
import { useInputStore } from "../store/store";
import AppButton from "@/components/buttons/appButton/appButton.vue";
import TokenBadge from "@/components/tokenBadge/tokenBadge.vue";
import DialogBox from "@/components/dialog/dialog.vue";
import AddTokenDialog from "../../addTokenDialog/addTokenDialog.vue";

import { onlyNumbers, sanitizeAmount } from "@/utils/utils";
import { Network } from "@/enums/networks";

describe("inputForm.vue", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  const mockInput = (overrides = {}) => ({
    id: 1,
    txId: "a".repeat(64),
    index: "0",
    address: "addr_test1xyz...",
    amount: "10",
    tokens: [],
    ...overrides,
  });

  const mountForm = async (overrides = {}) => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const store = useInputStore();
    const input = mockInput(overrides);

    store.getInputById = vi.fn().mockReturnValue(input);
    store.setInputField = vi.fn();
    store.addToken = vi.fn();
    store.deleteToken = vi.fn();
    store.clearInput = vi.fn();
    store.deleteInput = vi.fn();

    const wrapper = mount(inputForm, {
      props: { id: input.id, index: 1 },
      global: {
        plugins: [pinia],
        components: { AppButton, DialogBox, AddTokenDialog, TokenBadge },
      },
    });

    await nextTick();
    return { wrapper, store, input };
  };

  // 1 Basic rendering
  it("renders all expected labels and placeholders", async () => {
    const { wrapper } = await mountForm();

    expect(wrapper.text()).toContain("Input #1");
    expect(wrapper.find("input#utxo").exists()).toBe(true);
    expect(wrapper.find("input#utxoIndex").exists()).toBe(true);
    expect(wrapper.find("input#address").exists()).toBe(true);
    expect(wrapper.find("input#amount").exists()).toBe(true);
  });

  // 2 Watchers update store
  it("updates store when fields change", async () => {
    const { wrapper, store } = await mountForm();
    const vm = wrapper.vm as any;

    vm.trxIdField = "b".repeat(64);
    await nextTick();
    expect(store.setInputField).toHaveBeenCalledWith(1, "txId", "b".repeat(64));

    vm.indexField = "2";
    await nextTick();
    expect(store.setInputField).toHaveBeenCalledWith(1, "index", "2");

    vm.addressField = "addr_test1new...";
    await nextTick();
    expect(store.setInputField).toHaveBeenCalledWith(
      1,
      "address",
      "addr_test1new...",
    );

    vm.amountField = "25";
    await nextTick();
    expect(store.setInputField).toHaveBeenCalledWith(1, "amount", "25");
  });

  // 3 Validation logic
  it("validates fields correctly", async () => {
    const { wrapper } = await mountForm();
    const vm = wrapper.vm as any;

    vm.trxIdField = "";
    vm.addressField = "";
    vm.indexField = "";
    vm.amountField = "";
    expect(vm.isFormValid()).toBe(false);
    expect(vm.trxIdErrorMessage).toBe("Required");
    expect(vm.addressErrorMessage).toBe("Required");
    expect(vm.indexErrorMessage).toBe("Required");
    expect(vm.amountErrorMessage).toBe("Required");

    // Invalid hex
    vm.trxIdField = "123xz";
    expect(vm.isFormValid()).toBe(false);
    expect(vm.trxIdErrorMessage).toContain("Invalid format");

    // Invalid length
    vm.trxIdField = "a".repeat(10);
    expect(vm.isFormValid()).toBe(false);
    expect(vm.trxIdErrorMessage).toContain("64");

    // Valid hex id
    vm.trxIdField = "a".repeat(64);
    vm.addressField = "invalidAddr";
    expect(vm.isFormValid()).toBe(false);
    expect(vm.addressErrorMessage).toContain("Invalid address");
  });

  // 4 Input sanitization
  it("cleans index and amount input correctly", async () => {
    const { wrapper } = await mountForm();
    const vm = wrapper.vm as any;

    const event = { target: { value: "abc123" } };
    vm.onIndexInput(event);
    expect(vm.indexField).toBe(onlyNumbers("abc123"));

    const event2 = { target: { value: "12.3456abc" } };
    vm.onAmountInput(event2);
    expect(vm.amountField).toBe(sanitizeAmount("12.3456abc"));
  });

  //5 Token management
  it("handles token addition and deletion", async () => {
    const { wrapper, store } = await mountForm();
    const vm = wrapper.vm as any;

    vm.openAddTokenDialog();
    expect(vm.showAddTokenDialog).toBe(true);
    vm.closeAddTokenDialog();
    expect(vm.showAddTokenDialog).toBe(false);

    vm.addToken({ policyId: "pid", assetName: "AAA", amount: "10" });
    expect(store.addToken).toHaveBeenCalledWith({
      trxId: 1,
      policyId: "pid",
      assetName: "AAA",
      amount: "10",
    });

    vm.deleteToken(5);
    expect(store.deleteToken).toHaveBeenCalledWith({ trxId: 1, tokenId: 5 });
  });

  // 6 Clear & Delete buttons
  it("clears and deletes input properly", async () => {
    const { wrapper, store } = await mountForm();
    const vm = wrapper.vm as any;

    vm.clearInput();
    expect(store.clearInput).toHaveBeenCalledWith(1);

    vm.deleteInput();
    expect(store.deleteInput).toHaveBeenCalledWith(1);
  });

  // 7 Network-based validation
  it("rejects addresses that mismatch the selected network", async () => {
    const { wrapper } = await mountForm();
    const vm = wrapper.vm as any;

    localStorage.setItem("cardanoLabSelectedNetwork", Network.MAINNET);
    vm.addressField = "addr_test1xyz...";
    vm.trxIdField = "a".repeat(64);
    vm.indexField = "0";
    vm.amountField = "10";

    const result = vm.isFormValid();
    expect(result).toBe(false);
    expect(vm.addressErrorMessage).toContain("Invalid address");
  });
});
