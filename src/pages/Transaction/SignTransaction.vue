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
            <span class="textColor2 text-xs">Tokens</span>
            <div
              v-if="input.tokens.length"
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
            <div v-else>----</div>
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
          <div class="flex flex-col gap-y-0.5">
            <span class="textColor2 text-xs">Tokens</span>
            <div
              v-if="output.tokens.length"
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
      <!-- sign -->
      <!-- <div class="w-full card1 flex flex-col gap-y-2">
        <div class="flex items-center gap-x-2">
          <div class="w-2 h-2 rounded-full bg-gray-800"></div>
          <div>
            <span class="textColor1 text-sm font-medium">SIGN</span>
          </div>
        </div>
        <div class="cardWhite cardWhite flex flex-col gap-y-4">
          <div class="headingBadge">
            <span>Private Keys</span>
          </div>
          <div v-for="key in privateKeys" :key="key.id" class="flex gap-x-4">
            <input type="text" class="inputField" />
            <AppButton
              @onClick="deletePrivateKey(key.id)"
              btnClass="bg-red-50 space-x-2"
              size="xs"
            >
              <span>
                <font-awesome-icon
                  class="text-red-500 text-xs"
                  :icon="['fas', 'trash']"
              /></span>
            </AppButton>
          </div>

          <AppButton
            size="sm"
            btnClass="bg-secondary max-w-max"
            @onClick="addPrivateKey"
          >
            <span class="text-xs text-white">Add</span></AppButton
          >
        </div>
      </div> -->
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
import CopyButton from "@/components/buttons/CopyButton.vue";
import { computed, defineComponent, ref } from "vue";
import TokenBadge from "@/components/TokenBadge.vue";
import AppButton from "@/components/buttons/AppButton.vue";
import { useTransactionsStore } from "./store";
import axios from "axios";
import DialogBox from "@/components/dialog/dialog.vue";
import Check from "@/assets/icons/check.vue";
import { Network } from "@/enums/networks";
import { useRouter } from "vue-router";
import { convertLovelaceToADA } from "@/utils/utils";
import type { Token } from "@stricahq/typhonjs/dist/types";
export default defineComponent({
  components: { CopyButton, TokenBadge, AppButton, DialogBox, Check },
  setup() {
    const trxStore = useTransactionsStore();

    const transactionHash = computed(
      () => trxStore.transactionResponse.transactionHash,
    );

    const transactionHashLink = computed(
      () =>
        "https://" +
        (trxStore.currentNetwork == Network.PREPROD ? "preprod." : "") +
        "cardanoscan.io/transaction/" +
        transactionHash.value,
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

    function formatToken(tokens: Token[]) {
      return tokens.map((token) => {
        return {
          policyId: token.policyId,
          assetName: token.assetName,
          amount: token.amount.toString(),
        };
      });
    }
    const signatures = computed(() => trxStore.witnesses);

    const privateKeyId = ref<number>(0);
    const privateKeys = ref<Array<{ id: number; keys: string }>>([
      { id: privateKeyId.value++, keys: "" },
    ]);

    function addPrivateKey() {
      privateKeys.value.push({ id: privateKeyId.value++, keys: "" });
    }

    function deletePrivateKey(id: number) {
      privateKeys.value = privateKeys.value.filter((key) => key.id !== id);
      if (!privateKeys.value.length) {
        addPrivateKey();
      }
    }

    const trxSubmitEndPoint = computed(() => trxStore.trxSubmitEndPoint);

    const isTransactionSubmitted = ref(false);

    const submitTransactionError = ref("");

    async function submitTransaction() {
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
    }

    const router = useRouter();

    function closeTransactionSubmissionSuccessDialog() {
      isTransactionSubmitted.value = false;
      trxStore.reset();
      router.push("/transaction/buildTransaction");
    }

    const isSubmitButtonDisabled = computed(
      () =>
        !transactionHash.value ||
        !trxSubmitEndPoint.value ||
        !signatures.value.length,
    );

    const isShowSignature = ref(false);

    function addSignature() {
      isShowSignature.value = true;
    }

    return {
      privateKeys,
      addPrivateKey,
      deletePrivateKey,
      transactionHash,
      transactionFee,
      inputs,
      outputs,
      signatures,
      submitTransaction,
      trxSubmitEndPoint,
      isTransactionSubmitted,
      closeTransactionSubmissionSuccessDialog,
      transactionHashLink,
      submitTransactionError,
      isSubmitButtonDisabled,

      isShowSignature,
      addSignature,
    };
  },
});
</script>
