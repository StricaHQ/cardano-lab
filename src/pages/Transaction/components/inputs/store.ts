import type { InputTrxItem } from "@/types/transactions";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useInputStore = defineStore("inputStore", () => {
  const inputId = ref<number>(0);
  const inputTokenId = ref<number>(0);

  const inputs = ref<Array<InputTrxItem>>([
    {
      id: inputId.value++,
      txId: "",
      amount: "",
      index: "",
      address: "",
      tokens: [],
    },
  ]);

  const addInput = () => {
    inputs.value.push({
      id: inputId.value++,
      txId: "",
      amount: "",
      index: "",
      address: "",
      tokens: [],
    });
  };

  const getInputById = (id: number) => {
    return inputs.value.find((item) => item.id === id);
  };

  const setInputField = (
    id: number,
    inputField: "txId" | "index" | "amount" | "address",
    value: string,
  ) => {
    const trx = getInputById(id);
    if (!trx) return;
    trx[inputField] = value;
  };

  const addToken = ({
    trxId,
    policyId,
    assetName,
    amount,
  }: {
    trxId: number;
    policyId: string;
    assetName: string;
    amount: string;
  }) => {
    const trx = getInputById(trxId);
    if (!trx) return;
    trx.tokens.push({
      id: inputTokenId.value++,
      policyId,
      amount,
      assetName,
    });
  };

  const deleteToken = ({
    trxId,
    tokenId,
  }: {
    trxId: number;
    tokenId: number;
  }) => {
    const trx = getInputById(trxId);
    if (trx) {
      trx.tokens = trx.tokens.filter((item) => item.id !== tokenId);
    }
  };

  const clearInput = (trxId: number) => {
    const trx = getInputById(trxId);
    if (trx) {
      trx.tokens = [];
      trx.txId = "";
      trx.index = "";
      trx.amount = "";
      trx.address = "";
    }
  };

  const deleteInput = (trxId: number) => {
    inputs.value = inputs.value.filter((item) => item.id !== trxId);
    if (!inputs.value.length) {
      addInput();
    }
  };

  const reset = () => {
    inputId.value = 0;
    inputTokenId.value = 0;

    inputs.value = [
      {
        id: inputId.value++,
        txId: "",
        amount: "",
        index: "",
        address: "",
        tokens: [],
      },
    ];
  };

  return {
    inputs,
    addInput,
    getInputById,
    setInputField,
    addToken,
    deleteToken,
    clearInput,
    deleteInput,
    reset,
  };
});
