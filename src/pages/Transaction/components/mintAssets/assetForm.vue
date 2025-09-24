<template>
  <div class="flex flex-col gap-2">
    <div class="headingBadge">
      <span> Asset #{{ assetCount }}</span>
    </div>
    <div class="flex flex-col gap-y-4 w-full">
      <div class="w-full flex flex-col gap-y-1">
        <label class="inputLabel" for="assetName">Asset Name</label>
        <input
          id="assetName"
          class="inputField"
          type="text"
          placeholder="Asset Name"
          v-model="assetName"
        />
        <div class="errorMessage">
          {{ assetNameErrorMessage }}
        </div>
      </div>
      <div class="w-full flex flex-col gap-y-1">
        <label class="inputLabel" for="amount">Amount</label>
        <input
          id="amount"
          class="inputField"
          type="text"
          placeholder="0"
          v-model="amount"
          @input="onAmountInput"
        />
      </div>
      <div class="errorMessage">
        {{ amountErrorMessage }}
      </div>
    </div>
    <div
      class="w-full flex justify-center md:justify-end mt-2 gap-x-4 flex-wrap gap-y-2"
    >
      <AppButton
        size="sm"
        btnClass="border border-red-500 bg-red-50 space-x-2"
        @onClick="deleteAsset"
      >
        <Delete class="text-red-500 size-4" />
        <span class="text-xs text-red-500">Delete</span>
      </AppButton>
    </div>
  </div>
</template>

<script lang="ts">
import AppButton from "@/components/buttons/AppButton.vue";
import { computed, defineComponent, ref, watch, type PropType } from "vue";
import { isHexString } from "@/utils/inputValidators";
import { useTransactionsStore } from "../../store";
import type { Asset } from "@/types/transactions";
import Delete from "@/assets/icons/delete.vue";

export default defineComponent({
  components: { AppButton, Delete },
  props: {
    mintId: { type: Number, required: true },
    asset: { type: Object as PropType<Asset>, required: true },
    assetCount: { type: Number, required: true },
  },
  setup(props) {
    const trxStore = useTransactionsStore();

    const amount = ref(props.asset.amount);
    const assetName = ref(props.asset.assetName);

    const assetNameErrorMessage = ref("");
    const amountErrorMessage = ref("");

    const isButtonDisabled = computed(() => {
      if (!amount.value || !assetName.value) return true;
      else return false;
    });

    watch(assetName, () => {
      assetNameErrorMessage.value = "";

      if (assetName.value && !isHexString(assetName.value)) {
        assetNameErrorMessage.value =
          "Invalid format. Use only hexadecimal characters.";
      }

      trxStore.updateMintAsset({
        mintId: props.mintId,
        assetId: props.asset.id,
        field: "assetName",
        value: assetName.value,
      });
    });

    watch(amount, () => {
      amountErrorMessage.value = "";

      trxStore.updateMintAsset({
        mintId: props.mintId,
        assetId: props.asset.id,
        field: "amount",
        value: amount.value,
      });
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function onAmountInput(event: any) {
      // Remove anything that's not a digit
      amount.value = event.target.value.replace(/\D+/g, "");
    }

    function deleteAsset() {
      trxStore.deleteMintTrxAsset({
        trxId: props.mintId,
        assetId: props.asset.id,
      });
    }

    function validateForm() {
      if (!assetName.value && !amount.value) return true;

      if (!assetName.value) assetNameErrorMessage.value = "required";

      if (!amount.value) amountErrorMessage.value = "required";

      if (assetNameErrorMessage.value.length || amountErrorMessage.value.length)
        return false;

      return true;
    }

    return {
      amount,
      assetName,
      isButtonDisabled,
      assetNameErrorMessage,
      amountErrorMessage,
      deleteAsset,
      onAmountInput,
      validateForm,
    };
  },
});
</script>
