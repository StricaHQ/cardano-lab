import { setActivePinia, createPinia } from "pinia";
import { useInputStore } from "./store";
import { describe, beforeEach, it, expect } from "vitest";

describe("useInputStore", () => {
  let store: ReturnType<typeof useInputStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useInputStore();
    store.reset();
  });

  // 1 — initializes correctly
  it("initializes with one empty input", () => {
    expect(store.inputs.length).toBe(1);
    const first = store.inputs[0];
    expect(first.id).toBe(0);
    expect(first.txId).toBe("");
    expect(first.index).toBe("");
    expect(first.amount).toBe("");
    expect(first.address).toBe("");
    expect(first.tokens).toEqual([]);
  });

  // 2 — adds a new input correctly
  it("adds new inputs with unique IDs", () => {
    store.addInput();
    store.addInput();

    expect(store.inputs.length).toBe(3);
    expect(store.inputs[1].id).toBe(1);
    expect(store.inputs[2].id).toBe(2);
  });

  // 3 — retrieves input by ID
  it("returns correct input by id", () => {
    const input = store.getInputById(0);
    expect(input).toBeDefined();
    expect(input?.id).toBe(0);
  });

  // 4 — sets input fields correctly
  it("updates txId, index, amount, and address fields", () => {
    store.setInputField(0, "txId", "abc123");
    store.setInputField(0, "index", "1");
    store.setInputField(0, "amount", "1000");
    store.setInputField(0, "address", "addr_test1xyz...");

    const updated = store.getInputById(0);
    expect(updated?.txId).toBe("abc123");
    expect(updated?.index).toBe("1");
    expect(updated?.amount).toBe("1000");
    expect(updated?.address).toBe("addr_test1xyz...");
  });

  // 5 — adds tokens to an input
  it("adds a token under correct input", () => {
    store.addToken({
      trxId: 0,
      policyId: "pid1",
      assetName: "TOKEN",
      amount: "5",
    });

    const input = store.getInputById(0);
    expect(input?.tokens.length).toBe(1);
    expect(input?.tokens[0]).toMatchObject({
      policyId: "pid1",
      assetName: "TOKEN",
      amount: "5",
    });
  });

  // 6 — deletes token by id correctly
  it("deletes the correct token safely", () => {
    store.addToken({
      trxId: 0,
      policyId: "pid1",
      assetName: "AAA",
      amount: "10",
    });

    const tokens = store.getInputById(0)?.tokens ?? [];
    expect(tokens.length).toBe(1);

    const tokenId = tokens[0].id;
    store.deleteToken({ trxId: 0, tokenId });

    expect(store.getInputById(0)?.tokens.length).toBe(0);
  });

  // 7 — clears an input fully
  it("clears txId, index, amount, address, and tokens", () => {
    store.setInputField(0, "txId", "tx_abc");
    store.setInputField(0, "index", "2");
    store.setInputField(0, "amount", "500");
    store.setInputField(0, "address", "addr_test1qrs...");
    store.addToken({
      trxId: 0,
      policyId: "pidX",
      assetName: "TKN",
      amount: "1",
    });

    store.clearInput(0);

    const input = store.getInputById(0);
    expect(input?.txId).toBe("");
    expect(input?.index).toBe("");
    expect(input?.amount).toBe("");
    expect(input?.address).toBe("");
    expect(input?.tokens.length).toBe(0);
  });

  // 8 — deletes an input and auto-adds one if empty
  it("deletes input and adds one new when all removed", () => {
    store.deleteInput(0);
    expect(store.inputs.length).toBe(1);
    expect(store.inputs[0].id).toBe(1);
  });

  // 9 — resets store to initial state
  it("resets to clean initial state", () => {
    store.addInput();
    store.setInputField(0, "txId", "tx1");
    store.addToken({
      trxId: 0,
      policyId: "pid",
      assetName: "TT",
      amount: "3",
    });

    store.reset();

    expect(store.inputs.length).toBe(1);
    const first = store.inputs[0];
    expect(first.txId).toBe("");
    expect(first.index).toBe("");
    expect(first.amount).toBe("");
    expect(first.address).toBe("");
    expect(first.tokens).toEqual([]);
  });
});
