/* eslint-disable @typescript-eslint/no-explicit-any */

import { setActivePinia, createPinia } from "pinia";
import { describe, it, expect, beforeEach } from "vitest";
import { useCertificateStore } from "./store";
import { useTransactionsStore } from "@/pages/Transaction/store/store";
import { useAccountStore } from "@/stores/accountStore/accountStore";
import { CertificateType } from "@stricahq/typhonjs/dist/types";
import BigNumber from "bignumber.js";

describe("useCertificateStore", () => {
  let store: ReturnType<typeof useCertificateStore>;

  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);

    // Initialize all stores
    const trxStore = useTransactionsStore();
    trxStore.protocolParams = {
      minFeeA: new BigNumber(44),
      minFeeB: new BigNumber(155381),
      maxTxSize: 16384,
      maxValSize: 5000,
      keyDeposit: new BigNumber(2000000),
      poolDeposit: new BigNumber(500000000),
      lovelacePerUtxoWord: new BigNumber(34482),
      collateralPercent: 150,
      maxCollateralInputs: 3,
      coinsPerUtxoByte: new BigNumber(4310),
      stakeKeyDeposit: new BigNumber(2000000),
      languageView: {
        PlutusV1: new BigNumber(500),
        PlutusV2: new BigNumber(500),
      },
    } as any;

    const accountStore = useAccountStore();
    // If not initialized in app boot, inject mock data safely
    accountStore.account = {
      getStakeAddress: () => ({
        address: "stake_test1xyz",
        stakePath: "m/1852'/1815'/0'/2/0",
      }),
    } as any;

    store = useCertificateStore();
    store.reset();
  });

  // 1 Add Stake Key Registration
  it("adds a Stake Key Registration certificate correctly", () => {
    store.addCertificate(CertificateType.STAKE_KEY_REGISTRATION);

    expect(store.certificates.length).toBe(1);
    const cert = store.certificates[0];
    expect(cert.certificateType).toBe(CertificateType.STAKE_KEY_REGISTRATION);
    expect(cert.deposit).toBe("2000000");
    expect(cert.address).toBe("stake_test1xyz");
    expect(cert.stakePath).toBe("m/1852'/1815'/0'/2/0");
  });

  // 2 Add Stake Delegation
  it("adds a Stake Delegation certificate correctly (no deposit)", () => {
    store.addCertificate(CertificateType.STAKE_DELEGATION);

    const cert = store.certificates[0];
    expect(cert.certificateType).toBe(CertificateType.STAKE_DELEGATION);
    expect(cert.deposit).toBe("");
    expect(cert.poolHash).toBe("");
  });

  // 3 getCertificateById
  it("returns correct certificate by id", () => {
    store.addCertificate();
    const cert = store.getCertificateById(0);

    expect(cert?.id).toBe(0);
    expect(cert?.certificateType).toBe(CertificateType.STAKE_KEY_REGISTRATION);
  });

  // 4 setCertificateField
  it("updates poolHash correctly with setCertificateField", () => {
    store.addCertificate();
    store.setCertificateField(0, "poolHash", "deadbeef");
    expect(store.getCertificateById(0)?.poolHash).toBe("deadbeef");
  });

  // 5 deleteCertificate
  it("deletes the correct certificate by id", () => {
    store.addCertificate();
    store.addCertificate();
    expect(store.certificates.length).toBe(2);

    store.deleteCertificate(0);
    expect(store.certificates.length).toBe(1);
    expect(store.certificates[0].id).toBe(1);
  });

  // 6 reset
  it("resets store to initial state", () => {
    store.addCertificate();
    store.reset();

    expect(store.certificates.length).toBe(0);
    expect(store.certificates).toEqual([]);
  });

  // 7 allowedCertificateType mapping
  it("has valid allowedCertificateType mapping", () => {
    const values = Object.values(store.allowedCertificateType);
    expect(values).toContain(CertificateType.STAKE_KEY_REGISTRATION);
    expect(values).toContain(CertificateType.STAKE_DELEGATION);
  });
});
