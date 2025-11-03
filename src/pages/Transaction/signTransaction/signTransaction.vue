<template>
  <div class="flex flex-col gap-y-5">
    <div
      v-show="!trxSubmitEndPoint"
      class="text-sm text-red-500 border border-red-300 bg-red-500/10 px-2 py-2 rounded-md"
    >
      Please configure the transaction‐submission endpoint under Settings to
      enable submitting transactions to the node.
    </div>
    <div>
      <span class="textColor font-bold text-xl">Sign Transaction</span>
    </div>
    <div class="flex flex-col gap-y-4">
      <div class="w-full card1 flex flex-col gap-y-2">
        <div class="cardWhite cardWhite flex flex-col gap-y-4">
          <div class="flex flex-col gap-y-0.5">
            <span class="textColor2 text-xs">Transaction Hash</span>
            <div class="w-full flex gap-x-4 items-center">
              <span class="text-sm textColor1 break-all">
                {{ transactionHash || "----" }}
              </span>

              <CopyButton v-if="transactionHash" :content="transactionHash" />
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

        <div v-if="!inputs.length">----</div>
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
            <span class="textColor2 text-xs">ADDRESS</span>
            <div class="w-full flex gap-x-4 items-center">
              <span class="text-sm textColor1 break-all">
                {{ input.address || "----" }}
              </span>
            </div>
          </div>
          <div class="flex flex-col gap-y-0.5">
            <span class="textColor2 text-xs">ADA</span>
            <div class="w-full flex gap-x-8 justify-between items-center">
              <span class="text-sm textColor1 break-all">
                {{ input.amount || "----" }}
              </span>
            </div>
          </div>
          <div class="flex flex-col gap-y-0.5">
            <span v-if="input.tokens.length" class="textColor2 text-xs"
              >Tokens</span
            >
            <div
              class="flex gap-x-4 items-center flex-wrap justify-start gap-y-4"
            >
              <TokenBadge
                v-for="(token, index) in input.tokens"
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
      <!-- output -->
      <div class="w-full card1 flex flex-col gap-y-2">
        <div class="flex items-center gap-x-2">
          <div class="w-2 h-2 rounded-full bg-gray-800"></div>
          <div>
            <span class="textColor1 text-sm font-medium">OUTPUTS</span>
          </div>
        </div>
        <div v-if="!outputs.length">----</div>
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
          <div v-if="output.tokens.length" class="flex flex-col gap-y-0.5">
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
      <!-- mint -->
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

          <div v-if="mint.assets.length" class="flex flex-col gap-y-0.5">
            <span class="textColor2 text-xs">Assets</span>
            <div
              class="flex gap-x-4 items-center flex-wrap justify-start gap-y-4"
            >
              <AssetBadge
                v-for="(asset, index) in mint.assets"
                :key="index"
                :assetName="asset.assetName"
                :amount="asset.amount"
                :enableDelete="false"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- certificate -->
      <div
        v-if="certificates.length"
        class="w-full card1 flex flex-col gap-y-2"
      >
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
                {{ certificate?.address.getBech32() || "----" }}
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

      <!-- signature -->
      <AppButton
        :is-disabled="!signatures.length"
        btn-class="bgGradient max-w-max mt-8"
        size="lg"
        @on-click="addSignature"
      >
        <span class="text-sm text-white">Add Signature</span>
      </AppButton>

      <div class="w-full card1 flex flex-col gap-y-2">
        <div class="flex items-center gap-x-2">
          <div class="w-2 h-2 rounded-full bg-gray-800"></div>
          <div>
            <span class="textColor1 text-sm font-medium">SIGNATURE</span>
          </div>
        </div>
        <div v-if="!signatures.length || !isShowSignature">----</div>

        <div v-else>
          <div
            v-for="(signature, index) in signatures"
            :key="index"
            class="cardWhite flex flex-col gap-y-4"
          >
            <div class="headingBadge">
              <span>Signature #{{ index + 1 }}</span>
            </div>
            <div class="flex flex-col gap-y-0.5">
              <span class="textColor2 text-xs">Public key</span>
              <div class="w-full flex gap-x-4 items-center">
                <span class="text-sm textColor1 break-all">
                  {{ signature.publicKey.toString("hex") }}
                </span>
              </div>
            </div>

            <div class="flex flex-col gap-y-0.5">
              <span class="textColor2 text-xs">signature</span>
              <div class="w-full flex gap-x-8 justify-between items-center">
                <span class="text-sm textColor1 break-all">
                  {{ signature.signature.toString("hex") }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="text-red-500 text-sm mt-4">
        {{ submitTransactionError }}
      </div>
      <AppButton
        :is-disabled="isSubmitButtonDisabled"
        btn-class="bgGradient max-w-max"
        size="lg"
        @on-click="submitTransaction"
        ><span class="text-sm text-white">Submit Transaction</span></AppButton
      >
    </div>
    <DialogBox
      :openDialog="isTransactionSubmitted"
      dialogSize="sm"
      @closeDialog="closeTransactionSubmissionSuccessDialog"
    >
      <template #body>
        <div>
          <div class="flex flex-col items-center gap-6 mt-12 mb-8 text-lg">
            <check
              class="size-16 p-2 border-4 text-green-500 border-green-500 rounded-full"
            />
            <div class="tracking-wider text-green-500">
              Transaction submitted successfully
            </div>
          </div>
          <div class="flex justify-center">
            <a
              :href="transactionHashLink"
              target="_blank"
              class="text-sm tracking-wide text-secondary border border-secondary/50 p-1.5 rounded-md hover:bg-secondary/30"
            >
              View Transaction at Cardanoscan
            </a>
          </div>
        </div>
      </template>
    </DialogBox>
  </div>
</template>

<script lang="ts">
import CopyButton from "@/components/buttons/copyButton/copyButton.vue";
import { computed, defineComponent, ref } from "vue";
import TokenBadge from "@/components/tokenBadge/tokenBadge.vue";
import AppButton from "@/components/buttons/appButton/appButton.vue";
import { useTransactionsStore } from "../store/store";
import axios from "axios";
import DialogBox from "@/components/dialog/dialog.vue";
import Check from "@/assets/icons/check.vue";
import { Network } from "@/enums/networks";
import { useRouter } from "vue-router";
import {
  convertLovelaceToADA,
  formatToken,
  getCardanoScanTransactionURL,
} from "@/utils/utils";
import {
  address as TyphonAddress,
  types as TyphonTypes,
} from "@stricahq/typhonjs";
import { getNetworkParameters } from "@/lib/helpers/networks";
import AssetBadge from "../components/mints/components/assetBadge/assetBadge.vue";

export default defineComponent({
  components: {
    CopyButton,
    TokenBadge,
    AssetBadge,
    AppButton,
    DialogBox,
    Check,
  },
  setup() {
    const router = useRouter();
    const trxStore = useTransactionsStore();

    const transactionHash = computed(
      () => trxStore.transactionResponse.transactionHash,
    );

    const transactionHashLink = computed(() =>
      getCardanoScanTransactionURL({
        currentNetwork: trxStore.currentNetwork,
        transactionId: transactionHash.value,
      }),
    );

    const transactionFee = computed(() => trxStore.fee);

    const inputs = computed(() => {
      const inputs = trxStore.transaction.getInputs();

      return inputs.map((input) => {
        return {
          txId: input.txId,
          address: input.address.getBech32(),
          amount: convertLovelaceToADA(input.amount),
          tokens: formatToken(input.tokens),
        };
      });
    });

    const outputs = computed(() => {
      const outputs = trxStore.transaction.getOutputs();

      return outputs.map((output) => {
        return {
          address: output.address.getBech32(),
          amount: convertLovelaceToADA(output.amount),
          tokens: formatToken(output.tokens),
        };
      });
    });

    const mints = computed(() => {
      const mints = trxStore.transaction.getMints();

      return mints.map((mint) => {
        const assets = mint.assets.map((asset) => {
          return {
            assetName: asset.assetName,
            amount: asset.amount.toString(),
          };
        });

        return {
          policyId: mint.policyId,
          assets,
        };
      });
    });

    const certificates = computed(() => {
      const certificates = trxStore.transaction.getCertificates();

      const currencyId =
        trxStore.currentNetwork === Network.MAINNET
          ? "cardano"
          : "cardano_testnet";
      const networkParams = getNetworkParameters(currencyId);

      return certificates.map((certificate: TyphonTypes.Certificate) => {
        if ("stakeCredential" in certificate.cert) {
          const stakeCredential = certificate.cert.stakeCredential;

          if (
            stakeCredential &&
            stakeCredential.type === TyphonTypes.HashType.ADDRESS
          ) {
            const address = new TyphonAddress.RewardAddress(
              networkParams.networkId,
              {
                hash: stakeCredential.hash,
                type: TyphonTypes.HashType.ADDRESS,
                bipPath: stakeCredential.bipPath,
              },
            );
            let poolHash = "";
            let deposit = 0;
            let certificateType = "";

            if (
              certificate.type ==
              TyphonTypes.CertificateType.STAKE_KEY_REGISTRATION
            ) {
              deposit = convertLovelaceToADA(
                certificate.cert.deposit,
              ).toNumber();
              certificateType = "Stake Key Registration";
            } else if (
              certificate.type == TyphonTypes.CertificateType.STAKE_DELEGATION
            ) {
              poolHash = certificate.cert.poolHash;
              certificateType = "Stake Pool Delegation";
            }
            return { address, deposit, poolHash, certificateType };
          }
        }
      });
    });

    const signatures = computed(() => trxStore.witnesses);

    const trxSubmitEndPoint = computed(() => trxStore.trxSubmitEndPoint);

    const isTransactionSubmitted = ref(false);

    const submitTransactionError = ref("");

    const submitTransaction = async () => {
      submitTransactionError.value = "";
      try {
        const res = await axios.post(
          trxSubmitEndPoint.value,
          Buffer.from(trxStore.signedTransactionCBOR, "hex"),
          { headers: { "Content-Type": "application/cbor" } },
        );
        isTransactionSubmitted.value = true;

        if (res.status != 202) {
          throw "error";
        }
      } catch {
        submitTransactionError.value = "Transaction submission failed";
        isTransactionSubmitted.value = false;
      }
    };

    const closeTransactionSubmissionSuccessDialog = () => {
      isTransactionSubmitted.value = false;
      trxStore.reset();
      router.push("/transaction/buildTransaction");
    };

    const isSubmitButtonDisabled = computed(
      () =>
        !transactionHash.value ||
        !trxSubmitEndPoint.value ||
        !signatures.value.length,
    );

    const isShowSignature = ref(false);

    const addSignature = () => {
      isShowSignature.value = true;
    };

    return {
      transactionHash,
      transactionFee,
      inputs,
      outputs,
      mints,
      signatures,
      submitTransaction,
      trxSubmitEndPoint,
      isTransactionSubmitted,
      closeTransactionSubmissionSuccessDialog,
      transactionHashLink,
      submitTransactionError,
      isSubmitButtonDisabled,
      certificates,
      isShowSignature,
      addSignature,
    };
  },
});
</script>
