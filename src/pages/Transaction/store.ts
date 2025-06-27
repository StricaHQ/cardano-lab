import type { InputTrxItem, OutputTrxItem } from "@/types/transactions";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useTransactionsStore = defineStore("transactionsStore", () => {
  const inputTrxId = ref<number>(0);
  const inputTokenId = ref<number>(0);

  const outputTrxId = ref<number>(0);
  const outputTokenId = ref<number>(0);

  //   input trx
  const inputTrxItems = ref<Array<InputTrxItem>>([
    {
      id: inputTrxId.value++,
      trxId: "",
      adaAmount: "",
      trxIndex: "",
      tokens: [],
    },
  ]);

  function addInputTrx() {
    inputTrxItems.value.push({
      id: inputTrxId.value++,
      trxId: "",
      adaAmount: "",
      trxIndex: "",
      tokens: [],
    });
  }

  function getInputTrxById(id: number) {
    return inputTrxItems.value.find((item) => item.id === id);
  }

  function setInputTrxFields(
    id: number,
    inputField: "trxId" | "trxIndex" | "adaAmount",
    value: string,
  ) {
    const trx = getInputTrxById(id);
    if (!trx) return;
    trx[inputField] = value;
  }

  function addTokensToInputTrx(trxId: number, name: string, amount: string) {
    const trx = getInputTrxById(trxId);
    if (!trx) return;
    trx.tokens.push({
      id: inputTokenId.value++,
      amount: amount,
      name: name,
    });
  }

  function deleteInputTrxToken(trxId: number, tokenId: number) {
    const trx = getInputTrxById(trxId);
    if (trx) {
      trx.tokens = trx.tokens.filter((item) => item.id !== tokenId);
    }
  }

  function clearInputTrxItem(trxId: number) {
    const trx = getInputTrxById(trxId);
    if (trx) {
      trx.tokens = [];
      trx.trxId = "";
      trx.trxIndex = "";
      trx.adaAmount = "";
    }
  }

  function deleteInputTrx(trxId: number) {
    inputTrxItems.value = inputTrxItems.value.filter(
      (item) => item.id !== trxId,
    );
    if (!inputTrxItems.value.length) {
      addInputTrx();
    }
  }

  //   output trx

  const outputTrxItems = ref<Array<OutputTrxItem>>([
    {
      id: outputTrxId.value++,
      address: "",
      adaAmount: "",
      tokens: [],
    },
  ]);

  function addOutputTrx() {
    outputTrxItems.value.push({
      id: outputTrxId.value++,
      address: "",
      adaAmount: "",
      tokens: [],
    });
  }

  function getOutputTrxById(id: number) {
    return outputTrxItems.value.find((item) => item.id === id);
  }

  function setOutputTrxFields(
    id: number,
    outputField: "address" | "adaAmount",
    value: string,
  ) {
    const trx = getOutputTrxById(id);
    if (!trx) return;
    trx[outputField] = value;
  }

  function addTokensToOutputTrx(trxId: number, name: string, amount: string) {
    const trx = getOutputTrxById(trxId);
    if (!trx) return;
    trx.tokens.push({
      id: outputTokenId.value++,
      amount: amount,
      name: name,
    });
  }

  function deleteOutputTrxToken(trxId: number, tokenId: number) {
    const trx = getOutputTrxById(trxId);
    if (trx) {
      trx.tokens = trx.tokens.filter((item) => item.id !== tokenId);
    }
  }

  function clearOutputTrxItem(trxId: number) {
    const trx = getOutputTrxById(trxId);
    if (trx) {
      trx.tokens = [];
      trx.address = "";
      trx.adaAmount = "";
    }
  }

  function deleteOutputTrx(trxId: number) {
    outputTrxItems.value = outputTrxItems.value.filter(
      (item) => item.id !== trxId,
    );
    if (!outputTrxItems.value.length) {
      addOutputTrx();
    }
  }

  return {
    // input
    inputTrxItems,
    addInputTrx,
    getInputTrxById,
    setInputTrxFields,
    addTokensToInputTrx,
    deleteInputTrxToken,
    clearInputTrxItem,
    deleteInputTrx,
    // output
    outputTrxItems,
    addOutputTrx,
    getOutputTrxById,
    setOutputTrxFields,
    addTokensToOutputTrx,
    deleteOutputTrxToken,
    clearOutputTrxItem,
    deleteOutputTrx,
  };
});
