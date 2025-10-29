<template>
  <div class="max-w-80 w-full relative" ref="certificatesDropdownRef">
    <AppButton
      btnClass="bg-secondary max-w-max text-white text-xs gap-4 "
      :isDisabled="!isAccountAvailable"
      @click="openCertificatesDropdown"
    >
      <span class="">Add Certificate</span>
      <ChevronDown
        class="size-3 duration-200"
        :class="isCertificatesDropdownOpen ? 'rotate-180 ' : ''"
      />
    </AppButton>
    <div
      v-if="isCertificatesDropdownOpen"
      class="absolute top-9 right-0 bg-gray-100 border border-gray-200 rounded p-1 w-full shadow-lg"
    >
      <div
        v-for="type in allowedCertificateType"
        :key="type"
        class="p-2 hover:bg-gray-200 rounded text-sm capitalize cursor-pointer"
        @click.stop="updateCertificateType(type)"
      >
        {{ getCertificateTypeInText(type) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref } from "vue";
import { useCertificateStore } from "./store";
import { CertificateType } from "@stricahq/typhonjs/dist/types";
import ChevronDown from "@/assets/icons/chevronDown.vue";
import AppButton from "@/components/buttons/AppButton.vue";

export default defineComponent({
  components: { ChevronDown, AppButton },
  props: { isAccountAvailable: { type: Boolean, required: true } },
  setup() {
    const certificateStore = useCertificateStore();

    const isCertificatesDropdownOpen = ref(false);
    const certificatesDropdownRef = ref();

    const selectedCertificateType = ref<CertificateType>(
      CertificateType.STAKE_KEY_REGISTRATION,
    );

    const updateCertificateType = (type: CertificateType) => {
      certificateStore.addCertificate(type);
      closeCertificatesDropdown();
    };

    const openCertificatesDropdown = () => {
      isCertificatesDropdownOpen.value = true;
    };

    const closeCertificatesDropdown = () => {
      isCertificatesDropdownOpen.value = false;
    };

    const onClickOutside = (event: MouseEvent) => {
      if (
        isCertificatesDropdownOpen.value &&
        certificatesDropdownRef.value &&
        !certificatesDropdownRef.value.contains(event.target as Node)
      ) {
        closeCertificatesDropdown();
      }
    };

    const getCertificateTypeInText = (type: CertificateType) => {
      switch (type) {
        case CertificateType.STAKE_KEY_REGISTRATION:
          return "Stake Key Registration";
        case CertificateType.STAKE_DELEGATION:
          return "Stake Pool Delegation";
        default:
          return type;
      }
    };

    onMounted(() => {
      document.addEventListener("click", onClickOutside);
    });

    onBeforeUnmount(() => {
      document.removeEventListener("click", onClickOutside);
    });

    return {
      CertificateType,
      isCertificatesDropdownOpen,
      selectedCertificateType,
      certificatesDropdownRef,
      updateCertificateType,
      openCertificatesDropdown,
      closeCertificatesDropdown,
      getCertificateTypeInText,
      allowedCertificateType: certificateStore.allowedCertificateType,
    };
  },
});
</script>
