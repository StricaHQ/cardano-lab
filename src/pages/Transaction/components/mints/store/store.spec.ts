import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useMintStore } from "./store";

describe("useMintStore", () => {
  let mintStore: ReturnType<typeof useMintStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    mintStore = useMintStore();
    mintStore.reset();
  });

  // 1️⃣ — Adds a new mint
  it("adds a new mint with empty fields", () => {
    mintStore.addMint();
    expect(mintStore.mints.length).toBe(1);
    const mint = mintStore.mints[0];
    expect(mint.id).toBe(0);
    expect(mint.policyScript).toBe("");
    expect(mint.assets).toEqual([]);
  });

  // 2️⃣ — Gets mint by id
  it("gets mint by ID correctly", () => {
    mintStore.addMint();
    mintStore.addMint();
    const mint = mintStore.getMintById(1);
    expect(mint?.id).toBe(1);
  });

  // 3️⃣ — setMintField updates policyScript
  it("sets mint field correctly", () => {
    mintStore.addMint();
    mintStore.setMintField(0, "policyScript", '{"keyHash": "abc"}');
    const mint = mintStore.getMintById(0);
    expect(mint?.policyScript).toBe('{"keyHash": "abc"}');
  });

  // 4️⃣ — addAsset adds asset with incrementing id
  it("adds new assets to a mint", () => {
    mintStore.addMint();
    mintStore.addAsset(0);
    mintStore.addAsset(0);
    const mint = mintStore.getMintById(0)!;
    expect(mint.assets.length).toBe(2);
    expect(mint.assets[0].id).toBe(0);
    expect(mint.assets[1].id).toBe(1);
  });

  // 5️⃣ — getMintAssetById finds correct asset
  it("finds asset by ID within mint", () => {
    mintStore.addMint();
    mintStore.addAsset(0);
    const mint = mintStore.getMintById(0)!;
    const asset = mintStore.getMintAssetById(mint, 0);
    expect(asset?.id).toBe(0);
  });

  // 6️⃣ — updateAsset updates correct field
  it("updates asset field correctly", () => {
    mintStore.addMint();
    mintStore.addAsset(0);
    mintStore.updateAsset({
      id: 0,
      assetId: 0,
      field: "assetName",
      value: "TOKENXYZ",
    });
    const mint = mintStore.getMintById(0)!;
    expect(mint.assets[0].assetName).toBe("TOKENXYZ");
  });

  // 7️⃣ — deleteAsset removes specific asset
  it("deletes an asset correctly", () => {
    mintStore.addMint();
    mintStore.addAsset(0);
    mintStore.addAsset(0);
    mintStore.deleteAsset({ id: 0, assetId: 0 });
    const mint = mintStore.getMintById(0)!;
    expect(mint.assets.length).toBe(1);
    expect(mint.assets[0].id).toBe(1);
  });

  // 8️⃣ — deleteAsset adds new blank asset if none left
  it("adds blank asset when last asset deleted", () => {
    mintStore.addMint();
    mintStore.addAsset(0);
    mintStore.deleteAsset({ id: 0, assetId: 0 });
    const mint = mintStore.getMintById(0)!;
    expect(mint.assets.length).toBe(1);
    expect(mint.assets[0].amount).toBe("");
  });

  // 9️⃣ — clearMint resets mint fields
  it("clears a mint completely", () => {
    mintStore.addMint();
    mintStore.addAsset(0);
    mintStore.setMintField(0, "policyScript", '{"key":1}');
    mintStore.clearMint(0);
    const mint = mintStore.getMintById(0)!;
    expect(mint.policyScript).toBe("");
    expect(mint.assets.length).toBe(0);
  });

  // 🔟 — deleteMint removes mint by ID
  it("deletes a mint by ID", () => {
    mintStore.addMint();
    mintStore.addMint();
    mintStore.deleteMint(0);
    expect(mintStore.mints.length).toBe(1);
    expect(mintStore.mints[0].id).toBe(1);
  });

  // 1️⃣1️⃣ — reset resets all counters and mints
  it("resets all data", () => {
    mintStore.addMint();
    mintStore.addAsset(0);
    mintStore.reset();
    expect(mintStore.mints.length).toBe(0);
    mintStore.addMint();
    expect(mintStore.mints[0].id).toBe(0);
  });
});
