/**
 * 🧪 Total Tests: 5
 */
import { mount } from "@vue/test-utils";
import AssetBadge from "./assetBadge.vue";
import { describe, it, expect } from "vitest";

describe("assetBadge.vue", () => {
  const mountBadge = (props = {}) => {
    return mount(AssetBadge, {
      props: {
        assetName: "DEFAULT_ASSET",
        amount: "0",
        enableDelete: false,
        ...props,
      },
    });
  };

  // 1 — renders asset name and amount correctly
  it("renders asset name and amount", () => {
    const wrapper = mountBadge({ assetName: "TOKENXYZ", amount: "100" });
    expect(wrapper.text()).toContain("TOKENXYZ");
    expect(wrapper.text()).toContain("100");
  });

  // 2 — hides delete button when enableDelete=false
  it("hides delete button when enableDelete=false", () => {
    const wrapper = mountBadge({ enableDelete: false });
    expect(wrapper.find("button").exists()).toBe(false);
  });

  // 3 — shows delete button when enableDelete=true
  it("shows delete button when enableDelete=true", () => {
    const wrapper = mountBadge({ enableDelete: true });
    expect(wrapper.find("button").exists()).toBe(true);
  });

  // 4 — emits deleteAsset event when delete button clicked
  it("emits deleteAsset event when delete button clicked", async () => {
    const wrapper = mountBadge({ enableDelete: true });
    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted().deleteAsset).toBeTruthy();
  });

  // 5 — matches basic structure and classes
  it("applies correct base structure and styling classes", () => {
    const wrapper = mountBadge();
    const root = wrapper.find("div");
    expect(root.classes()).toContain("max-w-max");
    expect(root.classes()).toContain("h-9");
    expect(root.classes()).toContain("rounded-md");
  });
});
