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
            v-for="(input, index) in inputs"
            :key="input.id"
            :index="index + 1"
            :id="input.id"
          />
          <AppButton @onClick="addInput" btnClass="bg-secondary max-w-max">
            <span class="text-white text-xs">Add Input</span>
          </AppButton>
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
            v-for="(output, index) in outputs"
            :key="output.id"
            :index="index + 1"
            :id="output.id"
          />
          <AppButton @onClick="addOutput" btnClass="bg-secondary max-w-max">
            <span class="text-white text-xs">Add Output</span></AppButton
          >
        </div>
      </div>
      <div class="w-full card1 flex flex-col gap-y-2">
        <div class="flex items-center gap-x-2">
          <div class="w-2 h-2 rounded-full bg-gray-800"></div>
          <div>
            <span class="textColor1 text-sm font-medium">MINTS</span>
          </div>
        </div>
        <div class="flex flex-col gap-y-4">
          <MintForm
            ref="mintForm"
            v-for="(mint, index) in mints"
            :key="mint.id"
            :index="index + 1"
            :id="mint.id"
          />
          <AppButton @onClick="addMint" btnClass="bg-secondary max-w-max">
            <span class="text-white text-xs">Add Mint</span></AppButton
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
            v-for="(certificate, index) in certificates"
            :key="certificate.id"
            :index="index + 1"
            :id="certificate.id"
          />
          <div>
            <AddNewCertificate :isAccountAvailable="isAccountAvailable" />
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
import { computed, defineComponent, ref } from "vue";
import { useRouter } from "vue-router";

import { createWitnesses } from "@/lib/wallet";
import type { Account } from "@/lib/account";

import InputForm from "./components/inputs/inputForm.vue";
import OutputForm from "./components/outputs/outputForm.vue";
import MintForm from "./components/mints/mintForm.vue";
import CertificateForm from "./components/certificates/certificateForm.vue";

import { useAccountStore } from "@/stores/accountStore";
import { useTransactionsStore } from "./store";
import { useInputStore } from "./components/inputs/store";
import { useOutputStore } from "./components/outputs/store";
import { useMintStore } from "./components/mints/store";
import { useCertificateStore } from "./components/certificates/store";

import CopyButton from "@/components/buttons/CopyButton.vue";
import AppButton from "@/components/buttons/AppButton.vue";
import AddNewCertificate from "./components/certificates/addNewCertificate.vue";

export default defineComponent({
  components: {
    InputForm,
    AppButton,
    OutputForm,
    MintForm,
    CertificateForm,
    CopyButton,
    AddNewCertificate,
  },
  setup() {
    const router = useRouter();

    const trxStore = useTransactionsStore();
    const inputStore = useInputStore();
    const outputStore = useOutputStore();
    const mintStore = useMintStore();
    const certificateStore = useCertificateStore();
    const accountStore = useAccountStore();

    const isAccountAvailable = computed(() =>
      accountStore.account?.xpub ? true : false,
    );

    const certificates = computed(() => {
      return certificateStore.certificates;
    });

    const inputs = computed(() => {
      return inputStore.inputs;
    });

    const outputs = computed(() => {
      return outputStore.outputs;
    });

    const mints = computed(() => mintStore.mints);

    const addInput = () => {
      inputStore.addInput();
    };

    const addOutput = () => {
      outputStore.addOutput();
    };

    const addCertificate = () => {
      certificateStore.addCertificate();
    };

    const addMint = () => {
      mintStore.addMint();
    };

    const inputFrom = ref();
    const outputForm = ref();
    const certificateForm = ref([]);
    const mintForm = ref([]);

    const buildTransaction = () => {
      //if any of the fields from input, output or certificate forms invalid, restrict the build transaction
      let areInputFormsHaveValidData = true;
      let areOutputFormsHaveValidData = true;
      let areCertificateFormsHaveValidData = true;
      let areMintFormsHaveValidData = true;

      inputFrom.value.forEach((form: any) => {
        if (!form.isFormValid() && areInputFormsHaveValidData)
          areInputFormsHaveValidData = false;
      });

      outputForm.value.forEach((form: any) => {
        if (!form.isFormValid() && areOutputFormsHaveValidData)
          areOutputFormsHaveValidData = false;
      });

      certificateForm.value.forEach((form: any) => {
        if (!form.isFormValid() && areCertificateFormsHaveValidData)
          areCertificateFormsHaveValidData = false;
      });

      mintForm.value.forEach((form: any) => {
        if (!form.isFormValid() && areMintFormsHaveValidData)
          areMintFormsHaveValidData = form.isFormValid();
      });

      if (
        areInputFormsHaveValidData &&
        areOutputFormsHaveValidData &&
        areCertificateFormsHaveValidData &&
        areMintFormsHaveValidData
      ) {
        trxStore.buildTransaction();
      }
    };

    const fee = computed(() => trxStore.fee);

    const transactionResponse = computed(() => trxStore.transactionResponse);

    const signTransaction = () => {
      createCBOR();
      router.push("/transaction/signTransaction").then(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
      });
    };

    const createCBOR = () => {
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
    };

    const viewCBOR = () => {
      createCBOR();
      router.push("/cbor/cborView").then(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
      });
    };

    return {
      inputFrom,
      inputs,
      addInput,

      outputs,
      addOutput,
      outputForm,

      mintForm,
      mints,
      addMint,

      certificates,
      addCertificate,
      certificateForm,

      fee,
      buildTransaction,
      transactionResponse,
      signTransaction,
      isAccountAvailable,

      viewCBOR,
    };
  },
});
</script>
