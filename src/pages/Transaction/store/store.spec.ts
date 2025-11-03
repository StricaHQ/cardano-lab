/* eslint-disable @typescript-eslint/no-explicit-any */
import { setActivePinia, createPinia } from "pinia";
import { describe, it, beforeEach, expect, vi } from "vitest";
import { useTransactionsStore } from "./store";
import { useInputStore } from "@/pages/Transaction/components/inputs/store/store";
import { useOutputStore } from "@/pages/Transaction/components/outputs/store/store";
import { useMintStore } from "@/pages/Transaction/components/mints/store/store";
import { useCertificateStore } from "@/pages/Transaction/components/certificates/store/store";
import { Network } from "@/enums/networks";
import { CertificateType } from "@stricahq/typhonjs/dist/types";
import BigNumber from "bignumber.js";

// --- Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => (store[key] = value)),
    clear: () => (store = {}),
  };
})();
Object.defineProperty(global, "localStorage", { value: localStorageMock });

// --- Mock TyphonJS
vi.mock("@stricahq/typhonjs", () => {
  class FakeTx {
    addInput = vi.fn();
    addOutput = vi.fn();
    addCertificate = vi.fn();
    addMint = vi.fn();
    addWitness = vi.fn();
    getFee = vi.fn(() => BigNumber(100000));
    prepareTransaction = vi.fn().mockReturnThis();
    buildTransaction = vi.fn(() => ({
      hash: "fakehash",
      payload: "unsignedTx",
      transactionHash: "fakehash",
      unsignedTransaction: "unsignedTx",
    }));
  }

  return {
    Transaction: FakeTx,
    NativeScriptFactory: {
      fromCliJSON: vi.fn(() => ({
        json: () => ({}),
        policyId: () => Buffer.from("policyid"),
      })),
    },
    utils: {
      getAddressFromString: vi.fn(() => "addr_test1xyz..."),
    },
  };
});

// --- Mock account store (wallet)
vi.mock("@/stores/accountStore/accountStore", () => ({
  useAccountStore: vi.fn(() => ({
    account: {
      getReceiveAddressDetails: () => ({ bech32: "addr_test1xyz..." }),
      getStakeAddress: () => "stake_test1uqr...",
    },
  })),
}));

describe("useTransactionsStore (integration tests)", () => {
  let store: ReturnType<typeof useTransactionsStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useTransactionsStore();
    localStorage.clear();
  });

  // ✅ Test 1 — Initializes correctly
  it("initializes with proper default state", () => {
    expect(store.transaction).toBeTruthy();
    expect(store.currentNetwork).toBeDefined();
    expect(store.trxSubmitEndPoint).toBeDefined();
    expect(store.fee).toBe("");
    expect(store.witnesses).toEqual([]);
  });

  // ✅ Test 2 — Updates network properly
  it("updates network and persists in localStorage", () => {
    store.updateNetwork(Network.MAINNET);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "cardanoLabSelectedNetwork",
      Network.MAINNET,
    );
    expect(store.currentNetwork).toBe(Network.MAINNET);
  });

  // ✅ Test 3 — Updates transaction submit endpoint
  it("updates transaction submit endpoint correctly", () => {
    store.updateTrxSubmitEndPoint("https://api.cardano.example");
    expect(store.trxSubmitEndPoint).toBe("https://api.cardano.example");
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "trxSubmitEndPoint",
      "https://api.cardano.example",
    );
  });

  // ✅ Test 4 — Updates witnesses
  it("updates witnesses and adds them to transaction", () => {
    const mockWitnesses = [{ vkey: "abc" }, { vkey: "def" }];
    store.updateWitnesses(mockWitnesses as any);
    expect(store.witnesses).toEqual(mockWitnesses);
  });

  // ✅ Test 5 — Builds transaction successfully (with all real sub-stores)
  it("builds transaction successfully without throwing", () => {
    const inputStore = useInputStore();
    const outputStore = useOutputStore();
    const mintStore = useMintStore();
    const certStore = useCertificateStore();

    // --- Fake input
    inputStore.inputs[0] = {
      id: 1,
      txId: "tx123",
      index: "0",
      amount: "10",
      address: "addr_test1xyz...",
      tokens: [],
    };

    // --- Fake output
    outputStore.outputs[0] = {
      id: 0,
      amount: "5",
      address: "addr_test1abc...",
      tokens: [],
    };

    // --- Fake mint
    mintStore.addMint();
    const mint = mintStore.mints[0];
    mint.policyScript = JSON.stringify({ type: "sig", keyHash: "abc123" });
    mint.assets.push({ id: 1, assetName: "assetHex", amount: "1000" });

    // --- Fake certificate
    certStore.certificates[0] = {
      id: 1,
      certificateType: CertificateType.STAKE_KEY_REGISTRATION,
      stakePath: "1852'/1815'/0'/2/0",
      deposit: "2000000",
      address: {
        stakeCredential: {
          hash: "fakeStakeHash",
          type: 0,
        },
      },
    } as any;

    expect(() => store.buildTransaction()).not.toThrow();
    expect(store.transactionResponse.transactionHash).toBe("fakehash");
    expect(store.transactionResponse.unsignedTransaction).toBe("unsignedTx");
    expect(store.fee).toBeTruthy();
  });

  // ✅ Test 6 — Resets all data and sub-stores
  it("resets store and all sub-stores", () => {
    store.reset();

    const inputStore = useInputStore();
    const outputStore = useOutputStore();
    const mintStore = useMintStore();
    const certStore = useCertificateStore();

    expect(store.fee).toBe("");
    expect(store.signedTransactionCBOR).toBe("");
    expect(store.transactionResponse.transactionHash).toBe("");
    expect(inputStore.inputs.length).toBe(1);
    expect(outputStore.outputs.length).toBe(1);
    expect(mintStore.mints.length).toBe(0);
    expect(certStore.certificates.length).toBe(0);
  });
});
