/* eslint-disable @typescript-eslint/no-explicit-any */

import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { nextTick, reactive } from "vue";

import CertificateForm from "./certificateForm.vue";
import { useCertificateStore } from "../store/store";
import { CertificateType } from "@stricahq/typhonjs/dist/types";

import AppButton from "@/components/buttons/appButton/appButton.vue";
import Delete from "@/assets/icons/delete.vue";
import { convertLovelaceToADA } from "@/utils/utils";
import { isHexString } from "@/utils/inputValidators/inputValidators";
import BigNumber from "bignumber.js";

describe("CertificateForm.vue", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  const mockCert = (overrides = {}) =>
    reactive({
      id: 1,
      certificateType: CertificateType.STAKE_KEY_REGISTRATION,
      address: { getBech32: () => "addr_test1xyz..." },
      deposit: "2000000",
      poolHash: "",
      ...overrides,
    });

  const certificateForm = async (certificateOverrides = {}) => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const store = useCertificateStore();
    const cert = mockCert(certificateOverrides);

    store.getCertificateById = vi.fn().mockReturnValue(cert);
    store.deleteCertificate = vi.fn();
    store.setCertificateField = vi.fn();

    const wrapper = mount(CertificateForm, {
      props: { id: 1, index: 1 },
      global: {
        plugins: [pinia],
        components: { AppButton, Delete },
      },
    });

    await nextTick();
    return { wrapper, store, cert };
  };

  // 1 Renders Stake Key Registration
  it("renders all expected fields for Stake Key Registration type", async () => {
    const { wrapper } = await certificateForm({
      certificateType: CertificateType.STAKE_KEY_REGISTRATION,
      deposit: "2000000",
      address: { getBech32: () => "addr_test1xyz..." },
    });

    await nextTick();

    // Check section header
    expect(wrapper.find(".headingBadge").text()).toBe("Certificate #1");

    // Should show correct type name
    expect(wrapper.text()).toContain("Stake Key Registration");

    // Should display address field in read-only mode
    expect(wrapper.text()).toContain("addr_test1xyz...");

    // Should display deposit field (specific to registration type)
    expect(wrapper.text()).toContain("Deposit");

    // Should NOT show Pool Hash input (belongs to delegation type)
    expect(wrapper.text()).not.toContain("Pool Hash");
  });

  // 2 Renders Stake Delegation
  it("renders Stake Delegation certificate correctly", async () => {
    const { wrapper } = await certificateForm({
      certificateType: CertificateType.STAKE_DELEGATION,
    });

    await nextTick();

    expect(wrapper.text()).toContain("Stake Pool Delegation");
    expect(wrapper.text()).toContain("Pool Hash");
  });

  // 3 Validation
  it("validates poolHashField correctly for Stake Delegation", async () => {
    const { wrapper } = await certificateForm({
      certificateType: CertificateType.STAKE_DELEGATION,
    });

    const vm = wrapper.vm as any;

    vm.poolHashField = "";
    let valid = vm.isFormValid();
    expect(valid).toBe(false);
    expect(vm.poolHashErrorMessage).toBe("Required");

    vm.poolHashField = "123xz";
    valid = vm.isFormValid();
    expect(valid).toBe(false);
    expect(vm.poolHashErrorMessage).toContain("Invalid");

    vm.poolHashField = "0deadbeef";
    await nextTick();
    valid = vm.isFormValid();
    expect(valid).toBe(true);
    expect(isHexString("deadbeef")).toBe(true);
  });

  // 4 Delete
  it("calls store.deleteCertificate on delete button click", async () => {
    const { wrapper, store } = await certificateForm();

    await wrapper.findComponent(AppButton).trigger("click");
    expect(store.deleteCertificate).toHaveBeenCalledWith(1);
  });

  // 5 Watcher
  it("updates store when poolHashField changes", async () => {
    const { wrapper, store } = await certificateForm({
      certificateType: CertificateType.STAKE_DELEGATION,
    });

    const vm = wrapper.vm as any;
    vm.poolHashField = "abcd1234";
    await nextTick();

    expect(store.setCertificateField).toHaveBeenCalledWith(
      1,
      "poolHash",
      "abcd1234",
    );
  });

  // 6 Computed fields
  it("computes addressField and depositField correctly", async () => {
    const { wrapper } = await certificateForm();
    const vm = wrapper.vm as any;

    expect(vm.addressField).toBe("addr_test1xyz...");
    expect(vm.depositField).toStrictEqual(
      convertLovelaceToADA(BigNumber(2000000)),
    );
  });

  // 7 Certificate type text
  it("returns correct text from getCertificateTypeInText", async () => {
    const { wrapper } = await certificateForm();
    const vm = wrapper.vm as any;

    expect(
      vm.getCertificateTypeInText(CertificateType.STAKE_KEY_REGISTRATION),
    ).toBe("Stake Key Registration");
    expect(vm.getCertificateTypeInText(CertificateType.STAKE_DELEGATION)).toBe(
      "Stake Pool Delegation",
    );
  });

  // 8 Watcher behavior - clears error message
  it("clears poolHashErrorMessage when poolHashField changes", async () => {
    const { wrapper } = await certificateForm({
      certificateType: CertificateType.STAKE_DELEGATION,
    });

    const vm = wrapper.vm as any;
    vm.poolHashErrorMessage = "Invalid";
    vm.poolHashField = "abcd";
    await nextTick();

    expect(vm.poolHashErrorMessage).toBe("");
  });
});
