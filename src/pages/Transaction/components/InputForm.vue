<template>
  <div class="cardWhite flex flex-col gap-y-4">
    <div class="headingBadge">
      <span>Input #{{ trxCount }}</span>
    </div>
    <div class="flex flex-col gap-y-3">
      <div class="flex flex-col gap-y-3 md:flex-row gap-x-4 w-full">
        <div class="w-full flex flex-col gap-y-1">
          <label class="inputLabel" for="utxo">UTXO</label>
          <input
            id="utxo"
            class="inputField"
            type="text"
            placeholder="Transaction Id"
            v-model="trxIdField"
          />
        </div>
        <div class="w-full md:w-44 flex flex-col gap-y-1">
          <label class="inputLabel" for="utxoIndex">INDEX</label>
          <input
            id="utxoIndex"
            class="inputField"
            type="number"
            placeholder="0"
            v-model="trxIndexField"
          />
        </div>
      </div>
      <div class="flex gap-x-4 w-full">
        <div class="w-full md:w-[500px] flex flex-col gap-y-1">
          <label class="inputLabel" for="adaAmount">ADA</label>
          <input
            id="adaAmount"
            class="inputField"
            type="number"
            placeholder="0.0000"
            v-model="adaAmountField"
          />
        </div>
      </div>
      <div class="flex gap-x-4 w-full">
        <div class="w-full flex flex-col gap-y-1">
          <label class="inputLabel" for="tokens">TOKENS</label>
          <div
            class="flex gap-x-4 items-center flex-wrap justify-start gap-y-4 mt-2"
          >
            <TokenBadge
              v-for="token in tokensList"
              :key="token.name"
              :tokenName="token.name"
              :tokenAmount="token.amount"
              :enableDelete="true"
              @deleteToken="deleteToken(token.id)"
            />
            <AppButton
              :isDisabled="false"
              size="sm"
              btnClass="bg-secondary"
              @onClick="addTokens"
            >
              <span class="text-xs text-white">Add Token</span></AppButton
            >
          </div>
        </div>
      </div>
    </div>
    <div class="w-full flex justify-center md:justify-end mt-4">
      <div class="flex gap-x-4 flex-wrap gap-y-2">
        <AppButton
          size="sm"
          btnClass="border border-red-500 hover:border-red-700 space-x-2"
          @onClick="clearTrxItem"
        >
          <font-awesome-icon
            class="text-red-500 text-xs"
            :icon="['fas', 'eraser']"
          />
          <span class="text-xs text-red-500">Clear</span></AppButton
        >
        <AppButton
          size="sm"
          btnClass="border border-red-500 bg-red-50 space-x-2"
          @onClick="deleteTrxItem"
        >
          <font-awesome-icon
            class="text-red-500 text-xs"
            :icon="['fas', 'trash']"
          />
          <span class="text-xs text-red-500">Delete</span></AppButton
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import AppButton from "@/components/buttons/AppButton.vue";
import { computed } from "vue";
import { useTransactionsStore } from "../store";
import TokenBadge from "@/components/TokenBadge.vue";

export default {
  props: {
    trxCount: { type: Number, required: true },
    trxItemId: { type: Number, required: true },
  },
  components: { AppButton, TokenBadge },
  setup(props) {
    const trxStore = useTransactionsStore();

    const transaction = computed(() => {
      return trxStore.getInputTrxById(props.trxItemId);
    });

    const trxIdField = computed({
      get() {
        return transaction.value?.trxId;
      },
      set(value) {
        if (value) {
          trxStore.setInputTrxFields(props.trxItemId, "trxId", value);
        }
      },
    });

    const adaAmountField = computed({
      get() {
        return transaction.value?.adaAmount;
      },
      set(value) {
        if (value) {
          trxStore.setInputTrxFields(props.trxItemId, "adaAmount", value);
        }
      },
    });
    const trxIndexField = computed({
      get() {
        return transaction.value?.trxIndex;
      },
      set(value) {
        if (value) {
          trxStore.setInputTrxFields(props.trxItemId, "trxIndex", value);
        }
      },
    });

    const tokensList = computed(() => {
      return trxStore.getInputTrxById(props.trxItemId)?.tokens ?? [];
    });

    function addTokens() {
      trxStore.addTokensToInputTrx(props.trxItemId, "example", "1234");
    }

    function deleteToken(id: number) {
      trxStore.deleteInputTrxToken(props.trxItemId, id);
    }

    function clearTrxItem() {
      trxStore.clearInputTrxItem(props.trxItemId);
    }

    function deleteTrxItem() {
      trxStore.deleteInputTrx(props.trxItemId);
    }

    return {
      addTokens,
      deleteToken,
      trxIdField,
      trxIndexField,
      adaAmountField,
      tokensList,
      clearTrxItem,
      deleteTrxItem,
    };
  },
};
</script>
