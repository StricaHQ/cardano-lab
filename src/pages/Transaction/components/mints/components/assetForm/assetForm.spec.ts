/**
 * 🧪 Total Tests: 7
 */
import { mount } from "@vue/test-utils";
import AssetForm from "./assetForm.vue";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useMintStore } from "../../store/store";
import { onlyNumbers } from "@/utils/utils";

const factory = (props = {}) => {
  return mount(AssetForm, {
    props: {
      mintId: 1,
      assetCount: 1,
      asset: { id: 101, assetName: "abcd1234", amount: "10" },
      ...props,
    },
  });
};

describe("AssetForm.vue", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  // 1 — renders initial inputs and values
  it("renders asset name and amount fields with initial values", () => {
    const wrapper = factory();
    expect((wrapper.find("#assetName").element as HTMLInputElement).value).toBe(
      "abcd1234",
    );
    expect((wrapper.find("#amount").element as HTMLInputElement).value).toBe(
      "10",
    );
  });

  // 2 — shows error when asset name is not hex
  it("shows validation error for non-hex asset name", async () => {
    const wrapper = factory();
    const input = wrapper.find("#assetName");

    await input.setValue("invalid!");
    expect(wrapper.vm.assetNameErrorMessage).toBe(
      "Invalid format. Use only hexadecimal characters.",
    );
  });

  // 3 — clears error when asset name becomes valid hex
  it("clears error when valid hex entered", async () => {
    const wrapper = factory();
    const input = wrapper.find("#assetName");

    await input.setValue("invalid!");
    expect(wrapper.vm.assetNameErrorMessage).toContain("Invalid format");

    await input.setValue("a1b2c3");
    expect(wrapper.vm.assetNameErrorMessage).toBe("");
  });

  // 4 — updates store when inputs change
  it("calls store.updateAsset on input changes", async () => {
    const store = useMintStore();
    const spy = vi.spyOn(store, "updateAsset");
    const wrapper = factory();

    await wrapper.find("#assetName").setValue("abcd");
    await wrapper.find("#amount").setValue("55");

    expect(spy).toHaveBeenCalledTimes(2);
  });

  // 5 — shows 'required' errors when fields empty
  it("shows required error if one of the field is empty", () => {
    const wrapper = factory({
      asset: { id: 101, assetName: "", amount: "10" },
    });

    const valid = wrapper.vm.validateForm();
    expect(valid).toBe(false);
    expect(wrapper.vm.assetNameErrorMessage).toBe("required");
  });

  // 6 — filters amount input through onlyNumbers util
  it("filters amount input using onlyNumbers util", async () => {
    const wrapper = factory();
    const input = wrapper.find("#amount");

    const original = onlyNumbers("a1b2c3");
    await input.setValue("a1b2c3");

    expect(wrapper.vm.amount).toBe(original);
    expect(wrapper.vm.amount).toBe("123");
  });

  // 7 — triggers deleteAsset in store when delete clicked
  it("calls deleteAsset in store on delete click", async () => {
    const store = useMintStore();
    const spy = vi.spyOn(store, "deleteAsset");
    const wrapper = factory();

    const btn = wrapper.findComponent({ name: "AppButton" });
    await btn.trigger("click");

    expect(spy).toHaveBeenCalledWith({
      id: 1,
      assetId: 101,
    });
  });
});
