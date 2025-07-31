<template>
  <div class="cardWhite flex flex-col gap-y-4">
    <div class="headingBadge">
      <span>Output #{{ trxCount }}</span>
    </div>
    <div class="flex flex-col gap-y-3">
      <div class="flex flex-col gap-y-3 md:flex-row gap-x-4 w-full">
        <div class="w-full md:w-[750px] flex flex-col gap-y-1">
          <label class="inputLabel" for="address">Address</label>
          <input
            id="address"
            class="inputField"
            type="text"
            placeholder="Address"
            v-model="addressField"
          />
          <div class="errorMessage">{{ addressErrorMessage }}</div>
        </div>
      </div>
      <div class="flex gap-x-4 w-full">
        <div class="w-full md:w-[500px] flex flex-col gap-y-1">
          <label class="inputLabel" for="amount">ADA</label>
          <input
            id="amount"
            class="inputField"
            type="text"
            placeholder="0.000000"
            @input="onInputAmount"
            v-model="amountField"
          />
          <div class="errorMessage">{{ amountErrorMessage }}</div>
        </div>
      </div>
      <div class="flex gap-x-4 w-full">
        <div class="w-full flex flex-col gap-y-1">
          <label class="inputLabel" for="tokens">TOKENS</label>
          <div
            class="flex gap-x-4 items-center flex-wrap justify-start gap-y-4"
          >
            <div
              v-for="token in tokensList"
              :key="token.id"
              class="max-w-max h-9 rounded-md bg-primary/[0.2] pl-0.5 pr-2 py-0.5 border border-primary/[0.1] flex gap-x-2 items-center"
            >
              <div
                class="h-full min-w-12 max-w-max px-4 bg-white rounded-md flex justify-center items-center"
              >
                <span class="text-xs textColor flex break-all font-medium">{{
                  token.policyId
                }}</span>
              </div>
              <div class="w-max flex items-center justify-between gap-x-4">
                <div class="flex gap-8">
                  <span class="textColor1 text-sm break-all">{{
                    token.assetName
                  }}</span>
                  <span class="textColor1 text-sm font-LabMono">{{
                    token.amount
                  }}</span>
                </div>
                <button @click="deleteToken(token.id)">
                  <Close class="text-red-500 size-3.5" />
                </button>
              </div>
            </div>
            <AppButton
              size="sm"
              btnClass="bg-secondary"
              @onClick="openAddTokenDialog"
            >
              <span class="text-xs text-white">Add Token</span>
            </AppButton>

            <DialogBox
              :openDialog="showAddTokenDialog"
              dialogSize="sm"
              @closeDialog="closeAddTokenDialog"
            >
              <template #header> Add Token </template>
              <template #body>
                <AddTokenDialog @updateTokenData="addTokens" />
              </template>
            </DialogBox>
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
          <Eraser class="text-red-500 size-4" />
          <span class="text-xs text-red-500">Clear</span>
        </AppButton>
        <AppButton
          size="sm"
          btnClass="border border-red-500 bg-red-50 space-x-2"
          @onClick="deleteTrxItem"
        >
          <Delete class="text-red-500 size-4" />
          <span class="text-xs text-red-500">Delete</span>
        </AppButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import AppButton from "@/components/buttons/AppButton.vue";
import { computed, ref, watch } from "vue";
import { useTransactionsStore } from "../store";
import DialogBox from "@/components/dialog/dialog.vue";
import AddTokenDialog from "./addTokenDialog.vue";
import { utils as TyphonUtils } from "@stricahq/typhonjs";
import Delete from "@/assets/icons/delete.vue";
import Eraser from "@/assets/icons/eraser.vue";
import Close from "@/assets/icons/close.vue";

export default {
  components: { AppButton, DialogBox, AddTokenDialog, Delete, Eraser, Close },
  props: {
    trxCount: { type: Number, required: true },
    trxItemId: { type: Number, required: true },
  },
  setup(props) {
    const trxStore = useTransactionsStore();

    const transaction = computed(() => {
      return trxStore.getOutputTrxById(props.trxItemId);
    });

    const addressErrorMessage = ref("");
    const amountErrorMessage = ref("");

    //address
    const addressField = ref(transaction.value?.address);

    watch(addressField, () => {
      trxStore.setOutputTrxFields(
        props.trxItemId,
        "address",
        addressField.value as string,
      );
      addressErrorMessage.value = "";
    });

    //amount
    const amountField = ref(transaction.value?.amount);

    watch(amountField, () => {
      trxStore.setOutputTrxFields(
        props.trxItemId,
        "amount",
        amountField.value as string,
      );
      amountErrorMessage.value = "";
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function onInputAmount(event: any) {
      const raw = event.target.value;
      if (raw.match(/^(\d+)?(\.\d{0,6})?$/)) {
        amountField.value = raw;
      } else {
        amountField.value = raw
          .replace(/[^0-9.]/g, "") // Remove non-numeric and non-dot
          .replace(/^([^.]*\.)|\./g, "$1") // Keep only the first dot
          .replace(/^(\d*\.\d{0,6}).*$/, "$1"); // Limit to 6 decimals
      }
    }

    const tokensList = computed(() => {
      return trxStore.getOutputTrxById(props.trxItemId)?.tokens ?? [];
    });

    const showAddTokenDialog = ref(false);

    function addTokens(data: {
      policyId: string;
      assetName: string;
      amount: string;
    }) {
      closeAddTokenDialog();
      trxStore.addTokensToOutputTrx({
        trxId: props.trxItemId,
        policyId: data.policyId,
        assetName: data.assetName,
        amount: data.amount,
      });
    }

    function openAddTokenDialog() {
      showAddTokenDialog.value = true;
    }

    function closeAddTokenDialog() {
      showAddTokenDialog.value = false;
    }

    function deleteToken(id: number) {
      trxStore.deleteOutputTrxToken({ trxId: props.trxItemId, tokenId: id });
    }

    function clearTrxItem() {
      trxStore.clearOutputTrxItem(props.trxItemId);
      addressField.value = transaction.value?.address;
      amountField.value = transaction.value?.amount;
    }

    function deleteTrxItem() {
      trxStore.deleteOutputTrx(props.trxItemId);
    }

    function isFormValid() {
      if (!addressField.value) {
        addressErrorMessage.value = "Required";
      } else {
        try {
          TyphonUtils.getAddressFromString(addressField.value as string);
        } catch {
          addressErrorMessage.value = "Invalid address";
        }
      }

      if (!amountField.value) {
        amountErrorMessage.value = "Required";
      }

      if (addressErrorMessage.value || amountErrorMessage.value) return false;

      return true;
    }

    return {
      addressField,
      amountField,
      addTokens,
      deleteToken,
      tokensList,
      clearTrxItem,
      deleteTrxItem,
      showAddTokenDialog,
      openAddTokenDialog,
      closeAddTokenDialog,
      onInputAmount,
      addressErrorMessage,
      amountErrorMessage,
      isFormValid,
    };
  },
};
</script>
