<template>
  <div class="cardWhite flex flex-col gap-y-4">
    <div class="headingBadge">
      <span>Input #{{ index }}</span>
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
          <div class="errorMessage">{{ trxIdErrorMessage }}</div>
        </div>
        <div class="w-full md:w-44 flex flex-col gap-y-1">
          <label class="inputLabel" for="utxoIndex">INDEX</label>
          <input
            id="utxoIndex"
            class="inputField"
            type="text"
            placeholder="0"
            v-model="indexField"
            @input="onIndexInput"
          />
          <div class="errorMessage">{{ indexErrorMessage }}</div>
        </div>
      </div>
      <div class="flex flex-col gap-y-3 md:flex-row gap-x-4 w-full">
        <div class="w-full flex flex-col gap-y-1">
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
        <div class="w-full md:w-96 flex flex-col gap-y-1">
          <label class="inputLabel" for="amount">ADA</label>
          <input
            id="amount"
            class="inputField"
            type="text"
            placeholder="0.000000"
            @input="onAmountInput"
            v-model="amountField"
          />
          <div class="errorMessage">{{ amountErrorMessage }}</div>
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
          @onClick="clearInput"
        >
          <Eraser class="text-red-500 size-4" />
          <span class="text-xs text-red-500">Clear</span>
        </AppButton>
        <AppButton
          size="sm"
          btnClass="border border-red-500 bg-red-50 space-x-2"
          @onClick="deleteInput"
        >
          <Delete class="text-red-500 size-4" />
          <span class="text-xs text-red-500">Delete</span>
        </AppButton>
      </div>
    </div>
  </div>
</template>
<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script lang="ts">
import AppButton from "@/components/buttons/appButton/appButton.vue";
import { computed, ref, watch } from "vue";
import { useInputStore } from "../store/store";
import AddTokenDialog from "../../addTokenDialog/addTokenDialog.vue";
import DialogBox from "@/components/dialog/dialog.vue";
import { utils as TyphonUtils } from "@stricahq/typhonjs";
import { isHexString } from "@/utils/inputValidators/inputValidators";
import ShelleyTypeAddress from "@stricahq/typhonjs/dist/address/ShelleyTypeAddress";
import Delete from "@/assets/icons/delete.vue";
import Eraser from "@/assets/icons/eraser.vue";
import TokenBadge from "@/components/tokenBadge/tokenBadge.vue";
import { Network } from "@/enums/networks";
import { onlyNumbers, sanitizeAmount } from "@/utils/utils";

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
    const inputStore = useInputStore();

    const input = computed(() => {
      return inputStore.getInputById(props.id);
    });

    const trxIdErrorMessage = ref("");
    const addressErrorMessage = ref("");
    const indexErrorMessage = ref("");
    const amountErrorMessage = ref("");

    //transaction Id
    const trxIdField = ref(input.value?.txId);

    watch(trxIdField, () => {
      inputStore.setInputField(props.id, "txId", trxIdField.value as string);
      trxIdErrorMessage.value = "";
    });

    //address
    const addressField = ref(input.value?.address);

    watch(addressField, () => {
      inputStore.setInputField(
        props.id,
        "address",
        addressField.value as string,
      );
      addressErrorMessage.value = "";
    });

    //amount
    const amountField = ref(input.value?.amount);

    watch(amountField, () => {
      inputStore.setInputField(props.id, "amount", amountField.value as string);
      amountErrorMessage.value = "";
    });

    const onAmountInput = (event: any) => {
      amountField.value = sanitizeAmount(event.target.value);
    };

    //index
    const indexField = ref(input.value?.index);

    watch(indexField, () => {
      inputStore.setInputField(props.id, "index", indexField.value as string);
      indexErrorMessage.value = "";
    });

    const onIndexInput = (event: any) => {
      indexField.value = onlyNumbers(event.target.value);
    };

    const tokensList = computed(() => {
      return inputStore.getInputById(props.id)?.tokens ?? [];
    });

    const showAddTokenDialog = ref(false);

    const addToken = (data: {
      policyId: string;
      assetName: string;
      amount: string;
    }) => {
      closeAddTokenDialog();
      inputStore.addToken({
        trxId: props.id,
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

    const deleteToken = (id: number) => {
      inputStore.deleteToken({ trxId: props.id, tokenId: id });
    };

    const clearInput = () => {
      inputStore.clearInput(props.id);
      trxIdField.value = input.value?.txId;
      indexField.value = input.value?.index;
      addressField.value = input.value?.address;
      amountField.value = input.value?.amount;
    };

    const deleteInput = () => {
      inputStore.deleteInput(props.id);
    };

    const isFormValid = () => {
      if (!trxIdField.value) {
        trxIdErrorMessage.value = "Required";
      } else {
        if (!isHexString(trxIdField.value as string)) {
          trxIdErrorMessage.value =
            "Invalid format. Use only hexadecimal characters";
        } else if (trxIdField.value.length != 64) {
          trxIdErrorMessage.value = "Must be 64 characters long.";
        }
      }

      if (!addressField.value) {
        addressErrorMessage.value = "Required";
      } else {
        try {
          const addressObj = TyphonUtils.getAddressFromString(
            addressField.value as string,
          ) as any;

          const selectedNetwork = localStorage.getItem(
            "cardanoLabSelectedNetwork",
          ) as Network;

          if (
            (addressObj.networkId == 0 && selectedNetwork == Network.MAINNET) ||
            (addressObj.networkId == 1 && selectedNetwork == Network.PREPROD)
          ) {
            addressErrorMessage.value =
              "Address is not a valid " + selectedNetwork + " address.";
          }
          if (!(addressObj instanceof ShelleyTypeAddress)) {
            addressErrorMessage.value = "Only shelley address supported";
          }
        } catch {
          addressErrorMessage.value = "Invalid address";
        }
      }

      if (!indexField.value) {
        indexErrorMessage.value = "Required";
      }

      if (!amountField.value) {
        amountErrorMessage.value = "Required";
      }

      if (
        trxIdErrorMessage.value ||
        addressErrorMessage.value ||
        indexErrorMessage.value ||
        amountErrorMessage.value
      ) {
        return false;
      }

      return true;
    };
    return {
      addToken,
      deleteToken,
      trxIdField,
      indexField,
      amountField,
      addressField,
      tokensList,
      clearInput,
      deleteInput,
      showAddTokenDialog,
      openAddTokenDialog,
      closeAddTokenDialog,
      isFormValid,
      trxIdErrorMessage,
      addressErrorMessage,
      amountErrorMessage,
      indexErrorMessage,
      onAmountInput,
      onIndexInput,
    };
  },
};
</script>
