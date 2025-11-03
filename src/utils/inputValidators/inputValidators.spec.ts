import { describe, it, expect } from "vitest";
import { isHexString } from "./inputValidators";

describe("isHexString", () => {
  // Valid hex strings

  //1
  it("returns true for valid lowercase hex strings", () => {
    expect(isHexString("abcdef")).toBe(true);
  });

  //2
  it("returns true for valid uppercase hex strings", () => {
    expect(isHexString("ABCDEF")).toBe(true);
  });

  //3
  it("returns true for valid mixed-case hex strings", () => {
    expect(isHexString("aBc123")).toBe(true);
  });

  // ❌ Invalid hex strings
  //1
  it("returns false for strings with non-hex characters", () => {
    expect(isHexString("xyz123")).toBe(false);
    expect(isHexString("12G45")).toBe(false);
  });

  //2
  it("returns false for empty strings", () => {
    expect(isHexString("")).toBe(false);
  });

  //3
  it("returns false for strings with spaces or symbols", () => {
    expect(isHexString("abc def")).toBe(false);
    expect(isHexString("123-456")).toBe(false);
  });
});
