import { useCopyContent } from "@/composables/copyContent/copyContent";
import { vi, describe, it, expect, beforeEach } from "vitest";

describe("useCopyContent composable ", () => {
  let writeTextMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.useFakeTimers();

    // Mock the clipboard API
    // In Happy DOM, navigator.clipboard exists but is read-only,
    // redefine it safely using `Object.defineProperty`.
    writeTextMock = vi.fn().mockResolvedValue(undefined);

    Object.defineProperty(globalThis.navigator, "clipboard", {
      value: { writeText: writeTextMock },
      writable: true,
      configurable: true,
    });
  });

  // 1 should copy successfully and set isCopied = true and reset once timeout expires
  it("copies text and sets isCopied to true", async () => {
    const { copyToClipboard, isCopied } = useCopyContent(2000);

    await copyToClipboard("Hello");

    expect(isCopied.value).toBe(true);

    // ⏱ Fast-forward 2 seconds
    vi.advanceTimersByTime(2000);

    //resets isCopied after the timeout expires
    expect(isCopied.value).toBe(false);
  });

  // 2  should handle clipboard write failure gracefully
  it("handles clipboard write failure gracefully", async () => {
    writeTextMock.mockRejectedValueOnce(new Error("Copy failed"));

    const { copyToClipboard, isCopied } = useCopyContent();
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await copyToClipboard("oops");

    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to copy: ",
      expect.any(Error),
    );

    expect(isCopied.value).toBe(false);

    consoleSpy.mockRestore();
  });
});
