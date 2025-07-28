import type { InputTrxItem, OutputTrxItem } from "@/types/transactions";
import { Transaction } from "@stricahq/typhonjs";
import type {
  ProtocolParams,
  ShelleyAddress,
} from "@stricahq/typhonjs/dist/types";
import { utils as TyphonUtils } from "@stricahq/typhonjs";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import BigNumber from "bignumber.js";
import protocolParams from "@/assets/protocolParams.json";

export const useTransactionsStore = defineStore("transactionsStore", () => {
  const transaction = new Transaction({
    protocolParams: protocolParams as unknown as ProtocolParams,
  });

  const transactionResponse = ref({
    transactionHash: "",
    unsignedTransaction: "",
  });

  const inputTrxId = ref<number>(0);
  const inputTokenId = ref<number>(0);

  const outputTrxId = ref<number>(0);
  const outputTokenId = ref<number>(0);

  //   input trx
  const inputTrxItems = ref<Array<InputTrxItem>>([
    {
      id: inputTrxId.value++,
      txId: "",
      amount: "",
      index: "",
      address: "",
      tokens: [],
    },
  ]);

  function addInputTrx() {
    inputTrxItems.value.push({
      id: inputTrxId.value++,
      txId: "",
      amount: "",
      index: "",
      address: "",
      tokens: [],
    });
  }

  function getInputTrxById(id: number) {
    return inputTrxItems.value.find((item) => item.id === id);
  }

  function setInputTrxFields(
    id: number,
    inputField: "txId" | "index" | "amount" | "address",
    value: string,
  ) {
    const trx = getInputTrxById(id);
    if (!trx) return;
    trx[inputField] = value;
  }

  function addTokensToInputTrx({
    trxId,
    policyId,
    assetName,
    amount,
  }: {
    trxId: number;
    policyId: string;
    assetName: string;
    amount: string;
  }) {
    const trx = getInputTrxById(trxId);
    if (!trx) return;
    trx.tokens.push({
      id: inputTokenId.value++,
      policyId,
      amount,
      assetName,
    });
  }

  function deleteInputTrxToken({
    trxId,
    tokenId,
  }: {
    trxId: number;
    tokenId: number;
  }) {
    const trx = getInputTrxById(trxId);
    if (trx) {
      trx.tokens = trx.tokens.filter((item) => item.id !== tokenId);
    }
  }

  function clearInputTrxItem(trxId: number) {
    const trx = getInputTrxById(trxId);
    if (trx) {
      trx.tokens = [];
      trx.txId = "";
      trx.index = "";
      trx.amount = "";
      trx.address = "";
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
      amount: "",
      tokens: [],
    },
  ]);

  function addOutputTrx() {
    outputTrxItems.value.push({
      id: outputTrxId.value++,
      address: "",
      amount: "",
      tokens: [],
    });
  }

  function getOutputTrxById(trxId: number) {
    return outputTrxItems.value.find((item) => item.id === trxId);
  }

  function setOutputTrxFields(
    id: number,
    outputField: "address" | "amount",
    value: string,
  ) {
    const trx = getOutputTrxById(id);
    if (!trx) return;
    trx[outputField] = value;
  }

  function addTokensToOutputTrx({
    trxId,
    policyId,
    assetName,
    amount,
  }: {
    trxId: number;
    policyId: string;
    assetName: string;
    amount: string;
  }) {
    const trx = getOutputTrxById(trxId);
    if (!trx) return;
    trx.tokens.push({
      id: outputTokenId.value++,
      policyId,
      amount,
      assetName,
    });
  }

  function deleteOutputTrxToken({
    trxId,
    tokenId,
  }: {
    trxId: number;
    tokenId: number;
  }) {
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
      trx.amount = "";
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

  const fee = computed(() => transaction.getFee() || 0);

  const buildTransaction = () => {
    try {
      inputTrxItems.value.map((trx) => {
        const tokens = trx.tokens.map((token) => {
          return {
            policyId: token.policyId,
            assetName: token.assetName,
            amount: BigNumber(token.amount),
          };
        });

        transaction.addInput({
          txId: trx.txId,
          index: Number(trx.index),
          amount: BigNumber(trx.amount),
          address: TyphonUtils.getAddressFromString(
            trx.address,
          ) as ShelleyAddress,
          tokens: tokens,
        });
      });

      outputTrxItems.value.map((trx) => {
        const tokens = trx.tokens.map((token) => {
          return {
            policyId: token.policyId,
            assetName: token.assetName,
            amount: BigNumber(token.amount),
          };
        });

        transaction.addOutput({
          amount: BigNumber(trx.amount),
          address: TyphonUtils.getAddressFromString(trx.address),
          tokens: tokens,
        });
      });

      const res = transaction.buildTransaction();

      transactionResponse.value.transactionHash = res.hash;
      transactionResponse.value.unsignedTransaction = res.payload;
    } catch (error) {
      console.log(error);
    }
  };
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

    fee,
    buildTransaction,
    transactionResponse,
  };
});
