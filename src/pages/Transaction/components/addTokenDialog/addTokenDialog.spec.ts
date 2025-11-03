import { mount, VueWrapper } from "@vue/test-utils";
import { describe, it, expect, beforeEach } from "vitest";
import AddTokenDialog from "./addTokenDialog.vue";
import AppButton from "@/components/buttons/appButton/appButton.vue";
import { nextTick } from "vue";

describe("AddTokenDialog.vue", () => {
  let wrapper: VueWrapper<InstanceType<typeof AddTokenDialog>>;

  beforeEach(() => {
    wrapper = mount(AddTokenDialog);
  });

  // 1 Renders all fields
  it("renders all input fields and button", () => {
    expect(wrapper.find("#policyId").exists()).toBe(true);
    expect(wrapper.find("#assetName").exists()).toBe(true);
    expect(wrapper.find("#amount").exists()).toBe(true);
    expect(wrapper.findComponent(AppButton).exists()).toBe(true);
  });

  // 2 Disables button when inputs are empty
  it("disables button when required fields are empty", async () => {
    const button = wrapper.findComponent(AppButton);
    expect(button.props("isDisabled")).toBe(true);

    // update some data but keep one empty
    wrapper.vm.policyId = "abcd";
    wrapper.vm.assetName = "";
    wrapper.vm.amount = "10";
    await nextTick();

    expect(button.props("isDisabled")).toBe(true);
  });

  // 3 Shows error for invalid hex policyId
  it("shows error when policyId is not valid hex", async () => {
    wrapper.vm.policyId = "ZZZ123";
    wrapper.vm.assetName = "abcd1234";
    wrapper.vm.amount = "100";

    wrapper.vm.addToken();

    expect(wrapper.vm.policyIdErrorMessage).toBe(
      "Invalid format. Use only hexadecimal characters.",
    );
  });

  // 4 Shows error when policyId length is not 56
  it("shows error when policyId length is not 56", async () => {
    wrapper.vm.policyId = "a".repeat(10);
    wrapper.vm.assetName = "abcd1234";
    wrapper.vm.amount = "100";

    wrapper.vm.addToken();

    expect(wrapper.vm.policyIdErrorMessage).toBe("Must be 56 characters long.");
  });

  // 5  Shows error when assetName is not hex
  it("shows error when assetName is not hex", async () => {
    wrapper.vm.policyId = "a".repeat(56);
    wrapper.vm.assetName = "###";
    wrapper.vm.amount = "100";

    wrapper.vm.addToken();

    expect(wrapper.vm.assetNameErrorMessage).toBe(
      "Invalid format. Use only hexadecimal characters.",
    );
  });

  // 6 Emits updateTokenData when all inputs are valid
  it("emits updateTokenData when inputs are valid", async () => {
    wrapper.vm.policyId = "a".repeat(56);
    wrapper.vm.assetName = "abcd1234";
    wrapper.vm.amount = "100";

    wrapper.vm.addToken();

    const emitted = wrapper.emitted("updateTokenData");
    expect(emitted).toBeTruthy();
    expect(emitted![0][0]).toEqual({
      policyId: "a".repeat(56),
      assetName: "abcd1234",
      amount: "100",
    });
  });

  // 7 Filters non-numeric input for amount
  it("filters non-numeric characters in amount", async () => {
    const amountInput = wrapper.find("#amount");

    await amountInput.setValue("123abc");

    expect(wrapper.vm.amount).toBe("123");
  });
});
