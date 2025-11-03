/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import Settings from "@/components/settings/settings.vue";
import { useTransactionsStore } from "@/pages/Transaction/store/store";
import { Network } from "@/enums/networks";

beforeEach(() => {
  // Mock localStorage for happy-dom
  const store: Record<string, string> = {};
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => store[key],
    setItem: (key: string, value: string) => (store[key] = value),
    removeItem: (key: string) => delete store[key],
    clear: () => Object.keys(store).forEach((k) => delete store[k]),
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useFakeTimers();
});

describe("Settings", () => {
  let wrapper: ReturnType<typeof mount>;
  let store: ReturnType<typeof useTransactionsStore>;
  let pinia: ReturnType<typeof createPinia>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    store = useTransactionsStore(pinia);

    wrapper = mount(Settings, {
      global: {
        plugins: [pinia],
        stubs: {
          AppButton: {
            template: `<button @click="$emit('onClick')"><slot /></button>`,
          },
          ChevronDown: true,
          Check: true,
        },
      },
    });
  });

  // 1. Render check
  it("renders labels correctly", () => {
    expect(wrapper.text()).toContain("Network");
    expect(wrapper.text()).toContain("Transaction Submission Endpoint");
  });

  //  2. Dropdown open check
  it("opens the network dropdown on click", async () => {
    const dropdown = wrapper.find(".network-dropdown");
    await dropdown.trigger("click");
    expect((wrapper.vm as any).isNetworksDropdownOpen).toBe(true);
  });

  //  3. Network update test
  it("updates the network via store", async () => {
    const vm = wrapper.vm as any;
    await vm.updateNetwork(Network.PREPROD);

    expect(store.currentNetwork).toBe(Network.PREPROD);
    expect(localStorage.getItem("cardanoLabSelectedNetwork")).toBe(
      Network.PREPROD,
    );
  });

  //  4. Endpoint update test
  it("updates the transaction submit endpoint via store", async () => {
    const input = wrapper.find("#trxSubmitEndPoint");
    await input.setValue("https://example.com");

    const button = wrapper.find("button");
    await button.trigger("click");

    await wrapper.vm.$nextTick();

    const vm = wrapper.vm as any;
    expect(vm.isTrxSubmitEndPointUpdated).toBe(true);

    expect(store.trxSubmitEndPoint).toBe("https://example.com");
    expect(localStorage.getItem("trxSubmitEndPoint")).toBe(
      "https://example.com",
    );

    // ⏱ Fast-forward 3 seconds
    vi.advanceTimersByTime(3000);

    expect(vm.isTrxSubmitEndPointUpdated).toBe(false);
  });
});
