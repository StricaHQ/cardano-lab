/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import AppButton from "./appButton.vue";

//  A factory helper to create wrapper instances cleanly per test
const factory = (props?: Record<string, any>, slots?: Record<string, any>) => {
  return mount(AppButton, {
    props: {
      btnClass: "bg-primary text-white",
      size: "md",
      isDisabled: false,
      ...props,
    },
    slots: {
      default: "<span>Click Me</span>",
      ...slots,
    },
  });
};

describe("AppButton.vue", () => {
  // 1. Basic render test
  it("renders slot content correctly", () => {
    const wrapper = factory();
    expect(wrapper.text()).toContain("Click Me");
  });

  // 2. Applies correct size classes
  it.each([
    ["xs", "max-w-max px-2 py-2"],
    ["sm", "min-w-24 px-5 py-2"],
    ["md", "min-w-32 px-5 py-2"],
    ["lg", "min-w-44 px-8 py-2"],
  ])("applies correct size class for size='%s'", (size, expectedClass) => {
    const wrapper = factory({ size });
    const button = wrapper.find("button");

    expect(button.classes().join(" ")).toContain(expectedClass);
  });

  // 3. Combines btnClass with size classes
  it("merges size and btnClass into finalClass", () => {
    const wrapper = factory({ size: "sm", btnClass: "bg-red-500 text-white" });
    const button = wrapper.find("button");
    const classes = button.attributes("class");

    expect(classes).toContain("bg-red-500");
    expect(classes).toContain("text-white");
    expect(classes).toContain("min-w-24");
  });

  // 4. Emits 'onClick' event when clicked
  it("emits 'onClick' when button is clicked", async () => {
    const wrapper = factory();
    const button = wrapper.find("button");

    await button.trigger("click");

    expect(wrapper.emitted()).toHaveProperty("onClick");
    expect(wrapper.emitted("onClick")!.length).toBe(1);
  });

  // 5. Has disabled attribute when isDisabled=true
  it("sets disabled attribute when isDisabled is true", () => {
    const wrapper = factory({ isDisabled: true });
    const button = wrapper.find("button");

    expect(button.attributes()).toHaveProperty("disabled");
  });
});
