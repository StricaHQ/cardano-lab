<template>
  <div class="cardWhite flex flex-col gap-y-4">
    <div class="headingBadge">
      <span> Mint #{{ index }}</span>
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
                          :mintId="id"
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
          @onClick="clearMint"
        >
          <Eraser class="text-red-500 size-4" />
          <span class="text-xs text-red-500">Clear</span>
        </AppButton>
        <AppButton
          size="sm"
          btnClass="border border-red-500 bg-red-50 space-x-2"
          @onClick="deleteMint"
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
import Delete from "@/assets/icons/delete.vue";
import Eraser from "@/assets/icons/eraser.vue";
import AssetBadge from "@/pages/Transaction/components/mints/components/assetBadge/assetBadge.vue";
import AssetForm from "../components/assetForm/assetForm.vue";
import { useMintStore } from "../store/store";

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
    index: { type: Number, required: true },
    id: { type: Number, required: true },
  },
  setup(props) {
    const mintStore = useMintStore();

    const mint = computed(() => {
      return mintStore.getMintById(props.id);
    });

    const assetForm = ref();

    const policyScriptErrorMessage = ref("");
    const assetsListErrorMessage = ref("");
    const areAssetsHasError = ref(false);
    //policyScript
    const policyScriptField = ref(mint.value?.policyScript);

    watch(policyScriptField, () => {
      mintStore.setMintField(
        props.id,
        "policyScript",
        policyScriptField.value as string,
      );
      policyScriptErrorMessage.value = "";
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onPolicyScriptInput = (event: any) => {
      const raw = event.target.value;
      if (raw.trim()) {
        try {
          policyScriptField.value = JSON.parse(raw);
          policyScriptErrorMessage.value = "";
        } catch {
          policyScriptField.value = "Invalid JSON format";
        }
      }
    };

    const assets = computed(() => mint.value?.assets);

    const filteredAssets = computed(() => {
      return (
        mintStore
          .getMintById(props.id)
          ?.assets.filter(
            (asset) => asset.assetName != "" && asset.amount != "",
          ) ?? []
      );
    });

    const showAddAssetDialog = ref(false);

    const openAddAssetDialog = () => {
      if (!assets.value?.length) mintStore.addAsset(props.id);
      showAddAssetDialog.value = true;
    };

    const closeAddAssetDialog = () => {
      areAssetsHasError.value = false;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      assetForm.value.forEach((form: any) => {
        if (!form.validateForm() && !areAssetsHasError.value) {
          areAssetsHasError.value = true;
        }
      });

      if (!areAssetsHasError.value) showAddAssetDialog.value = false;
    };

    const deleteAsset = (id: number) => {
      mintStore.deleteAsset({ id: props.id, assetId: id });
    };

    const clearMint = () => {
      mintStore.clearMint(props.id);
      policyScriptField.value = mint.value?.policyScript;
    };

    const deleteMint = () => {
      mintStore.deleteMint(props.id);
    };

    const isFormValid = () => {
      if (!policyScriptField.value) {
        policyScriptErrorMessage.value = "Required";
      } else {
        try {
          JSON.parse(policyScriptField.value);
        } catch {
          policyScriptErrorMessage.value = "Invalid format";
        }
      }

      if (!filteredAssets.value.length) {
        assetsListErrorMessage.value =
          "Minting requires at least one asset. Please add an asset to continue.";
      }

      if (policyScriptErrorMessage.value) return false;

      return true;
    };

    const addAsset = () => {
      mintStore.addAsset(props.id);
    };

    return {
      policyScriptField,
      deleteAsset,
      filteredAssets,
      assets,
      addAsset,
      clearMint,
      deleteMint,
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
