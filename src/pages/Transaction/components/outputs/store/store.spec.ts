import { setActivePinia, createPinia } from "pinia";
import { useOutputStore } from "./store";
import { describe, beforeEach, it, expect } from "vitest";

describe("useOutputStore", () => {
  let store: ReturnType<typeof useOutputStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useOutputStore();
    store.reset();
  });

  // 1 — initializes correctly
  it("initializes with one empty output", () => {
    expect(store.outputs.length).toBe(1);
    const first = store.outputs[0];
    expect(first.id).toBe(0);
    expect(first.address).toBe("");
    expect(first.amount).toBe("");
    expect(first.tokens).toEqual([]);
  });

  // 2 — adds a new output correctly
  it("adds new outputs with unique IDs", () => {
    store.addOutput();
    store.addOutput();

    expect(store.outputs.length).toBe(3);
    expect(store.outputs[1].id).toBe(1);
    expect(store.outputs[2].id).toBe(2);
  });

  // 3 — retrieves output by ID
  it("returns correct output by id", () => {
    const output = store.getOutputById(0);
    expect(output).toBeDefined();
    expect(output?.id).toBe(0);
  });

  // 4 — sets output fields correctly
  it("updates address and amount fields", () => {
    store.setOutputFields(0, "address", "addr_test1xyz...");
    store.setOutputFields(0, "amount", "100");

    const updated = store.getOutputById(0);
    expect(updated?.address).toBe("addr_test1xyz...");
    expect(updated?.amount).toBe("100");
  });

  // 5 — adds tokens to an output
  it("adds a token under correct output", () => {
    store.addToken({
      id: 0,
      policyId: "pid1",
      assetName: "TOKEN",
      amount: "10",
    });

    const output = store.getOutputById(0);
    expect(output?.tokens.length).toBe(1);
    expect(output?.tokens[0]).toMatchObject({
      policyId: "pid1",
      assetName: "TOKEN",
      amount: "10",
    });
  });

  // 6 — deletes token by id correctly
  it("deletes the correct token safely", () => {
    store.addToken({
      id: 0,
      policyId: "pid1",
      assetName: "AAA",
      amount: "5",
    });

    const tokens = store.getOutputById(0)?.tokens ?? [];
    expect(tokens.length).toBe(1);

    const tokenId = tokens[0].id;
    store.deleteToken({ id: 0, tokenId });

    expect(store.getOutputById(0)?.tokens.length).toBe(0);
  });

  // 7 — clears an output fully
  it("clears address, amount, and tokens", () => {
    store.setOutputFields(0, "address", "addr_te¯st1...");
    store.setOutputFields(0, "amount", "500");
    store.addToken({
      id: 0,
      policyId: "pid1",
      assetName: "X",
      amount: "1",
    });

    store.clearOutput(0);

    const output = store.getOutputById(0);
    expect(output?.address).toBe("");
    expect(output?.amount).toBe("");
    expect(output?.tokens.length).toBe(0);
  });

  // 8 — deletes an output and auto-adds one if empty
  it("deletes output and adds one new when all removed", () => {
    store.deleteOutput(0);
    expect(store.outputs.length).toBe(1);
    expect(store.outputs[0].id).toBe(1);
  });

  // 9 — resets store to initial state
  it("resets to clean initial state", () => {
    store.addOutput();
    store.setOutputFields(0, "address", "addr_test");
    store.addToken({
      id: 0,
      policyId: "pid",
      assetName: "TT",
      amount: "1",
    });

    store.reset();

    expect(store.outputs.length).toBe(1);
    const first = store.outputs[0];
    expect(first.address).toBe("");
    expect(first.amount).toBe("");
    expect(first.tokens).toEqual([]);
  });
});
