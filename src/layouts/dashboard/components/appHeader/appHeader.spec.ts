/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount } from "@vue/test-utils";
import AppHeader from "./appHeader.vue";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { useRoute } from "vue-router";

vi.mock("vue-router", () => ({
  useRoute: vi.fn(),
}));

describe("AppHeader.vue", () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    (useRoute as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      path: "/account/createAccount",
    });

    localStorage.clear();
  });

  const factory = () =>
    mount(AppHeader, {
      global: {
        stubs: {
          Bars: { template: "<div class='bars-icon'></div>" },
          Close: { template: "<div class='close-icon'></div>" },
          SettingsIcon: { template: "<div class='settings-icon'></div>" },
          DialogBox: {
            template: `
              <div class='dialog-box'>
                <slot name='header'></slot>
                <slot name='body'></slot>
              </div>
            `,
            props: ["openDialog"],
          },
          Settings: { template: "<div class='settings-component'></div>" },
          RouterLink: {
            props: ["to"],
            template: `<a :href="to"><slot /></a>`,
          },
        },
      },
    });

  //  1. Basic render test
  it("renders header component", () => {
    const wrapper = factory();
    expect(wrapper.exists()).toBe(true);
  });

  //  2. Shows app title
  it("shows title 'Cardano Lab'", () => {
    const wrapper = factory();
    expect(wrapper.text()).toContain("Cardano Lab");
  });

  // 3. Has navigation menu items
  it("renders all nav menu items", () => {
    const wrapper = factory();
    const navLinks = wrapper.findAll("a");
    expect(navLinks[0].text()).toContain("Account");
    expect(navLinks[1].text()).toContain("Transaction");
    expect(navLinks[2].text()).toContain("CBOR View");
  });

  // 4. Renders settings icon (visible on large screens)
  it("renders settings icon", () => {
    const wrapper = factory();
    expect(wrapper.find(".settings-icon").exists()).toBe(true);
  });

  // 5. Renders bars (menu) icon (for mobile view)
  it("renders menu bars icon", () => {
    const wrapper = factory();
    expect(wrapper.find(".bars-icon").exists()).toBe(true);
  });

  // 6. Opens settings dialog on icon click
  it("opens settings dialog when settings icon clicked", async () => {
    const wrapper = factory();
    await wrapper.find(".settings-icon").trigger("click");
    expect((wrapper.vm as any).isSettingsOpen).toBe(true);
  });

  // 7. Opens and closes mobile menu correctly
  it("opens and closes mobile menu", async () => {
    const wrapper = factory();

    // Open menu
    await wrapper.find(".bars-icon").trigger("click");
    expect((wrapper.vm as any).isMenuOpen).toBe(true);

    // Close menu
    await wrapper.find(".close-icon").trigger("click");
    expect((wrapper.vm as any).isMenuOpen).toBe(false);
  });
});
