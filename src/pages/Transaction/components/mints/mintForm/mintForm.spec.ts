import { describe, it, expect, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import MintForm from "./mintForm.vue";
import { useMintStore } from "@/pages/Transaction/components/mints/store/store";

describe("MintForm.vue", () => {
  let store: ReturnType<typeof useMintStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useMintStore();
    store.addMint();
  });

  const mountMintForm = () =>
    mount(MintForm, {
      props: { id: 1, index: 1 },
      global: {
        plugins: [createPinia()],
        stubs: {
          AssetForm: {
            template: `<div data-test="asset-form"></div>`,
            methods: { validateForm: () => true },
          },
          DialogBox: {
            template: `<div><slot name="header"></slot><slot name="body"></slot></div>`,
          },
          AppButton: {
            template: `<button @click="$emit('onClick')"><slot/></button>`,
          },
          AssetBadge: {
            template: `<div data-test="asset-badge"></div>`,
          },
          Delete: true,
          Eraser: true,
        },
      },
    });

  // 1 Basic Render Check
  it("renders mint index and UI elements correctly", () => {
    const wrapper = mountMintForm();
    expect(wrapper.text()).toContain("Mint #1");
    expect(wrapper.find("textarea#policyScript").exists()).toBe(true);
  });

  // 2 — updates policyScript in store when textarea changes
  it("updates policyScript in store when textarea changes", async () => {
    const store = useMintStore();
    store.reset();
    store.addMint(); // 👈 create mint with id 0
    const mint = store.mints[0]; // mint.id = 0

    const wrapper = mount(MintForm, {
      props: { index: 1, id: mint.id },
    });

    const textarea = wrapper.find("#policyScript");
    await textarea.setValue('{"key":"value"}');
    await flushPromises();

    const updated = store.getMintById(mint.id);
    expect(updated).toBeTruthy();
    expect(updated!.policyScript).toBe('{"key":"value"}');
  });

  // 3 Required validation for empty policyScript
  it("shows 'Required' error if policyScript is empty", () => {
    const wrapper = mountMintForm();
    const valid = wrapper.vm.isFormValid();

    expect(valid).toBe(false);
    expect(wrapper.vm.policyScriptErrorMessage).toBe("Required");
  });

  // 4 Invalid JSON format validation
  it("shows 'Invalid format' error for incorrect JSON", () => {
    const wrapper = mountMintForm();

    wrapper.vm.policyScriptField = "{invalid json}";
    const valid = wrapper.vm.isFormValid();

    expect(valid).toBe(false);
    expect(wrapper.vm.policyScriptErrorMessage).toBe("Invalid format");
  });

  // 5 Valid form when JSON and assets are correct
  it("passes validation when JSON is valid and has assets", () => {
    const store = useMintStore();
    store.reset();

    store.addMint();
    const mint = store.mints[0]; // get the actual mint
    store.setMintField(mint.id, "policyScript", '{"valid":true}');

    // simulate one valid asset
    store.addAsset(mint.id);
    const asset = store.getMintById(mint.id)!.assets[0];
    asset.assetName = "TokenA";
    asset.amount = "100";

    const wrapper = mount(MintForm, {
      props: { index: 0, id: mint.id },
    });

    const valid = wrapper.vm.isFormValid();
    expect(valid).toBe(true);
    expect(wrapper.vm.policyScriptErrorMessage).toBe("");
  });

  // 6 clearMint() resets mint fields
  it("clears policyScript and assets when clearMint() called", () => {
    const wrapper = mountMintForm();

    store.addMint();
    store.setMintField(1, "policyScript", "data");
    store.addAsset(1);

    wrapper.vm.clearMint();
    const mint = store.getMintById(0);
    expect(mint?.policyScript).toBe("");
    expect(mint?.assets.length).toBe(0);
  });

  // 7 deleteMint() removes mint from store
  it("removes mint from store when deleteMint() called", async () => {
    const store = useMintStore();
    store.reset();
    store.addMint(); // creates mint with id 0
    const mint = store.mints[0];

    const wrapper = mount(MintForm, {
      props: { index: 1, id: mint.id },
    });

    expect(store.mints.length).toBe(1);

    wrapper.vm.deleteMint();
    await flushPromises();

    expect(store.mints.length).toBe(0);
  });

  // 8 opens addAssetDialog correctly
  it("opens addAssetDialog correctly", () => {
    const wrapper = mountMintForm();

    expect(wrapper.vm.showAddAssetDialog).toBe(false);
    wrapper.vm.openAddAssetDialog();
    expect(wrapper.vm.showAddAssetDialog).toBe(true);
  });

  // 9 closes dialog when all asset forms are valid
  it("closes dialog when all asset forms are valid", () => {
    const wrapper = mountMintForm();

    wrapper.vm.showAddAssetDialog = true;
    wrapper.vm.assetForm = [{ validateForm: () => true }];

    wrapper.vm.closeAddAssetDialog();
    expect(wrapper.vm.showAddAssetDialog).toBe(false);
    expect(wrapper.vm.areAssetsHasError).toBe(false);
  });

  // 10 prevent addAssetDialog from closing if asset form is invalid
  it("keeps dialog open if an asset form is invalid", () => {
    const wrapper = mountMintForm();

    wrapper.vm.showAddAssetDialog = true;
    wrapper.vm.assetForm = [{ validateForm: () => false }];

    wrapper.vm.closeAddAssetDialog();
    expect(wrapper.vm.showAddAssetDialog).toBe(true);
    expect(wrapper.vm.areAssetsHasError).toBe(true);
  });
});
