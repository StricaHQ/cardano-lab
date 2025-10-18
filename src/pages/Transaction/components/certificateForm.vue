<template>
  <div class="cardWhite flex flex-col gap-y-4">
    <div class="headingBadge">
      <span>Certificate #{{ trxCount }}</span>
    </div>

    <div class="flex flex-col gap-y-3">
      <div class="flex flex-col gap-y-3 gap-x-4 w-full">
        <div class="w-full flex flex-col gap-y-1">
          <label class="inputLabel">Certificate</label>
          <div
            class="inputFieldBg border border-gray-100 h-10 px-4 textColor rounded-md w-full text-sm opacity-60 flex items-center cursor-not-allowed"
          >
            {{ getCertificateTypeInText(certificate.certificateType) }}
          </div>
        </div>
        <div
          class="w-full flex flex-col gap-y-1"
          v-if="certificate.certificateType == CertificateType.STAKE_DELEGATION"
        >
          <label class="inputLabel" for="address">Pool Hash</label>
          <input
            id="poolHash"
            class="inputField"
            type="text"
            placeholder="poolHash"
            v-model="poolHashField"
          />
          <div class="errorMessage">{{ poolHashErrorMessage }}</div>
        </div>
        <div class="w-full flex flex-col gap-y-1">
          <label class="inputLabel">Address</label>
          <div
            class="inputFieldBg border border-gray-100 h-10 px-4 textColor rounded-md w-full text-sm opacity-60 flex items-center cursor-not-allowed"
          >
            {{ addressField }}
          </div>
        </div>
        <div
          v-if="
            certificate?.certificateType ==
            CertificateType.STAKE_KEY_REGISTRATION
          "
          class="w-full flex flex-col gap-y-1"
        >
          <label class="inputLabel">Deposit</label>
          <div
            class="inputFieldBg border border-gray-100 h-10 px-4 textColor rounded-md w-full text-sm opacity-60 flex items-center cursor-not-allowed"
          >
            {{ depositField }}
          </div>
        </div>
      </div>
    </div>
    <div class="w-full flex justify-center md:justify-end mt-4">
      <div class="flex gap-x-4 flex-wrap gap-y-2">
        <AppButton
          size="sm"
          btnClass="border border-red-500 bg-red-50 space-x-2"
          @onClick="deleteTrxItem"
        >
          <Delete class="text-red-500 size-4" />
          <span class="text-xs text-red-500">Delete</span>
        </AppButton>
      </div>
    </div>
  </div>
</template>

<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="ts">
import AppButton from "@/components/buttons/AppButton.vue";
import { computed, ref, watch } from "vue";
import { useTransactionsStore } from "../store";
import Delete from "@/assets/icons/delete.vue";
import { type CertificateTrxItem } from "@/types/transactions";
import { isHexString } from "@/utils/inputValidators";
import { CertificateType } from "@stricahq/typhonjs/dist/types";
import { convertLovelaceToADA } from "@/utils/utils";
import BigNumber from "bignumber.js";

export default {
  components: {
    AppButton,
    Delete,
  },
  props: {
    trxCount: { type: Number, required: true },
    trxItemId: { type: Number, required: true },
  },
  setup(props) {
    const trxStore = useTransactionsStore();

    const certificate = computed(() => {
      return (
        trxStore.getCertificateTrxById(props.trxItemId) ||
        ({} as CertificateTrxItem)
      );
    });

    //poolHash
    const poolHashField = ref(certificate.value?.poolHash);
    const poolHashErrorMessage = ref("");

    watch(poolHashField, () => {
      trxStore.setCertificateFields(
        props.trxItemId,
        "poolHash",
        poolHashField.value as string,
      );
      poolHashErrorMessage.value = "";
    });

    //address
    const addressField = ref(certificate.value?.address.getBech32());

    //deposit
    const depositField = ref(
      convertLovelaceToADA(BigNumber(certificate.value?.deposit)),
    );

    function deleteTrxItem() {
      trxStore.deleteCertificateTrx(props.trxItemId);
    }

    function getCertificateTypeInText(type: CertificateType) {
      switch (type) {
        case CertificateType.STAKE_KEY_REGISTRATION:
          return "Stake Key Registration";
        case CertificateType.STAKE_DELEGATION:
          return "Stake Pool Delegation";
      }
    }

    function isFormValid() {
      if (
        certificate.value.certificateType === CertificateType.STAKE_DELEGATION
      )
        if (!poolHashField.value) {
          poolHashErrorMessage.value = "Required";
        } else if (!isHexString(poolHashField.value as string)) {
          poolHashErrorMessage.value =
            "Invalid format. Use only hexadecimal characters";
        }

      if (poolHashErrorMessage.value) return false;
      return true;
    }

    return {
      poolHashField,
      addressField,
      depositField,
      certificate,
      CertificateType,
      poolHashErrorMessage,
      deleteTrxItem,
      isFormValid,
      getCertificateTypeInText,
    };
  },
};
</script>
