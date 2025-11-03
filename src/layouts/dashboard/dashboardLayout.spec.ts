import { mount } from "@vue/test-utils";
import DashboardLayout from "./DashboardLayout.vue";
import AppHeader from "./components/appHeader/appHeader.vue";
import AppSubHeader from "./components/appSubHeader/appSubHeader.vue";
import AppFooter from "./components/AppFooter.vue";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { useRoute } from "vue-router";

vi.mock("vue-router", () => ({
  useRoute: vi.fn(),
}));

describe("DashboardLayout.vue", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    (useRoute as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      path: "/account/createAccount",
    });
  });

  const factory = () =>
    mount(DashboardLayout, {
      global: {
        stubs: {
          RouterLink: { props: ["to"], template: `<a :href="to"><slot /></a>` },
          RouterView: { template: `<div class="router-view"></div>` },
        },
      },
    });
  it("renders header, subheader, router-view, and footer", () => {
    const wrapper = factory();

    expect(wrapper.findComponent(AppHeader).exists()).toBe(true);
    expect(wrapper.findComponent(AppSubHeader).exists()).toBe(true);
    expect(wrapper.findComponent(AppFooter).exists()).toBe(true);
    expect(wrapper.find(".router-view").exists()).toBe(true);
  });
});
