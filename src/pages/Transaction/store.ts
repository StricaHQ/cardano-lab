import { NativeScriptFactory, Transaction } from "@stricahq/typhonjs";
import {
  CertificateType,
  type LanguageView,
  type ShelleyAddress,
  type StakeDelegationCertificate,
  type StakeKeyRegistrationCertificate,
  type VKeyWitness,
} from "@stricahq/typhonjs/dist/types";
import { utils as TyphonUtils } from "@stricahq/typhonjs";
import { defineStore } from "pinia";
import { ref } from "vue";
import BigNumber from "bignumber.js";
import mainnetProtocolParams from "@/assets/mainnetProtocolParams.json";
import testnetProtocolParams from "@/assets/testnetProtocolParams.json";
import { Network } from "@/enums/networks";

import { convertADAToLovelace, convertLovelaceToADA } from "@/utils/utils";
import { useAccountStore } from "@/stores/accountStore";
import { useInputStore } from "./components/inputs/store";
import { useOutputStore } from "./components/outputs/store";
import { useMintStore } from "./components/mints/store";
import { useCertificateStore } from "./components/certificates/store";

export const useTransactionsStore = defineStore("transactionsStore", () => {
  //import stores
  const inputStore = useInputStore();
  const outputStore = useOutputStore();
  const mintStore = useMintStore();
  const certificateStore = useCertificateStore();

  const currentNetwork = ref(localStorage.getItem("cardanoLabSelectedNetwork"));

  const updateNetwork = (network: Network) => {
    localStorage.setItem("cardanoLabSelectedNetwork", network);
    currentNetwork.value = network;
  };

  const trxSubmitEndPoint = ref(
    localStorage.getItem("trxSubmitEndPoint") || "",
  );

  const updateTrxSubmitEndPoint = (endPoint: string) => {
    localStorage.setItem("trxSubmitEndPoint", endPoint);
    trxSubmitEndPoint.value = endPoint;
  };

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

  const fee = ref("");

  const buildTransaction = () => {
    try {
      //create new transaction
      transaction.value = new Transaction({
        protocolParams,
      });

      //add inputs to the transaction
      inputStore.inputs.map((input) => {
        const tokens = input.tokens.map((token) => {
          return {
            policyId: token.policyId,
            assetName: token.assetName,
            amount: BigNumber(token.amount),
          };
        });

        transaction.value.addInput({
          txId: input.txId,
          index: Number(input.index),
          amount: convertADAToLovelace(BigNumber(input.amount)),
          address: TyphonUtils.getAddressFromString(
            input.address,
          ) as ShelleyAddress,
          tokens: tokens,
        });
      });

      //add outputs to the transaction
      outputStore.outputs.map((output) => {
        const tokens = output.tokens.map((token) => {
          return {
            policyId: token.policyId,
            assetName: token.assetName,
            amount: BigNumber(token.amount),
          };
        });
        transaction.value.addOutput({
          amount: convertADAToLovelace(BigNumber(output.amount)),
          address: TyphonUtils.getAddressFromString(output.address),
          tokens: tokens,
        });
      });

      //add Certificates to the transaction
      certificateStore.certificates.map((certificate) => {
        if (
          certificate.certificateType == CertificateType.STAKE_KEY_REGISTRATION
        ) {
          const stakeKeyRegistration: StakeKeyRegistrationCertificate = {
            type: CertificateType.STAKE_KEY_REGISTRATION,
            cert: {
              stakeCredential: {
                bipPath: certificate.stakePath,
                hash: certificate.address.stakeCredential.hash,
                type: certificate.address.stakeCredential.type,
              },
              deposit: BigNumber(certificate.deposit),
            },
          };

          transaction.value.addCertificate(stakeKeyRegistration);
        } else if (
          certificate.certificateType == CertificateType.STAKE_DELEGATION
        ) {
          const stakePoolDelegation: StakeDelegationCertificate = {
            type: CertificateType.STAKE_DELEGATION,
            cert: {
              stakeCredential: {
                bipPath: certificate.stakePath,
                hash: certificate.address.stakeCredential.hash,
                type: certificate.address.stakeCredential.type,
              },
              poolHash: certificate.poolHash,
            },
          };
          transaction.value.addCertificate(stakePoolDelegation);
        }
      });

      //add mints
      mintStore.mints.map((mint) => {
        const assets = mint.assets.map((asset) => {
          return {
            assetName: asset.assetName,
            amount: BigNumber(asset.amount),
          };
        });
        const nativeScript = NativeScriptFactory.fromCliJSON(
          JSON.parse(mint.policyScript),
        );

        transaction.value.addMint({
          nativeScript: nativeScript.json(),
          policyId: nativeScript.policyId().toString("hex"),
          assets: assets.filter((asset) => asset.assetName != ""),
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
  };

  const updateWitnesses = (witnessesList: Array<VKeyWitness>) => {
    witnessesList.forEach((witness) => {
      transaction.value.addWitness(witness);
    });
    witnesses.value = witnessesList;
  };

  const reset = () => {
    transaction.value = new Transaction({
      protocolParams,
    });

    fee.value = "";
    signedTransactionCBOR.value = "";
    transactionResponse.value = {
      transactionHash: "",
      unsignedTransaction: "",
    };

    inputStore.reset();
    outputStore.reset();
    mintStore.reset();
    certificateStore.reset();

    witnesses.value = [];
  };

  return {
    transaction,
    currentNetwork,
    updateNetwork,
    protocolParams,
    fee,
    buildTransaction,
    transactionResponse,
    updateWitnesses,
    witnesses,
    signedTransactionCBOR,
    trxSubmitEndPoint,
    updateTrxSubmitEndPoint,
    reset,
  };
});
