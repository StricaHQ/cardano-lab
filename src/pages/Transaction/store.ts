import type { InputTrxItem, OutputTrxItem } from "@/types/transactions";
import { Transaction } from "@stricahq/typhonjs";
import type {
  LanguageView,
  ShelleyAddress,
  VKeyWitness,
} from "@stricahq/typhonjs/dist/types";
import { utils as TyphonUtils } from "@stricahq/typhonjs";
import { defineStore } from "pinia";
import { ref } from "vue";
import BigNumber from "bignumber.js";
import mainnetProtocolParams from "@/assets/mainnetProtocolParams.json";
import testnetProtocolParams from "@/assets/testnetProtocolParams.json";
import { Network } from "@/enums/networks";

import { convertADAToLovelace, convertLovelaceToADA } from "@/utils/utils";
import { useAccountStore } from "@/stores/openStore";

export const useTransactionsStore = defineStore("transactionsStore", () => {
  const currentNetwork = ref(localStorage.getItem("cardanoLabSelectedNetwork"));

  function updateNetwork(network: Network) {
    localStorage.setItem("cardanoLabSelectedNetwork", network);
    currentNetwork.value = network;
  }

  const cardanoscanEndPoint = ref(
    localStorage.getItem("cardanoscanEndPoint") || "",
  );

  function updateCardanoscanEndPoint(endPoint: string) {
    localStorage.setItem("cardanoscanEndPoint", endPoint);
    cardanoscanEndPoint.value = endPoint;
  }

  const protocolParamsFromJson =
    currentNetwork.value == Network.MAINNET
      ? mainnetProtocolParams
      : testnetProtocolParams;

  const protocolParams = {
    minFeeA: new BigNumber(protocolParamsFromJson.minFeeA),
    minFeeB: new BigNumber(protocolParamsFromJson.minFeeB),
    stakeKeyDeposit: new BigNumber(protocolParamsFromJson.stakeKeyDeposit),
    lovelacePerUtxoWord: new BigNumber(
      protocolParamsFromJson.lovelacePerUtxoWord,
    ),
    collateralPercent: new BigNumber(protocolParamsFromJson.collateralPercent),
    priceSteps: new BigNumber(protocolParamsFromJson.priceSteps),
    priceMem: new BigNumber(protocolParamsFromJson.priceMem),
    maxTxSize: Number(protocolParamsFromJson.maxTxSize),
    maxValueSize: Number(protocolParamsFromJson.maxValueSize),
    utxoCostPerByte: new BigNumber(protocolParamsFromJson.utxoCostPerByte),
    minFeeRefScriptCostPerByte: new BigNumber(
      protocolParamsFromJson.minFeeRefScriptCostPerByte,
    ),
    languageView:
      protocolParamsFromJson.languageView as unknown as LanguageView,
  };

  const transaction = ref(
    new Transaction({
      protocolParams,
    }),
  );

  const signedTransactionCBOR = ref("");

  const transactionResponse = ref({
    transactionHash: "",
    unsignedTransaction: "",
  });

  const witnesses = ref<Array<VKeyWitness>>([]);

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

  const fee = ref("");

  function buildTransaction() {
    try {
      //create new transaction
      transaction.value = new Transaction({
        protocolParams,
      });

      //add inputs to the transaction
      inputTrxItems.value.map((trx) => {
        const tokens = trx.tokens.map((token) => {
          return {
            policyId: token.policyId,
            assetName: token.assetName,
            amount: BigNumber(token.amount),
          };
        });

        transaction.value.addInput({
          txId: trx.txId,
          index: Number(trx.index),
          amount: convertADAToLovelace(BigNumber(trx.amount)),
          address: TyphonUtils.getAddressFromString(
            trx.address,
          ) as ShelleyAddress,
          tokens: tokens,
        });
      });

      //add outputs to the transaction
      outputTrxItems.value.map((trx) => {
        const tokens = trx.tokens.map((token) => {
          return {
            policyId: token.policyId,
            assetName: token.assetName,
            amount: BigNumber(token.amount),
          };
        });
        transaction.value.addOutput({
          amount: convertADAToLovelace(BigNumber(trx.amount)),
          address: TyphonUtils.getAddressFromString(trx.address),
          tokens: tokens,
        });
      });

      //prepare transaction
      transaction.value = transaction.value.prepareTransaction({
        inputs: [],
        changeAddress: TyphonUtils.getAddressFromString(
          useAccountStore().account?.getReceiveAddressDetails()
            .bech32 as string,
        ),
      });

      //build the transaction
      const res = transaction.value.buildTransaction();

      transactionResponse.value.transactionHash = res.hash;
      transactionResponse.value.unsignedTransaction = res.payload;

      //fetch and set fees
      fee.value = convertLovelaceToADA(transaction.value.getFee()).toString();
    } catch (error) {
      console.log(error);
    }
  }

  function updateWitnesses(witnessesList: Array<VKeyWitness>) {
    witnessesList.forEach((witness) => {
      transaction.value.addWitness(witness);
    });
    witnesses.value = witnessesList;
  }

  function reset() {
    transaction.value = new Transaction({
      protocolParams,
    });

    fee.value = "";
    signedTransactionCBOR.value = "";
    transactionResponse.value = {
      transactionHash: "",
      unsignedTransaction: "",
    };
    witnesses.value = [];
    inputTrxId.value = 0;
    inputTokenId.value = 0;
    outputTrxId.value = 0;
    outputTokenId.value = 0;

    inputTrxItems.value = [
      {
        id: inputTrxId.value++,
        txId: "",
        amount: "",
        index: "",
        address: "",
        tokens: [],
      },
    ];

    outputTrxItems.value = [
      {
        id: outputTrxId.value++,
        address: "",
        amount: "",
        tokens: [],
      },
    ];
  }

  return {
    transaction,
    currentNetwork,
    updateNetwork,
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
    updateWitnesses,
    witnesses,
    signedTransactionCBOR,
    cardanoscanEndPoint,
    updateCardanoscanEndPoint,
    reset,
  };
});
