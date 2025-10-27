<template>
  <div class="flex flex-col gap-y-5">
    <div>
      <span class="textColor font-bold text-xl">CBOR View</span>
    </div>
    <div class="w-full flex flex-col gap-y-1">
      <label class="inputLabel" for="cbor">CBOR</label>
      <div class="relative flex items-start">
        <textarea
          id="cbor"
          v-model="cbor"
          placeholder="CBOR"
          rows="5"
          autofocus
          class="pl-2 pr-10 py-2 textColor placeholder:text-[12px] placeholder:text-gray-400 focus:outline-none inputFieldBg border border-gray-100 focus:border-gray-300 rounded-md w-full text-sm resize-y min-h-[80px]"
        ></textarea>
        <CopyButton class="absolute top-2 right-2" :content="cbor" />
      </div>
      <div class="errorMessage">{{ cborErrorMessage }}</div>
    </div>
    <div class="flex flex-col gap-y-4" v-if="cbor && transaction">
      <div class="flex flex-col gap-y-4">
        <div class="w-full card1 flex flex-col gap-y-2">
          <div class="cardWhite cardWhite flex flex-col gap-y-4">
            <div class="flex flex-col gap-y-0.5">
              <span class="textColor2 text-xs">Transaction Hash</span>
              <div class="w-full flex gap-x-4 items-center">
                <span class="text-sm textColor1 break-all">
                  {{ transaction.hash || "----" }}
                </span>

                <CopyButton
                  v-if="transaction.hash"
                  :content="transaction.hash"
                />
              </div>
            </div>
            <div class="flex flex-col gap-y-0.5">
              <span class="textColor2 text-xs">Fee</span>
              <div class="w-full flex gap-x-8 justify-between items-center">
                <span class="text-sm textColor1 break-all">
                  {{ transactionFee || "-----" }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <!-- input -->
        <div class="w-full card1 flex flex-col gap-y-2">
          <div class="flex items-center gap-x-2">
            <div class="w-2 h-2 rounded-full bg-gray-800"></div>
            <div>
              <span class="textColor1 text-sm font-medium">INPUTS</span>
            </div>
          </div>

          <div v-if="!inputs">----</div>
          <div
            v-for="(input, index) in inputs"
            :key="index"
            class="cardWhite flex flex-col gap-y-4"
          >
            <div class="headingBadge">
              <span>Input #{{ index + 1 }}</span>
            </div>
            <div class="flex flex-col gap-y-0.5">
              <span class="textColor2 text-xs">UTXO</span>
              <div class="w-full flex gap-x-4 items-center">
                <span class="text-sm textColor1 break-all">
                  {{ input.txId || "----" }}
                </span>
              </div>
            </div>
            <div class="flex flex-col gap-y-0.5">
              <span class="textColor2 text-xs">Index</span>
              <div class="w-full flex gap-x-4 items-center">
                <span class="text-sm textColor1 break-all">
                  {{ isNaN(input.index) ? "--" : input.index }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <!-- output -->
        <div class="w-full card1 flex flex-col gap-y-2">
          <div class="flex items-center gap-x-2">
            <div class="w-2 h-2 rounded-full bg-gray-800"></div>
            <div>
              <span class="textColor1 text-sm font-medium">OUTPUTS</span>
            </div>
          </div>
          <div v-if="!outputs">----</div>
          <div
            v-for="(output, index) in outputs"
            :key="index"
            class="cardWhite flex flex-col gap-y-4"
          >
            <div class="headingBadge">
              <span>Output #{{ index + 1 }}</span>
            </div>

            <div class="flex flex-col gap-y-0.5">
              <span class="textColor2 text-xs">ADDRESS</span>
              <div class="w-full flex gap-x-4 items-center">
                <span class="text-sm textColor1 break-all">
                  {{ output.address || "----" }}
                </span>
              </div>
            </div>
            <div class="flex flex-col gap-y-0.5">
              <span class="textColor2 text-xs">ADA</span>
              <div class="w-full flex gap-x-8 justify-between items-center">
                <span class="text-sm textColor1 break-all">
                  {{ output.amount || "----" }}
                </span>
              </div>
            </div>
            <div v-if="output.tokens" class="flex flex-col gap-y-0.5">
              <span class="textColor2 text-xs">Tokens</span>
              <div
                class="flex gap-x-4 items-center flex-wrap justify-start gap-y-4"
              >
                <TokenBadge
                  v-for="(token, index) in output.tokens"
                  :key="index"
                  :policyId="token.policyId"
                  :assetName="token.assetName"
                  :amount="token.amount"
                  :enableDelete="false"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- mints -->
        <div v-if="mints.length" class="w-full card1 flex flex-col gap-y-2">
          <div class="flex items-center gap-x-2">
            <div class="w-2 h-2 rounded-full bg-gray-800"></div>
            <div>
              <span class="textColor1 text-sm font-medium">MINTS</span>
            </div>
          </div>
          <div
            v-for="(mint, index) in mints"
            :key="index"
            class="cardWhite flex flex-col gap-y-4"
          >
            <div class="headingBadge">
              <span>Mint #{{ index + 1 }}</span>
            </div>

            <div class="flex flex-col gap-y-0.5">
              <span class="textColor2 text-xs">Policy ID</span>
              <div class="w-full flex gap-x-4 items-center">
                <span class="text-sm textColor1 break-all">
                  {{ mint.policyId || "----" }}
                </span>
              </div>
            </div>

            <div v-if="mint.assets" class="flex flex-col gap-y-0.5">
              <span class="textColor2 text-xs">Assets</span>
              <div
                class="flex gap-x-4 items-center flex-wrap justify-start gap-y-4"
              >
                <AssetBadge
                  v-for="(asset, index) in mint.assets"
                  :key="index"
                  :assetName="asset.assetName"
                  :amount="asset.amount"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- certificate -->
        <div v-if="certificates" class="w-full card1 flex flex-col gap-y-2">
          <div class="flex items-center gap-x-2">
            <div class="w-2 h-2 rounded-full bg-gray-800"></div>
            <div>
              <span class="textColor1 text-sm font-medium">CERTIFICATES</span>
            </div>
          </div>

          <div
            v-for="(certificate, index) in certificates"
            :key="index"
            class="cardWhite flex flex-col gap-y-4"
          >
            <div class="headingBadge">
              <span>Certificate #{{ index + 1 }}</span>
            </div>
            <div class="flex flex-col gap-y-0.5">
              <span class="textColor2 text-xs">Certificate</span>
              <div class="w-full flex gap-x-4 items-center">
                <span class="text-sm textColor1 break-all">
                  {{ certificate?.certificateTypeInText || "----" }}
                </span>
              </div>
            </div>
            <div v-if="certificate?.poolHash" class="flex flex-col gap-y-0.5">
              <span class="textColor2 text-xs">Pool Hash</span>
              <div class="w-full flex gap-x-4 items-center">
                <span class="text-sm textColor1 break-all">
                  {{ certificate.poolHash || "----" }}
                </span>
              </div>
            </div>
            <div class="flex flex-col gap-y-0.5">
              <span class="textColor2 text-xs">Address</span>
              <div class="w-full flex gap-x-4 items-center">
                <span class="text-sm textColor1 break-all">
                  {{ certificate?.address || "----" }}
                </span>
              </div>
            </div>
            <div v-if="certificate?.deposit" class="flex flex-col gap-y-0.5">
              <span class="textColor2 text-xs">Deposit</span>
              <div class="w-full flex gap-x-4 items-center">
                <span class="text-sm textColor1 break-all">
                  {{ certificate.deposit }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import { conway } from "@stricahq/cardano-codec";
import * as cbors from "@stricahq/cbors";
import { useTransactionsStore } from "../Transaction/store";
import {
  type Transaction,
  type Token,
  type TransactionCertificate,
  HashType,
} from "@stricahq/cardano-codec/dist/types/conwayTypes";
import { convertLovelaceToADA } from "@/utils/utils";
import {
  utils as TyphonUtils,
  address as TyphonAddress,
} from "@stricahq/typhonjs";
import BigNumber from "bignumber.js";
import { getNetworkParameters } from "@/lib/helpers/networks";
import { Network } from "@/enums/networks";
import CopyButton from "@/components/buttons/CopyButton.vue";
import TokenBadge from "@/components/TokenBadge.vue";
import AssetBadge from "@/pages/Transaction/components/mints/components/assetBadge.vue";
import { CertificateType } from "@stricahq/cardano-codec/dist/constants";

export default defineComponent({
  components: { CopyButton, TokenBadge, AssetBadge },
  setup() {
    const trxStore = useTransactionsStore();

    const networkParams = getNetworkParameters(
      trxStore.currentNetwork === Network.MAINNET
        ? "cardano"
        : "cardano_testnet",
    );
    const transaction = ref<Transaction>();
    const cbor = ref("");
    const cborErrorMessage = ref("");

    watch(cbor, () => {
      cborErrorMessage.value = "";
      transaction.value = undefined;
      if (cbor.value) {
        try {
          const txCbor = Buffer.from(cbor.value, "hex");
          const decodedTx = cbors.Decoder.decode(txCbor).value;
          transaction.value = conway.parseTransaction(decodedTx[0], txCbor);
        } catch {
          cborErrorMessage.value = "Invalid CBOR";
        }
      }
    });

    const transactionFee = computed(() =>
      transaction.value?.fee
        ? convertLovelaceToADA(BigNumber(transaction.value.fee))
        : 0,
    );

    const inputs = computed(() => transaction.value?.inputs);

    const outputs = computed(() => {
      return transaction.value?.outputs.map((output) => {
        return {
          address: TyphonUtils.getAddressFromHex(
            Buffer.from(output.address, "hex"),
          ).getBech32(),
          amount: convertLovelaceToADA(BigNumber(output.amount)),
          tokens: formatToken(output.tokens),
        };
      });
    });

    const mints = computed(() => {
      const list = transaction.value?.mint?.reduce(
        (acc, item) => {
          if (!acc[item.policyId]) {
            acc[item.policyId] = [];
          }
          acc[item.policyId].push({
            assetName: item.assetName,
            amount: item.amount,
          });
          return acc;
        },
        {} as Record<string, { assetName: string; amount: string }[]>,
      );

      return Object.entries(list || {}).map(([policyId, assets]) => ({
        policyId,
        assets,
      }));
    });

    const certificates = computed(() => {
      return transaction.value?.certificates?.map(
        (certificate: TransactionCertificate) => {
          if ("stakeCredential" in certificate.cert) {
            const stakeCredential = certificate.cert.stakeCredential;

            if (stakeCredential && stakeCredential.type === HashType.ADDRESS) {
              const address = new TyphonAddress.RewardAddress(
                networkParams.networkId,
                {
                  hash: Buffer.from(stakeCredential.key, "hex"),
                  type: HashType.ADDRESS,
                },
              ).getBech32();
              let poolHash = "";
              let deposit = 0;
              let certificateTypeInText = "";

              if (certificate.type == CertificateType.STAKE_REG) {
                deposit = convertLovelaceToADA(
                  BigNumber(certificate.cert.deposit),
                ).toNumber();
              } else if (certificate.type == CertificateType.STAKE_DELEGATION) {
                poolHash = certificate.cert.poolKeyHash;
              }

              switch (certificate.type) {
                case CertificateType.STAKE_REG:
                  certificateTypeInText = "Stake Key Registration";
                  break;
                case CertificateType.STAKE_DELEGATION:
                  certificateTypeInText = "Stake Pool Delegation";
                  break;
                case CertificateType.DREP_REG:
                  certificateTypeInText = "Drep Registration";
                  break;
                case CertificateType.COMMITTEE_AUTH_HOT:
                  certificateTypeInText = "Committee Auth Hot";
                  break;
                case CertificateType.DREP_DE_REG:
                  certificateTypeInText = "Drep Deregistration";
                  break;
                case CertificateType.COMMITTEE_RESIGN_COLD:
                  certificateTypeInText = "Committee Resign cold";
                  break;
                case CertificateType.DREP_UPDATE:
                  certificateTypeInText = "Drep Update";
                  break;
                case CertificateType.POOL_DE_REG:
                  certificateTypeInText = "Pool Deregistration";
                  break;
                case CertificateType.POOL_REG:
                  certificateTypeInText = "Pool Registration";
                  break;
                case CertificateType.STAKE_DE_REG:
                  certificateTypeInText = "Stake Deregistration";
                  break;
                case CertificateType.STAKE_KEY_DE_REG:
                  certificateTypeInText = "Stake Key Deregistration";
                  break;
                case CertificateType.STAKE_KEY_REG:
                  certificateTypeInText = "Stake Key Registration";
                  break;
                case CertificateType.STAKE_REG_DELEG:
                  certificateTypeInText = "Stake Registration Delegation";
                  break;
                case CertificateType.STAKE_VOTE_DELEG:
                  certificateTypeInText = "Stake Vote Delegation";
                  break;
                case CertificateType.STAKE_VOTE_REG_DELEG:
                  certificateTypeInText = "Stake Vote Registration Delegation";
                  break;
                case CertificateType.VOTE_DELEG:
                  certificateTypeInText = "Vote Delegation";
                  break;
                case CertificateType.VOTE_REG_DELEG:
                  certificateTypeInText = "Vote Registration Delegation";
                  break;
                default:
                  certificateTypeInText = "Unknown Certificate";
              }
              return { address, deposit, poolHash, certificateTypeInText };
            }
          }
        },
      );
    });

    const formatToken = (tokens: Token[] | undefined) => {
      return tokens?.map((token) => {
        return {
          policyId: token.policyId,
          assetName: token.assetName,
          amount: token.amount.toString(),
        };
      });
    };

    onMounted(() => {
      if (trxStore.signedTransactionCBOR) {
        cbor.value = trxStore.signedTransactionCBOR;
      }
    });

    return {
      transactionFee,
      cbor,
      outputs,
      inputs,
      mints,
      certificates,
      transaction,
      cborErrorMessage,
    };
  },
});
</script>
