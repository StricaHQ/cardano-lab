import type { MintTrxItem } from "@/types/transactions";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useMintStore = defineStore("mintStore", () => {
  //mint

  const mintId = ref<number>(0);
  const mintAssetId = ref<number>(0);

  const mints = ref<Array<MintTrxItem>>([]);

  const addMint = () => {
    mints.value.push({
      id: mintId.value++,
      policyScript: "",
      assets: [],
    });
  };

  const getMintById = (id: number) => {
    return mints.value.find((item) => item.id === id);
  };

  const setMintField = (
    id: number,
    mintField: "policyScript",
    value: string,
  ) => {
    const mint = getMintById(id);
    if (!mint) return;
    mint[mintField] = value;
  };

  const addAsset = (id: number) => {
    const mint = getMintById(id);
    if (!mint) return;
    mint.assets.push({
      id: mintAssetId.value++,
      amount: "",
      assetName: "",
    });
  };

  const getMintAssetById = (mint: MintTrxItem, assetId: number) => {
    return mint.assets.find((asset) => asset.id === assetId);
  };

  const updateAsset = ({
    id,
    assetId,
    field,
    value,
  }: {
    id: number;
    assetId: number;
    field: "assetName" | "amount";
    value: string;
  }) => {
    const mint = getMintById(id);

    if (!mint) return;
    const asset = getMintAssetById(mint, assetId);
    if (!asset) return;

    asset[field] = value;
  };

  const deleteAsset = ({ id, assetId }: { id: number; assetId: number }) => {
    const mint = getMintById(id);
    if (mint) {
      mint.assets = mint.assets.filter((item) => item.id !== assetId);
    }
    if (!mint?.assets.length) addAsset(id);
  };

  const clearMint = (id: number) => {
    const mint = getMintById(id);
    if (mint) {
      mint.policyScript = "";
      mint.assets = [];
    }
  };

  const deleteMint = (id: number) => {
    mints.value = mints.value.filter((item) => item.id !== id);
  };

  const reset = () => {
    mintId.value = 0;
    mintAssetId.value = 0;
    mints.value = [];
  };

  return {
    mints,
    addMint,
    getMintById,
    getMintAssetById,
    setMintField,
    addAsset,
    updateAsset,
    deleteAsset,
    clearMint,
    deleteMint,
    reset,
  };
});
