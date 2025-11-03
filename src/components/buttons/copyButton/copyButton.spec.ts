/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import CopyButton from "./copyButton.vue";

describe("CopyButton.vue (with real useCopyContent)", () => {
  const factory = (props?: any) =>
    mount(CopyButton, {
      props: { content: "default text", ...props },
      global: {
        stubs: {
          Copy: { template: "<div class='copy-icon'></div>" },
          Check: { template: "<div class='check-icon'></div>" },
        },
      },
    });

  beforeEach(() => {
    vi.useFakeTimers();

    vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  // 1 Should render Copy icon initially
  it("renders Copy icon when not yet copied", async () => {
    const wrapper = factory();
    await flushPromises();

    expect(wrapper.find(".copy-icon").exists()).toBe(true);
    expect(wrapper.find(".check-icon").exists()).toBe(false);
  });

  // 2 Should call clipboard API and show Check icon
  it("copies text to clipboard and toggles icon", async () => {
    const wrapper = factory({ content: "hello world" });

    await wrapper.trigger("click");
    await flushPromises();

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("hello world");

    expect(wrapper.find(".check-icon").exists()).toBe(true);
    expect(wrapper.find(".copy-icon").exists()).toBe(false);
  });

  // 3 Should reset icon back after timeout
  it("resets to Copy icon after timeout", async () => {
    const wrapper = factory({ content: "reset test" });

    await wrapper.trigger("click");
    await flushPromises();

    expect(wrapper.find(".check-icon").exists()).toBe(true);

    // Fast-forward time by 2000ms (default timeout)
    vi.advanceTimersByTime(2000);
    await flushPromises();

    expect(wrapper.find(".copy-icon").exists()).toBe(true);
    expect(wrapper.find(".check-icon").exists()).toBe(false);
  });
});
