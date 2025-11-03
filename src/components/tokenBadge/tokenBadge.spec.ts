import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import TokenItem from "@/components/tokenBadge/tokenBadge.vue";

describe("TokenItem.vue", () => {
  const defaultProps = {
    assetName: "MyToken",
    policyId: "abc123",
    amount: "1000",
  };

  // 1. Basic render test
  it("renders token info correctly", () => {
    const wrapper = mount(TokenItem, { props: defaultProps });

    expect(wrapper.text()).toContain("abc123");
    expect(wrapper.text()).toContain("MyToken");
    expect(wrapper.text()).toContain("1000");
  });

  // 2. Delete button hidden when enableDelete = false
  it("does not render delete button when enableDelete is false", () => {
    const wrapper = mount(TokenItem, { props: defaultProps });
    const button = wrapper.find("button");
    expect(button.exists()).toBe(false);
  });

  // 3. Delete button visible when enableDelete = true
  it("renders delete button when enableDelete is true", () => {
    const wrapper = mount(TokenItem, {
      props: { ...defaultProps, enableDelete: true },
    });

    const button = wrapper.find("button");
    expect(button.exists()).toBe(true);
  });

  // 4. Emits deleteToken event on button click
  it("emits deleteToken event when delete button is clicked", async () => {
    const wrapper = mount(TokenItem, {
      props: { ...defaultProps, enableDelete: true },
      global: {
        stubs: { Close: true },
      },
    });

    const button = wrapper.find("button");
    await button.trigger("click");

    expect(wrapper.emitted()).toHaveProperty("deleteToken");
    expect(wrapper.emitted("deleteToken")?.length).toBe(1);
  });
});
