<template>
  <div class="cardWhite flex flex-col gap-y-4">
    <div class="headingBadge">
      <span> Mint #{{ mintCount }}</span>
    </div>
    <div class="flex flex-col gap-y-3">
      <div class="flex flex-col gap-y-3 md:flex-row gap-x-4 w-full">
        <div class="w-full md:w-[750px] flex flex-col gap-y-1">
          <label class="inputLabel" for="">Policy Script</label>
          <textarea
            id="policyScript"
            v-model="policyScriptField"
            class="textarea"
            type="text"
            placeholder="Policy Script"
            rows="8"
          />
          <div class="errorMessage">{{ policyScriptErrorMessage }}</div>
        </div>
      </div>

      <div class="flex gap-x-4 w-full">
        <div class="w-full flex flex-col gap-y-1">
          <label class="inputLabel" for="tokens">Assets</label>
          <div
            class="flex gap-x-4 items-center flex-wrap justify-start gap-y-4"
          >
            <AssetBadge
              v-for="asset in filteredAssets"
              :key="asset.id"
              :assetName="asset.assetName"
              :amount="asset.amount"
              :enableDelete="true"
              @deleteAsset="deleteAsset(asset.id)"
            />
            <AppButton
              size="sm"
              btnClass="bg-secondary"
              @onClick="openAddAssetDialog"
            >
              <span class="text-xs text-white">
                {{ filteredAssets.length ? "Update" : "Add" }} Assets</span
              >
            </AppButton>

            <DialogBox
              :openDialog="showAddAssetDialog"
              dialogSize="2xl"
              @closeDialog="closeAddAssetDialog"
            >
              <template #header> Add Assets </template>
              <template #body>
                <div>
                  <div
                    v-if="areAssetsHasError"
                    class="text-xs text-red-500 border border-red-300 bg-red-500/10 px-2 py-2 rounded-md my-4"
                  >
                    Please check the highlighted fields and provide the
                    necessary information.
                  </div>
                  <div class="flex flex-col gap-y-4 max-h-[70vh] overflow-auto">
                    <div class="flex flex-col gap-y-2">
                      <div
                        class="cardWhite flex flex-col gap-y-4"
                        v-for="(asset, index) in assets"
                        :key="asset.id"
                      >
                        <AssetForm
                          ref="assetForm"
                          :assetCount="index + 1"
                          :asset="asset"
                          :mintId="mintId"
                        />
                      </div>
                    </div>
                    <AppButton
                      @onClick="addAsset"
                      btnClass="bg-secondary max-w-max"
                    >
                      <span class="text-white text-xs">Add Asset</span>
                    </AppButton>
                  </div>
                </div>
              </template>
            </DialogBox>
          </div>
          <div class="errorMessage">{{ assetsListErrorMessage }}</div>
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
import Delete from "@/assets/icons/delete.vue";
import Eraser from "@/assets/icons/eraser.vue";
import AssetBadge from "./mintAssets/assetBadge.vue";
import AssetForm from "./mintAssets/assetForm.vue";

export default {
  components: {
    AppButton,
    DialogBox,
    AssetForm,
    Delete,
    Eraser,
    AssetBadge,
  },
  props: {
    mintCount: { type: Number, required: true },
    mintId: { type: Number, required: true },
  },
  setup(props) {
    const trxStore = useTransactionsStore();

    const transaction = computed(() => {
      return trxStore.getMintTrxById(props.mintId);
    });

    const assetForm = ref();

    const policyScriptErrorMessage = ref("");
    const assetsListErrorMessage = ref("");
    const areAssetsHasError = ref(false);
    //policyScript
    const policyScriptField = ref(transaction.value?.policyScript);

    watch(policyScriptField, () => {
      trxStore.setMintTrxFields(
        props.mintId,
        "policyScript",
        policyScriptField.value as string,
      );
      policyScriptErrorMessage.value = "";
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function onPolicyScriptInput(event: any) {
      const raw = event.target.value;
      if (raw.trim()) {
        try {
          policyScriptField.value = JSON.parse(raw);
          policyScriptErrorMessage.value = "";
        } catch {
          policyScriptField.value = "Invalid JSON format";
        }
      }
    }

    const assets = computed(
      () => trxStore.getMintTrxById(props.mintId)?.assets,
    );

    const filteredAssets = computed(() => {
      return (
        trxStore
          .getMintTrxById(props.mintId)
          ?.assets.filter(
            (asset) => asset.assetName != "" && asset.amount != "",
          ) ?? []
      );
    });

    const showAddAssetDialog = ref(false);

    function openAddAssetDialog() {
      if (!assets.value?.length)
        trxStore.addAssetsToMintTrx({ mintId: props.mintId });
      showAddAssetDialog.value = true;
    }

    function closeAddAssetDialog() {
      areAssetsHasError.value = false;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      assetForm.value.forEach((form: any) => {
        if (!form.validateForm() && !areAssetsHasError.value) {
          areAssetsHasError.value = true;
        }
      });

      if (!areAssetsHasError.value) showAddAssetDialog.value = false;
    }

    function deleteAsset(id: number) {
      trxStore.deleteMintTrxAsset({ mintId: props.mintId, assetId: id });
    }

    function clearTrxItem() {
      trxStore.clearMintTrxItem(props.mintId);
      policyScriptField.value = transaction.value?.policyScript;
    }

    function deleteTrxItem() {
      trxStore.deleteMintTrx(props.mintId);
    }

    function isFormValid() {
      if (!policyScriptField.value) {
        policyScriptErrorMessage.value = "Required";
      } else {
        try {
          JSON.parse(policyScriptField.value);
        } catch (e) {
          console.log(e);
          policyScriptErrorMessage.value = "Invalid format";
        }
      }

      if (!filteredAssets.value.length) {
        assetsListErrorMessage.value =
          "Minting requires at least one asset. Please add an asset to continue.";
      }

      if (policyScriptErrorMessage.value) return false;

      return true;
    }

    function addAsset() {
      trxStore.addAssetsToMintTrx({ mintId: props.mintId });
    }

    return {
      policyScriptField,
      deleteAsset,
      filteredAssets,
      assets,
      addAsset,
      clearTrxItem,
      deleteTrxItem,
      showAddAssetDialog,
      openAddAssetDialog,
      closeAddAssetDialog,
      onPolicyScriptInput,
      policyScriptErrorMessage,
      assetsListErrorMessage,
      isFormValid,
      areAssetsHasError,
      assetForm,
    };
  },
};
</script>
