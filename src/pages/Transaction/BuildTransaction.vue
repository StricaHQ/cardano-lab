<template>
  <div class="flex flex-col gap-y-5">
    <div
      v-show="!isAccountAvailable"
      class="text-sm text-red-500 border border-red-300 bg-red-500/10 px-2 py-2 rounded-md"
    >
      No account found. Please create an account to build a transaction.
    </div>
    <div>
      <span class="textColor font-bold text-xl">Build Transaction</span>
    </div>
    <div class="flex flex-col gap-y-4">
      <div class="w-full card1 flex flex-col gap-y-2">
        <div class="flex items-center gap-x-2">
          <div class="w-2 h-2 rounded-full bg-gray-800"></div>
          <div>
            <span class="textColor1 text-sm font-medium">INPUTS</span>
          </div>
        </div>
        <div class="flex flex-col gap-y-4">
          <InputForm
            ref="inputFrom"
            v-for="(item, index) in inputTrxForm"
            :key="item.id"
            :trxCount="index + 1"
            :trxItemId="item.id"
          />
          <AppButton @onClick="addInputTrx" btnClass="bg-secondary max-w-max">
            <span class="text-white text-xs">Add Input</span></AppButton
          >
        </div>
      </div>
      <div class="w-full card1 flex flex-col gap-y-2">
        <div class="flex items-center gap-x-2">
          <div class="w-2 h-2 rounded-full bg-gray-800"></div>
          <div>
            <span class="textColor1 text-sm font-medium">OUTPUTS</span>
          </div>
        </div>
        <div class="flex flex-col gap-y-4">
          <OutputForm
            ref="outputForm"
            v-for="(item, index) in outputTrxForm"
            :key="item.id"
            :trxCount="index + 1"
            :trxItemId="item.id"
          />
          <AppButton @onClick="addOutputTrx" btnClass="bg-secondary max-w-max">
            <span class="text-white text-xs">Add Output</span></AppButton
          >
        </div>
      </div>
      <div class="w-full card1 flex flex-col gap-y-2">
        <div class="flex items-center gap-x-2">
          <div class="w-2 h-2 rounded-full bg-gray-800"></div>
          <div>
            <span class="textColor1 text-sm font-medium">CERTIFICATE</span>
          </div>
        </div>
        <div class="flex flex-col gap-y-4">
          <CertificateForm
            ref="certificateForm"
            v-for="(item, index) in certificateTrxForm"
            :key="item.id"
            :trxCount="index + 1"
            :trxItemId="item.id"
          />
          <div>
            <div class="max-w-80 w-full relative" ref="certificatesDropdownRef">
              <AppButton
                btnClass="bg-secondary max-w-max text-white text-xs gap-4 "
                :isDisabled="!isAccountAvailable"
                @click="openCertificatesDropdown"
              >
                <span class="">Add Certificate</span>
                <ChevronDown
                  class="size-3 duration-200"
                  :class="isCertificatesDropdownOpen ? 'rotate-180 ' : ''"
                />
              </AppButton>
              <div
                v-if="isCertificatesDropdownOpen"
                class="absolute top-9 right-0 bg-gray-100 border border-gray-200 rounded p-1 w-full shadow-lg"
              >
                <div
                  v-for="type in allowedCertificateType"
                  :key="type"
                  class="p-2 hover:bg-gray-200 rounded text-sm capitalize cursor-pointer"
                  @click.stop="updateCertificateType(type)"
                >
                  {{ getCertificateTypeInText(type) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div
        class="w-full borderColor border rounded-md p-4 cardBackgroundColor1 flex flex-col gap-y-2"
      >
        <label class="textColor2 text-xs">Fee</label>
        <div class="textColor1 text-sm">{{ fee || "----" }}</div>
      </div>
    </div>

    <AppButton
      size="lg"
      btnClass="bgGradient max-w-max"
      @onClick="buildTransaction"
      :isDisabled="!isAccountAvailable"
    >
      <span class="text-sm text-white">Build Transaction</span>
    </AppButton>

    <div
      v-if="
        transactionResponse.transactionHash ||
        transactionResponse.unsignedTransaction
      "
      class="border borderColor rounded-md p-4 text-sm space-y-2 mt-8 bg-primary/10"
    >
      <div class="flex gap-4">
        <div class="textColor1 flex min-w-48">Transaction Hash</div>
        <div class="flex break-all">
          {{ transactionResponse.transactionHash || "----" }}
        </div>

        <CopyButton :content="transactionResponse.transactionHash" />
      </div>
      <div class="border-b borderColor w-full"></div>
      <div class="flex gap-4">
        <div class="textColor1 flex min-w-48">Unsigned Transaction</div>
        <div class="flex break-all">
          {{ transactionResponse.unsignedTransaction || "----" }}
        </div>
      </div>
    </div>
    <div
      v-if="
        transactionResponse.transactionHash ||
        transactionResponse.unsignedTransaction
      "
      class="flex gap-4"
    >
      <AppButton
        size="lg"
        btnClass="bgGradient max-w-max"
        @onClick="signTransaction"
      >
        <span class="text-sm text-white">Sign Transaction</span>
      </AppButton>
      <AppButton size="lg" btnClass="bgGradient max-w-max" @onClick="viewCBOR">
        <span class="text-sm text-white">View CBOR</span>
      </AppButton>
    </div>
  </div>
</template>
<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  ref,
} from "vue";
import InputForm from "./components/InputForm.vue";
import AppButton from "@/components/buttons/AppButton.vue";
import { useTransactionsStore } from "./store";
import OutputForm from "./components/OutputForm.vue";
import CopyButton from "@/components/buttons/CopyButton.vue";
import { createWitnesses } from "@/lib/wallet";
import { useRouter } from "vue-router";
import { useAccountStore } from "@/stores/openStore";
import type { Account } from "@/lib/account";
import CertificateForm from "./components/certificateForm.vue";
import ChevronDown from "@/assets/icons/chevronDown.vue";
import { CertificateType } from "@stricahq/typhonjs/dist/types";

export default defineComponent({
  components: {
    InputForm,
    AppButton,
    OutputForm,
    CertificateForm,
    CopyButton,
    ChevronDown,
  },
  setup() {
    const trxStore = useTransactionsStore();
    const router = useRouter();

    const certificateTrxForm = computed(() => {
      return trxStore.certificateTrxItems;
    });

    const inputTrxForm = computed(() => {
      return trxStore.inputTrxItems;
    });

    const outputTrxForm = computed(() => {
      return trxStore.outputTrxItems;
    });

    function addInputTrx() {
      trxStore.addInputTrx();
    }

    function addOutputTrx() {
      trxStore.addOutputTrx();
    }

    function addCertificateTrx() {
      trxStore.addCertificateTrx();
    }

    const outputForm = ref();
    const inputFrom = ref();
    const certificateForm = ref([]);

    function buildTransaction() {
      //if any of the fields from input, output or certificate forms invalid, restrict the build transaction
      let isInputFormsHaveValidData = true;
      let isOutputFormsHaveValidData = true;
      let isCertificateFormsHaveValidData = true;

      inputFrom.value.forEach((form: any) => {
        isInputFormsHaveValidData = form.isFormValid();
      });

      outputForm.value.forEach((form: any) => {
        isOutputFormsHaveValidData = form.isFormValid();
      });

      certificateForm.value.forEach((form: any) => {
        isCertificateFormsHaveValidData = form.isFormValid();
      });

      if (
        isInputFormsHaveValidData &&
        isOutputFormsHaveValidData &&
        isCertificateFormsHaveValidData
      ) {
        trxStore.buildTransaction();
      }
    }

    const fee = computed(() => trxStore.fee);

    const accountStore = useAccountStore();

    const transactionResponse = computed(() => trxStore.transactionResponse);

    const isAccountAvailable = computed(() =>
      accountStore.account?.xpub ? true : false,
    );
    const signTransaction = () => {
      createCBOR();
      router.push("/transaction/signTransaction");
    };

    function createCBOR() {
      const requiredSigners = trxStore.transaction.getRequiredWitnesses();
      const account = accountStore.account;

      const witnesses = createWitnesses({
        requiredSigners,
        account: account as Account,
        txHash: trxStore.transaction.getTransactionHash(),
      });

      trxStore.updateWitnesses(witnesses);

      trxStore.signedTransactionCBOR =
        trxStore.transaction.buildTransaction().payload;
    }

    const isCertificatesDropdownOpen = ref(false);
    const certificatesDropdownRef = ref();

    const selectedCertificateType = ref<CertificateType>(
      CertificateType.STAKE_KEY_REGISTRATION,
    );

    const updateCertificateType = (type: CertificateType) => {
      trxStore.addCertificateTrx(type);
      closeCertificatesDropdown();
    };

    const openCertificatesDropdown = () => {
      isCertificatesDropdownOpen.value = true;
    };

    const closeCertificatesDropdown = () => {
      isCertificatesDropdownOpen.value = false;
    };

    function onClickOutside(event: MouseEvent) {
      if (
        isCertificatesDropdownOpen.value &&
        certificatesDropdownRef.value &&
        !certificatesDropdownRef.value.contains(event.target as Node)
      ) {
        closeCertificatesDropdown();
      }
    }

    function getCertificateTypeInText(type: CertificateType) {
      switch (type) {
        case CertificateType.STAKE_KEY_REGISTRATION:
          return "Stake Key Registration";
        case CertificateType.STAKE_DELEGATION:
          return "Stake Pool Delegation";
        default:
          return type;
      }
    }

    function viewCBOR() {
      createCBOR();
      router.push("/cbor/cborView");
    }

    onMounted(() => {
      document.addEventListener("click", onClickOutside);
    });

    onBeforeUnmount(() => {
      document.removeEventListener("click", onClickOutside);
    });

    return {
      inputTrxForm,
      addInputTrx,
      outputTrxForm,
      addOutputTrx,
      fee,
      buildTransaction,
      transactionResponse,
      outputForm,
      inputFrom,
      signTransaction,
      isAccountAvailable,

      //certificate
      certificateTrxForm,
      addCertificateTrx,
      certificateForm,
      CertificateType,
      isCertificatesDropdownOpen,
      selectedCertificateType,
      certificatesDropdownRef,
      updateCertificateType,
      openCertificatesDropdown,
      closeCertificatesDropdown,
      getCertificateTypeInText,
      allowedCertificateType: trxStore.allowedCertificateType,
      viewCBOR,
    };
  },
});
</script>
