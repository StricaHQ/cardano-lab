/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount } from "@vue/test-utils";
import { setActivePinia, createPinia } from "pinia";
import { describe, it, beforeEach, expect, vi } from "vitest";
import BuildTransaction from "@/pages/Transaction/buildTransaction/buildTransaction.vue";
import { useTransactionsStore } from "@/pages/Transaction/store/store";

// --- Mock child components (simplify rendering)
vi.mock(
  "@/pages/Transaction/components/inputs/inputForm/inputForm.vue",
  () => ({
    default: {
      name: "InputForm",
      template: "<div></div>",
      methods: { isFormValid: vi.fn(() => true) },
    },
  }),
);

vi.mock(
  "@/pages/Transaction/components/outputs/outputForm/outputForm.vue",
  () => ({
    default: {
      name: "OutputForm",
      template: "<div></div>",
      methods: { isFormValid: vi.fn(() => true) },
    },
  }),
);

vi.mock("@/pages/Transaction/components/mints/mintForm/mintForm.vue", () => ({
  default: {
    name: "MintForm",
    template: "<div></div>",
    methods: { isFormValid: vi.fn(() => true) },
  },
}));

vi.mock(
  "@/pages/Transaction/components/certificates/certificateForm/certificateForm.vue",
  () => ({
    default: {
      name: "CertificateForm",
      template: "<div></div>",
      methods: { isFormValid: vi.fn(() => true) },
    },
  }),
);

// --- Other small components
vi.mock(
  "@/pages/Transaction/components/certificates/addNewCertificate/addNewCertificate.vue",
  () => ({
    default: { name: "AddNewCertificate", template: "<div></div>" },
  }),
);

vi.mock("@/components/buttons/appButton/appButton.vue", () => ({
  default: {
    name: "AppButton",
    props: ["onClick", "isDisabled"],
    emits: ["onClick"],
    template: `<button @click="$emit('onClick')" :disabled="isDisabled"><slot /></button>`,
  },
}));

vi.mock("@/components/buttons/copyButton/copyButton.vue", () => ({
  default: { name: "CopyButton", template: "<div></div>" },
}));

// --- Mock router
const pushMock = vi.fn(() => Promise.resolve());
vi.mock("vue-router", () => ({
  useRouter: () => ({ push: pushMock }),
}));

// --- Mock wallet function
vi.mock("@/lib/wallet", () => ({
  createWitnesses: vi.fn(() => ["mockWitness"]),
}));

// --- Mock account store
vi.mock("@/stores/accountStore/accountStore", () => ({
  useAccountStore: vi.fn(() => ({
    account: { xpub: "mock-xpub", name: "acc1" },
  })),
}));

describe("BuildTransaction.vue", () => {
  let trxStore: ReturnType<typeof useTransactionsStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    trxStore = useTransactionsStore();
    vi.spyOn(trxStore, "buildTransaction").mockImplementation(() => {});
    vi.clearAllMocks();
  });

  // 1 All forms valid → buildTransaction should trigger
  it("calls trxStore.buildTransaction when all forms are valid", async () => {
    const wrapper = mount(BuildTransaction);

    (wrapper.vm as any).inputFrom = [{ isFormValid: () => true }];
    (wrapper.vm as any).outputForm = [{ isFormValid: () => true }];
    (wrapper.vm as any).certificateForm = [{ isFormValid: () => true }];
    (wrapper.vm as any).mintForm = [{ isFormValid: () => true }];

    await (wrapper.vm as any).buildTransaction();
    expect(trxStore.buildTransaction).toHaveBeenCalledTimes(1);
  });

  // 2 Invalid form blocks buildTransaction
  it("does not call trxStore.buildTransaction if any form invalid", async () => {
    const wrapper = mount(BuildTransaction);

    (wrapper.vm as any).inputFrom = [{ isFormValid: () => false }];
    (wrapper.vm as any).outputForm = [{ isFormValid: () => true }];
    (wrapper.vm as any).certificateForm = [{ isFormValid: () => true }];
    (wrapper.vm as any).mintForm = [{ isFormValid: () => true }];

    await (wrapper.vm as any).buildTransaction();
    expect(trxStore.buildTransaction).not.toHaveBeenCalled();
  });

  // 3 Empty refs → safe fallback
  it("handles empty form refs gracefully", async () => {
    const wrapper = mount(BuildTransaction);

    (wrapper.vm as any).inputFrom = [];
    (wrapper.vm as any).outputForm = [];
    (wrapper.vm as any).certificateForm = [];
    (wrapper.vm as any).mintForm = [];

    await (wrapper.vm as any).buildTransaction();
    expect(trxStore.buildTransaction).toHaveBeenCalledTimes(1);
  });

  // 4 createCBOR works correctly
  it("createCBOR generates witnesses and sets signedTransactionCBOR", async () => {
    const { createWitnesses } = await import("@/lib/wallet");
    const wrapper = mount(BuildTransaction);

    trxStore.transaction = {
      getRequiredWitnesses: vi.fn(() => ["signer1"]),
      getTransactionHash: vi.fn(() => "txHash123"),
      buildTransaction: vi.fn(() => ({ payload: "CBOR123" })),
    } as any;
    trxStore.updateWitnesses = vi.fn();

    (wrapper.vm as any).createCBOR();

    expect(createWitnesses).toHaveBeenCalledWith({
      requiredSigners: ["signer1"],
      account: { xpub: "mock-xpub", name: "acc1" },
      txHash: "txHash123",
    });
    expect(trxStore.updateWitnesses).toHaveBeenCalledWith(["mockWitness"]);
    expect(trxStore.signedTransactionCBOR).toBe("CBOR123");
  });

  // 5 signTransaction calls createCBOR, navigates, scrolls
  it("signTransaction triggers createCBOR and navigates", async () => {
    global.scrollTo = vi.fn();
    const wrapper = mount(BuildTransaction);

    // ✅ Mock store internals like in createCBOR test
    trxStore.transaction = {
      getRequiredWitnesses: vi.fn(() => ["signer1"]),
      getTransactionHash: vi.fn(() => "txHash123"),
      buildTransaction: vi.fn(() => ({ payload: "CBOR123" })),
    } as any;

    trxStore.updateWitnesses = vi.fn();

    // Mock navigation + witnesses
    const { createWitnesses } = await import("@/lib/wallet");
    (createWitnesses as any).mockReturnValue(["mockWitness"]);

    await (wrapper.vm as any).signTransaction();

    expect(trxStore.updateWitnesses).toHaveBeenCalledWith(["mockWitness"]);
    expect(trxStore.signedTransactionCBOR).toBe("CBOR123");
    expect(pushMock).toHaveBeenCalledWith("/transaction/signTransaction");
    expect(global.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "instant",
    });
  });
});
