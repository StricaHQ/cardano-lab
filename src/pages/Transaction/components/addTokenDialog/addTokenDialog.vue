<template>
  <div class="flex flex-col gap-y-3 gap-x-4 w-full">
    <div class="w-full flex flex-col gap-y-1">
      <label class="inputLabel" for="policyId">Policy Id</label>
      <input
        id="policyId"
        class="inputField"
        type="text"
        placeholder="Policy Id"
        v-model="policyId"
      />
      <div class="errorMessage">
        {{ policyIdErrorMessage }}
      </div>
    </div>
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
    <AppButton
      :isDisabled="isButtonDisabled"
      class="mt-6"
      size="sm"
      btnClass="bg-secondary"
      @onClick="addToken"
    >
      <span class="text-xs text-white">Add Token</span>
    </AppButton>
  </div>
</template>

<script lang="ts">
import AppButton from "@/components/buttons/appButton/appButton.vue";
import { computed, defineComponent, ref, watch } from "vue";
import { isHexString } from "@/utils/inputValidators/inputValidators";
import { onlyNumbers } from "@/utils/utils";

export default defineComponent({
  components: { AppButton },
  emits: ["updateTokenData"],
  setup(_, { emit }) {
    const amount = ref("");
    const policyId = ref("");
    const assetName = ref("");

    const assetNameErrorMessage = ref("");
    const policyIdErrorMessage = ref("");

    const isButtonDisabled = computed(() => {
      if (!amount.value || !policyId.value || !assetName.value) return true;
      else return false;
    });

    watch(policyId, () => {
      policyIdErrorMessage.value = "";
    });

    watch(assetName, () => {
      assetNameErrorMessage.value = "";
    });

    const addToken = () => {
      if (!isHexString(policyId.value)) {
        policyIdErrorMessage.value =
          "Invalid format. Use only hexadecimal characters.";
        return;
      }
      if (policyId.value.length != 56) {
        policyIdErrorMessage.value = "Must be 56 characters long.";
        return;
      }
      if (!isHexString(assetName.value)) {
        assetNameErrorMessage.value =
          "Invalid format. Use only hexadecimal characters.";
        return;
      }

      if (isButtonDisabled.value) return;
      emit("updateTokenData", {
        assetName: assetName.value,
        policyId: policyId.value,
        amount: amount.value,
      });
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onAmountInput = (event: any) => {
      amount.value = onlyNumbers(event.target.value);
    };
    return {
      amount,
      policyId,
      assetName,
      isButtonDisabled,
      policyIdErrorMessage,
      assetNameErrorMessage,
      addToken,
      onAmountInput,
    };
  },
});
</script>
