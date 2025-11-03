import { ref } from "vue";

export function useCopyContent(timeout = 2000) {
  const isCopied = ref(false);

  async function copyToClipboard(content: string) {
    try {
      await navigator.clipboard.writeText(content);
      isCopied.value = true;

      setTimeout(() => {
        isCopied.value = false;
      }, timeout);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  }

  return {
    isCopied,
    copyToClipboard,
  };
}
