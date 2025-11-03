/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Dialog from "@/components/dialog/dialog.vue";

describe("Dialog.vue", () => {
  const factory = (props?: any) =>
    mount(Dialog, {
      props: { openDialog: true, ...props },

      global: {
        stubs: {
          Close: { template: "<div class='close-icon'></div>" },
        },
      },
    });

  // 1 Renders only when openDialog = true
  it("renders dialog when openDialog is true", () => {
    const wrapper = factory({ openDialog: true });
    expect(wrapper.find("#dialogContainer").exists()).toBe(true);
  });

  // 2 Show close button when showCloseButton = true
  it("renders close button when showCloseButton = true", () => {
    const wrapper = factory({ showCloseButton: true });
    expect(wrapper.find("button").exists()).toBe(true);
  });

  // 3 Hide close button when showCloseButton = false
  it("does not render close button when showCloseButton = false", () => {
    const wrapper = factory({ showCloseButton: false });
    expect(wrapper.find("button").exists()).toBe(false);
  });

  // 4 Emits 'closeDialog' when close button is clicked
  it("emits closeDialog when close button is clicked", async () => {
    const wrapper = factory({ showCloseButton: true });
    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted("closeDialog")).toBeTruthy();
  });

  // 5 Applies correct width class based on dialogSize prop
  it("computes correct dialog width class for various sizes", async () => {
    const sizes = [
      ["xs", "max-w-xs"],
      ["sm", "max-w-sm"],
      ["md", "max-w-md"],
      ["lg", "max-w-lg"],
      ["2xl", "max-w-2xl"],
      ["4xl", "max-w-4xl"],
      ["6xl", "max-w-6xl"],
      ["7xl", "max-w-7xl"],
      ["full", "max-w-full"],
      ["maxContent", "max-w-max"],
    ];

    for (const [size, expectedClass] of sizes) {
      const wrapper = factory({ dialogSize: size });
      const dialogBox = wrapper.find("#dialogBox");
      expect(dialogBox.classes()).toContain(expectedClass);
    }
  });
});
