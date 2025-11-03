/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount } from "@vue/test-utils";
import AppSubHeader from "./appSubHeader.vue";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { useRoute } from "vue-router";
import AppButton from "@/components/buttons/appButton/appButton.vue"; // ✅ real component import

vi.mock("vue-router", () => ({
  useRoute: vi.fn(),
}));

describe("AppSubHeader.vue", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  const factory = (mockPath: string) => {
    (useRoute as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      path: mockPath,
    });

    return mount(AppSubHeader, {
      global: {
        components: { AppButton },
        stubs: {
          RouterLink: {
            props: ["to"],
            template: `<a :href="to"><slot /></a>`,
          },
        },
      },
    });
  };

  // 1 Renders subheader container
  it("renders subheader", () => {
    const wrapper = factory("/account/createAccount");
    expect(wrapper.exists()).toBe(true);
  });

  // 2 Shows correct menu for /account path
  it("renders account subheader menu", () => {
    const wrapper = factory("/account/createAccount");
    const links = wrapper.findAll("a");

    expect(links[0].text()).toContain("Create New Account");
  });

  // 3 Shows correct menu for /transaction path
  it("renders transaction subheader menu", () => {
    const wrapper = factory("/transaction/buildTransaction");
    const links = wrapper.findAll("a");

    expect(links[0].text()).toContain("Build Transaction");
    expect(links[1].text()).toContain("Sign Transaction");
  });

  // 4 Shows correct menu for /cbor path
  it("renders cbor subheader menu", () => {
    const wrapper = factory("/cbor/cborView");
    const links = wrapper.findAll("a");

    expect(links[0].text()).toContain("CBOR View");
  });

  // 5 Shows empty menu for unknown path
  it("renders no items for unrelated route", () => {
    const wrapper = factory("/unknown/path");
    const links = wrapper.findAll("a");

    expect(links.length).toBe(0);
  });

  //  6 Verifies real AppButton is rendered inside menu
  it("renders real AppButton component", () => {
    const wrapper = factory("/transaction/buildTransaction");
    const buttons = wrapper.findAll("button");

    expect(buttons.length).toBeGreaterThan(0);
  });
});
