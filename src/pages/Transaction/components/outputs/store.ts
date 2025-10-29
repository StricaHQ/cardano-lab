import type { OutputTrxItem } from "@/types/transactions";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useOutputStore = defineStore("outputStore", () => {
  const outputId = ref<number>(0);
  const outputTokenId = ref<number>(0);

  const outputs = ref<Array<OutputTrxItem>>([
    {
      id: outputId.value++,
      address: "",
      amount: "",
      tokens: [],
    },
  ]);

  const addOutput = () => {
    outputs.value.push({
      id: outputId.value++,
      address: "",
      amount: "",
      tokens: [],
    });
  };

  const getOutputById = (id: number) => {
    return outputs.value.find((item) => item.id === id);
  };

  const setOutputFields = (
    id: number,
    outputField: "address" | "amount",
    value: string,
  ) => {
    const output = getOutputById(id);
    if (!output) return;
    output[outputField] = value;
  };

  const addToken = ({
    id,
    policyId,
    assetName,
    amount,
  }: {
    id: number;
    policyId: string;
    assetName: string;
    amount: string;
  }) => {
    const trx = getOutputById(id);
    if (!trx) return;
    trx.tokens.push({
      id: outputTokenId.value++,
      policyId,
      amount,
      assetName,
    });
  };

  const deleteToken = ({ id, tokenId }: { id: number; tokenId: number }) => {
    const output = getOutputById(id);
    if (output) {
      output.tokens = output.tokens.filter((item) => item.id !== tokenId);
    }
  };

  const clearOutput = (id: number) => {
    const output = getOutputById(id);
    if (output) {
      output.tokens = [];
      output.address = "";
      output.amount = "";
    }
  };

  const deleteOutput = (id: number) => {
    outputs.value = outputs.value.filter((item) => item.id !== id);
    if (!outputs.value.length) {
      addOutput();
    }
  };

  const reset = () => {
    outputId.value = 0;
    outputTokenId.value = 0;

    outputs.value = [
      {
        id: outputId.value++,
        address: "",
        amount: "",
        tokens: [],
      },
    ];
  };

  return {
    outputs,
    addOutput,
    getOutputById,
    setOutputFields,
    addToken,
    deleteToken,
    clearOutput,
    deleteOutput,
    reset,
  };
});
