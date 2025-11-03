import { useAccountStore } from "@/stores/accountStore/accountStore";
import type { CertificateTrxItem } from "@/types/transactions";
import type { RewardAddress } from "@stricahq/typhonjs/dist/address";
import { CertificateType, type BipPath } from "@stricahq/typhonjs/dist/types";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useTransactionsStore } from "../../../store/store";

export const useCertificateStore = defineStore("CertificateStore", () => {
  const allowedCertificateType = {
    STAKE_KEY_REGISTRATION: CertificateType.STAKE_KEY_REGISTRATION,
    STAKE_DELEGATION: CertificateType.STAKE_DELEGATION,
  };

  const certificateId = ref<number>(0);

  const certificates = ref<Array<CertificateTrxItem>>([]);

  const addCertificate = (type = CertificateType.STAKE_KEY_REGISTRATION) => {
    const stakeAddress = useAccountStore().account?.getStakeAddress();
    certificates.value.push({
      id: certificateId.value++,
      address: stakeAddress?.address as RewardAddress,
      stakePath: stakeAddress?.stakePath as BipPath,
      deposit:
        type === CertificateType.STAKE_KEY_REGISTRATION
          ? useTransactionsStore().protocolParams.stakeKeyDeposit.toString()
          : "",
      poolHash: "",
      certificateType: type,
    });
  };

  const getCertificateById = (id: number) => {
    return certificates.value.find((certificate) => certificate.id === id);
  };

  const setCertificateField = (
    id: number,
    inputField: "poolHash",
    value: string,
  ) => {
    const certificate = getCertificateById(id);
    if (!certificate) return;
    certificate[inputField] = value;
  };

  const deleteCertificate = (id: number) => {
    certificates.value = certificates.value.filter(
      (certificates) => certificates.id !== id,
    );
  };

  const reset = () => {
    certificateId.value = 0;
    certificateId.value = 0;
    certificates.value = [];
  };
  return {
    allowedCertificateType,
    certificates,
    addCertificate,
    getCertificateById,
    setCertificateField,
    deleteCertificate,
    reset,
  };
});
