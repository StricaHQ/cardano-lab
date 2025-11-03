<template>
  <div class="cardWhite flex flex-col gap-y-4">
    <div class="headingBadge">
      <span>Output #{{ index }}</span>
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
            <TokenBadge
              v-for="token in tokensList"
              :key="token.id"
              :policyId="token.policyId"
              :assetName="token.assetName"
              :amount="token.amount"
              :enableDelete="true"
              @deleteToken="deleteToken(token.id)"
            />
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
                <AddTokenDialog @updateTokenData="addToken" />
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
          @onClick="clearOutput"
        >
          <Eraser class="text-red-500 size-4" />
          <span class="text-xs text-red-500">Clear</span>
        </AppButton>
        <AppButton
          size="sm"
          btnClass="border border-red-500 bg-red-50 space-x-2"
          @onClick="deleteOutput"
        >
          <Delete class="text-red-500 size-4" />
          <span class="text-xs text-red-500">Delete</span>
        </AppButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import AppButton from "@/components/buttons/appButton/appButton.vue";
import { computed, ref, watch } from "vue";
import DialogBox from "@/components/dialog/dialog.vue";
import AddTokenDialog from "../../addTokenDialog/addTokenDialog.vue";
import { utils as TyphonUtils } from "@stricahq/typhonjs";
import Delete from "@/assets/icons/delete.vue";
import Eraser from "@/assets/icons/eraser.vue";
import TokenBadge from "@/components/tokenBadge/tokenBadge.vue";
import { useOutputStore } from "../store/store";
import { sanitizeAmount } from "@/utils/utils";

export default {
  components: {
    AppButton,
    DialogBox,
    AddTokenDialog,
    Delete,
    Eraser,
    TokenBadge,
  },
  props: {
    index: { type: Number, required: true },
    id: { type: Number, required: true },
  },
  setup(props) {
    const outputStore = useOutputStore();

    const output = computed(() => {
      return outputStore.getOutputById(props.id);
    });

    const addressErrorMessage = ref("");
    const amountErrorMessage = ref("");

    //address
    const addressField = ref(output.value?.address);

    watch(addressField, () => {
      outputStore.setOutputFields(
        props.id,
        "address",
        addressField.value as string,
      );
      addressErrorMessage.value = "";
    });

    //amount
    const amountField = ref(output.value?.amount);

    watch(amountField, () => {
      outputStore.setOutputFields(
        props.id,
        "amount",
        amountField.value as string,
      );
      amountErrorMessage.value = "";
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onInputAmount = (event: any) => {
      amountField.value = sanitizeAmount(event.target.value);
    };

    const tokensList = computed(() => {
      return outputStore.getOutputById(props.id)?.tokens ?? [];
    });

    const showAddTokenDialog = ref(false);

    const addToken = (data: {
      policyId: string;
      assetName: string;
      amount: string;
    }) => {
      closeAddTokenDialog();
      outputStore.addToken({
        id: props.id,
        policyId: data.policyId,
        assetName: data.assetName,
        amount: data.amount,
      });
    };

    const openAddTokenDialog = () => {
      showAddTokenDialog.value = true;
    };

    const closeAddTokenDialog = () => {
      showAddTokenDialog.value = false;
    };

    const deleteToken = (tokenId: number) => {
      outputStore.deleteToken({ id: props.id, tokenId: tokenId });
    };

    const clearOutput = () => {
      outputStore.clearOutput(props.id);
      addressField.value = output.value?.address;
      amountField.value = output.value?.amount;
    };

    const deleteOutput = () => {
      outputStore.deleteOutput(props.id);
    };

    const isFormValid = () => {
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
    };

    return {
      addressField,
      amountField,
      addToken,
      deleteToken,
      tokensList,
      clearOutput,
      deleteOutput,
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
