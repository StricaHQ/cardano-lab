import { mount } from "@vue/test-utils";
import { setActivePinia, createPinia } from "pinia";
import OutputForm from "./outputForm.vue";
import { useOutputStore } from "../store/store";
import { nextTick } from "vue";
import { describe, it, expect, beforeEach } from "vitest";

describe("OutputForm.vue", () => {
  let store: ReturnType<typeof useOutputStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useOutputStore();
    store.reset();

    // Ensure we start with one default output (id=0)
    store.outputs[0].address = "addr_test1xyz...";
    store.outputs[0].amount = "10";
  });

  const outputForm = () =>
    mount(OutputForm, {
      props: { id: 0, index: 1 },
      global: {
        stubs: ["AppButton", "DialogBox", "AddTokenDialog", "TokenBadge"],
      },
    });

  // 1 renders initial fields
  it("renders initial address and amount fields", async () => {
    const wrapper = outputForm();

    expect(wrapper.find("#address").exists()).toBe(true);
    expect(wrapper.find("#amount").exists()).toBe(true);

    const addressInput = wrapper.find("#address").element as HTMLInputElement;
    const amountInput = wrapper.find("#amount").element as HTMLInputElement;

    expect(addressInput.value).toBe("addr_test1xyz...");
    expect(amountInput.value).toBe("10");
  });

  // 2 updates address in store
  it("updates address in store on input", async () => {
    const wrapper = outputForm();
    const input = wrapper.find("#address");
    await input.setValue("addr_test_new...");
    expect(store.getOutputById(0)?.address).toBe("addr_test_new...");
  });

  // 3 sanitizes and updates amount
  it("sanitizes and updates amount on input", async () => {
    const wrapper = outputForm();
    const amountInput = wrapper.find("#amount");
    await amountInput.setValue("12abc.5");
    expect(wrapper.vm.amountField).toBe("12.5");
  });

  // 4 validates required fields
  it("validates required fields", async () => {
    const wrapper = outputForm();
    wrapper.vm.addressField = "";
    wrapper.vm.amountField = "";

    await nextTick();
    const valid = wrapper.vm.isFormValid();

    await nextTick();
    expect(valid).toBe(false);
    expect(wrapper.vm.addressErrorMessage).toBe("Required");
    expect(wrapper.vm.amountErrorMessage).toBe("Required");
  });

  // 5 shows invalid address error
  it("shows invalid address error when address is invalid", async () => {
    const wrapper = outputForm();

    wrapper.vm.addressField = "bad_address";
    const valid = wrapper.vm.isFormValid();
    expect(valid).toBe(false);
    expect(wrapper.vm.addressErrorMessage).toBe("Invalid address");
  });

  // 6 adds and deletes tokens
  it("adds and deletes tokens properly via store", async () => {
    const wrapper = outputForm();
    wrapper.vm.addToken({
      policyId: "policy1",
      assetName: "TOKEN",
      amount: "5",
    });
    await nextTick();
    const tokens = store.getOutputById(0)?.tokens ?? [];
    expect(tokens.length).toBe(1);

    const tokenId = tokens[0].id;
    wrapper.vm.deleteToken(tokenId);
    await nextTick();
    expect(store.getOutputById(0)?.tokens.length).toBe(0);
  });

  // 7 clears output correctly
  it("clears output correctly", async () => {
    const wrapper = outputForm();
    wrapper.vm.addressField = "addr_new";
    wrapper.vm.amountField = "99";
    wrapper.vm.clearOutput();
    expect(wrapper.vm.addressField).toBe("");
    expect(wrapper.vm.amountField).toBe("");
  });

  // 8 deletes output and auto-adds new one
  it("deletes output from store", async () => {
    const wrapper = outputForm();
    wrapper.vm.deleteOutput();
    expect(store.outputs.length).toBe(1); // auto-added new
    expect(store.outputs[0]).toBeDefined(); // confirm existence
  });
});
