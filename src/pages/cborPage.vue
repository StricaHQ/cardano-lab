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
                  {{ input.index || "----" }}
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
            <div class="flex flex-col gap-y-0.5">
              <span class="textColor2 text-xs">Tokens</span>
              <div
                v-if="output.tokens"
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
              <div v-else>----</div>
            </div>
          </div>
        </div>
        <!-- certificate -->
        <div class="w-full card1 flex flex-col gap-y-2">
          <div class="flex items-center gap-x-2">
            <div class="w-2 h-2 rounded-full bg-gray-800"></div>
            <div>
              <span class="textColor1 text-sm font-medium">CERTIFICATES</span>
            </div>
          </div>

          <div v-if="!certificates">----</div>
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
                  {{ certificate?.certificateType }}
                </span>
              </div>
            </div>
            <div v-if="certificate?.poolHash" class="flex flex-col gap-y-0.5">
              <span class="textColor2 text-xs">Pool Hash</span>
              <div class="w-full flex gap-x-4 items-center">
                <span class="text-sm textColor1 break-all">
                  {{ certificate.poolHash }}
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
import { useTransactionsStore } from "./Transaction/store";
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

export default defineComponent({
  components: { CopyButton },
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
              let certificateType = "";

              if (certificate.type == 7) {
                deposit = convertLovelaceToADA(
                  BigNumber(certificate.cert.deposit),
                ).toNumber();
                certificateType = "Stake Key Registration";
              } else if (certificate.type == 2) {
                poolHash = certificate.cert.poolKeyHash;
                certificateType = "Stake Pool Delegation";
              }
              return { address, deposit, poolHash, certificateType };
            }
          }
        },
      );
    });

    function formatToken(tokens: Token[] | undefined) {
      return tokens?.map((token) => {
        return {
          policyId: token.policyId,
          assetName: token.assetName,
          amount: token.amount.toString(),
        };
      });
    }

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
      certificates,
      transaction,
      cborErrorMessage,
    };
  },
});
</script>
