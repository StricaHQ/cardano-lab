import { describe, it, expect } from "vitest";
import BigNumber from "bignumber.js";
import {
  convertADAToLovelace,
  convertLovelaceToADA,
  getCardanoScanTransactionURL,
  sanitizeAmount,
  onlyNumbers,
  formatToken,
} from "./utils";
import { Network } from "@/enums/networks";

describe("utilFunctions", () => {
  // 1 convert ADA to Lovelace
  it("converts ADA to Lovelace correctly", () => {
    const result = convertADAToLovelace(new BigNumber(1.5));
    expect(result.toString()).toBe("1500000");
  });

  // 2 convert Lovelace to ADA
  it("converts Lovelace to ADA correctly", () => {
    const result = convertLovelaceToADA(new BigNumber(1500000));
    expect(result.toString()).toBe("1.5");
  });

  // 3 check if returns correct cardanoscan URL for mainnet
  it("returns correct Cardanoscan URL for mainnet", () => {
    const url = getCardanoScanTransactionURL({
      currentNetwork: Network.MAINNET,
      transactionId: "abc123",
    });
    expect(url).toBe("https://cardanoscan.io/transaction/abc123");
  });

  // 4  check if returns correct cardanoscan URL for testnet
  it("returns correct Cardanoscan URL for preprod", () => {
    const url = getCardanoScanTransactionURL({
      currentNetwork: Network.PREPROD,
      transactionId: "abc123",
    });
    expect(url).toBe("https://preprod.cardanoscan.io/transaction/abc123");
  });

  //5 check if sanitizeAmount sanitizes amount correctly
  it("sanitizes amount correctly", () => {
    expect(sanitizeAmount("123.456789")).toBe("123.456789"); // already valid
    expect(sanitizeAmount("123.4567899")).toBe("123.456789"); // trims to 6 decimals
    expect(sanitizeAmount("12a3.45b6c")).toBe("123.456"); // removes invalid chars
    expect(sanitizeAmount("12.34.56")).toBe("12.3456"); // keeps only first dot
  });

  //6 check if onlyNumbers removes all non numeric chars
  it("keeps only numbers from string", () => {
    expect(onlyNumbers("abc123def456")).toBe("123456");
    expect(onlyNumbers("!@#789")).toBe("789");
  });

  //7 check if formatToken formats Tokens list properly
  it("formats tokens correctly", () => {
    const tokens = [
      { policyId: "p1", assetName: "a1", amount: new BigNumber(10) },
      { policyId: "p2", assetName: "a2", amount: new BigNumber(20) },
    ];

    expect(formatToken(tokens)).toEqual([
      { policyId: "p1", assetName: "a1", amount: "10" },
      { policyId: "p2", assetName: "a2", amount: "20" },
    ]);
  });

  //8 check if it returns empty array if no token passed to formatToken
  it("returns empty array if no tokens", () => {
    expect(formatToken(undefined)).toEqual([]);
  });
});
