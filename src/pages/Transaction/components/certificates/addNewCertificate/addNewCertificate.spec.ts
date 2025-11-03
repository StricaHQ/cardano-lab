/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount, VueWrapper } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import addNewCertificate from "./addNewCertificate.vue";
import { useCertificateStore } from "../store/store";
import { CertificateType } from "@stricahq/typhonjs/dist/types";

// Pure UI Component
vi.mock("@/assets/icons/chevronDown.vue", () => ({
  default: { template: "<div class='chevron'></div>" },
}));

describe("addNewCertificate.vue", () => {
  let store: ReturnType<typeof useCertificateStore>;
  let wrapper: VueWrapper<any>;
  let pinia: ReturnType<typeof createPinia>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    store = useCertificateStore(pinia);

    store.allowedCertificateType = {
      STAKE_KEY_REGISTRATION: CertificateType.STAKE_KEY_REGISTRATION,
      STAKE_DELEGATION: CertificateType.STAKE_DELEGATION,
    };

    store.addCertificate = vi.fn();

    wrapper = mount(addNewCertificate, {
      attachTo: document.body,
      global: { plugins: [pinia] },
      props: { isAccountAvailable: true },
    });
  });

  // 1 Enables button when isAccountAvailable = true
  it("enables button  when account is available", () => {
    const button = wrapper.find("button");

    expect(button.attributes("disabled")).toBeUndefined();
  });

  // 2 Disables button when isAccountAvailable = false
  it("disables button when account is not available", async () => {
    await wrapper.setProps({ isAccountAvailable: false });
    const button = wrapper.find("button");
    expect(button.attributes("disabled")).toBeDefined();
  });

  // 3 Opens dropdown when clicked
  it("opens dropdown when clicked", async () => {
    expect(wrapper.vm.isCertificatesDropdownOpen).toBe(false);
    await wrapper.find("button").trigger("click");
    expect(wrapper.vm.isCertificatesDropdownOpen).toBe(true);
  });

  // 4 Show allowed certificate types on dropdown open and check one of the option is true
  it("renders allowed certificate types when open", async () => {
    await wrapper.find("button").trigger("click");
    await wrapper.vm.$nextTick();

    const items = wrapper.findAll("#allowedCertificateTypes");
    const allowedTypes = Object.keys(store.allowedCertificateType);

    expect(items.length).toBe(allowedTypes.length);
    expect(items[0].text()).toContain("Stake Key Registration");
  });

  // 5 Check if selects correct certificate and triggers addCertificate store function
  it("calls addCertificate and closes dropdown when one of the certificate type is chosen", async () => {
    await wrapper.find("button").trigger("click");
    await wrapper.vm.$nextTick();

    const items = wrapper.findAll("#allowedCertificateTypes");
    await items[0].trigger("click");

    expect(store.addCertificate).toHaveBeenCalledWith(
      CertificateType.STAKE_KEY_REGISTRATION,
    );
    expect(wrapper.vm.isCertificatesDropdownOpen).toBe(false);
  });

  // 6 GetCertificateTypeInText returns expected labels
  it("getCertificateTypeInText returns expected labels", () => {
    const vm = wrapper.vm;
    expect(
      vm.getCertificateTypeInText(CertificateType.STAKE_KEY_REGISTRATION),
    ).toBe("Stake Key Registration");
    expect(vm.getCertificateTypeInText(CertificateType.STAKE_DELEGATION)).toBe(
      "Stake Pool Delegation",
    );
    expect(vm.getCertificateTypeInText("CUSTOM_TYPE" as any)).toBe(
      "CUSTOM_TYPE",
    );
  });
});
