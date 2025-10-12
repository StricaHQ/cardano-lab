<template>
  <div class="flex flex-col gap-y-5">
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
                {{ transaction.getFee() || "-----" }}
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
      <!-- certificate -->
      <div class="w-full card1 flex flex-col gap-y-2">
        <div class="flex items-center gap-x-2">
          <div class="w-2 h-2 rounded-full bg-gray-800"></div>
          <div>
            <span class="textColor1 text-sm font-medium">CERTIFICATES</span>
          </div>
        </div>

        <div v-if="!inputs.length">----</div>
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
    </div>
  </div>
</template>

<script lang="ts">
import CopyButton from "@/components/buttons/CopyButton.vue";
import { computed, defineComponent, type PropType } from "vue";
import TokenBadge from "@/components/TokenBadge.vue";
import { Network } from "@/enums/networks";
import {
  convertLovelaceToADA,
  getCardanoScanTransactionURL,
} from "@/utils/utils";
import type { Token } from "@stricahq/typhonjs/dist/types";
import {
  Transaction,
  address as TyphonAddress,
  types as TyphonTypes,
} from "@stricahq/typhonjs";
import { getNetworkParameters } from "@/lib/helpers/networks";

export default defineComponent({
  components: { CopyButton, TokenBadge },
  props: {
    transaction: { type: Transaction as PropType<Transaction>, required: true },
    transactionHash: { type: String, required: true },
    currentNetwork: { type: String, required: false, default: "" },
  },
  setup(props) {
    const transactionHashLink = computed(() =>
      getCardanoScanTransactionURL({
        currentNetwork: props.currentNetwork,
        transactionId: props.transactionHash,
      }),
    );

    const inputs = computed(() => {
      const inputs = props.transaction.getInputs();

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
      const outputs = props.transaction.getOutputs();

      return outputs.map((output) => {
        return {
          address: output.address.getBech32(),
          amount: convertLovelaceToADA(output.amount),
          tokens: formatToken(output.tokens),
        };
      });
    });

    const certificates = computed(() => {
      const certificates = props.transaction.getCertificates();

      const currencyId =
        props.currentNetwork === Network.MAINNET
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
              deposit = certificate.cert.deposit.toNumber();
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

    function formatToken(tokens: Token[]) {
      return tokens.map((token) => {
        return {
          policyId: token.policyId,
          assetName: token.assetName,
          amount: token.amount.toString(),
        };
      });
    }

    return {
      inputs,
      outputs,
      transactionHashLink,
      certificates,
    };
  },
});
</script>
