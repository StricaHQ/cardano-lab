<template>
  <div class="flex flex-col gap-y-5">
    <div>
      <span class="textColor font-bold text-xl">Build Transaction</span>
    </div>
    <div class="flex flex-col gap-y-4">
      <div
        class="w-full borderColor border rounded-md p-4 cardBackgroundColor1 flex flex-col gap-y-2"
      >
        <div class="flex items-center gap-x-2">
          <div class="w-3 h-3 rounded-full bg-secondary"></div>
          <div>
            <span class="textColor1 text-sm font-medium">INPUTS</span>
          </div>
        </div>
        <div class="flex flex-col gap-y-4">
          <InputForm
            ref="inputFrom"
            v-for="(item, index) in inputTrxForm"
            :key="index"
            :trxCount="index + 1"
            :trxItemId="item.id"
          />
          <AppButton
            @onClick="addInputTransaction"
            btnClass="bg-secondary max-w-max"
          >
            <span class="text-white text-xs">Add Input</span></AppButton
          >
        </div>
      </div>
      <div
        class="w-full borderColor border rounded-md p-4 cardBackgroundColor1 flex flex-col gap-y-2"
      >
        <div class="flex items-center gap-x-2">
          <div class="w-3 h-3 rounded-full bg-secondary"></div>
          <div>
            <span class="textColor1 text-sm font-medium">OUTPUTS</span>
          </div>
        </div>
        <div class="flex flex-col gap-y-4">
          <OutputForm
            ref="outputForm"
            v-for="(item, index) in outputTrxForm"
            :key="index"
            :trxCount="index + 1"
            :trxItemId="item.id"
          />
          <AppButton
            @onClick="addOutputTransaction"
            btnClass="bg-secondary max-w-max"
          >
            <span class="text-white text-xs">Add Output</span></AppButton
          >
        </div>
      </div>
    </div>
    <div>
      <div
        class="w-full borderColor border rounded-md p-4 cardBackgroundColor1 flex flex-col gap-y-2"
      >
        <div>
          <span class="textColor1 text-sm font-medium">Fee</span>
        </div>
        <div
          class="borderColor border rounded-md bg-gray-100 cursor-not-allowed w-full md:w-[600px] px-4 flex justify-start items-center h-10"
        >
          <span class="textColor2 text-sm">{{ fee }}</span>
        </div>
      </div>
    </div>
    <AppButton
      size="lg"
      btnClass="bgGradient max-w-max"
      @onClick="buildTransaction"
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
      </div>
      <div class="border-b borderColor w-full"></div>
      <div class="flex gap-4">
        <div class="textColor1 flex min-w-48">Unsigned Transaction</div>
        <div class="flex break-all">
          {{ transactionResponse.unsignedTransaction || "----" }}
        </div>
      </div>
    </div>
  </div>
</template>
<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script lang="ts">
import { computed, ref } from "vue";
import InputForm from "./components/InputForm.vue";
import AppButton from "@/components/buttons/AppButton.vue";
import { useTransactionsStore } from "./store";
import OutputForm from "./components/OutputForm.vue";
export default {
  components: { InputForm, AppButton, OutputForm },
  setup() {
    const trxStore = useTransactionsStore();

    const inputTrxForm = computed(() => {
      return trxStore.inputTrxItems;
    });

    const outputTrxForm = computed(() => {
      return trxStore.outputTrxItems;
    });

    function addInputTransaction() {
      trxStore.addInputTrx();
    }

    function addOutputTransaction() {
      trxStore.addOutputTrx();
    }

    const outputForm = ref();
    const inputFrom = ref();

    function buildTransaction() {
      //if any of the fields from input or output forms invalid, restrict the build transaction
      let isInputFormsHaveValidData = true;
      let isOutputFormsHaveValidData = true;

      inputFrom.value.forEach((form: any) => {
        isInputFormsHaveValidData = form.isFormValid();
      });

      outputForm.value.forEach((form: any) => {
        isOutputFormsHaveValidData = form.isFormValid();
      });

      if (isInputFormsHaveValidData && isOutputFormsHaveValidData) {
        trxStore.buildTransaction();
      }
    }

    const fee = computed(() => trxStore.fee);

    const transactionResponse = computed(() => trxStore.transactionResponse);

    return {
      inputTrxForm,
      addInputTransaction,
      outputTrxForm,
      addOutputTransaction,
      fee,
      buildTransaction,
      transactionResponse,
      outputForm,
      inputFrom,
    };
  },
};
</script>
