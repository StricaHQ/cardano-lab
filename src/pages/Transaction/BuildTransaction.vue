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
            v-for="(item, index) in inputTrxForm"
            :key="item"
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
            v-for="(item, index) in outputTrxForm"
            :key="item"
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
          class="borderColor border rounded-md bg-white w-full md:w-[600px] px-4 flex justify-start items-center h-10"
        >
          <span class="textColor2 text-sm">0.123456</span>
        </div>
      </div>
    </div>
    <AppButton size="lg" btnClass="bgGradient max-w-max"
      ><span class="text-sm text-white">Sign Transaction</span></AppButton
    >
  </div>
</template>

<script lang="ts">
import { computed } from "vue";
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

    return {
      inputTrxForm,
      addInputTransaction,
      outputTrxForm,
      addOutputTransaction,
    };
  },
};
</script>
