import { Network } from "@/enums/networks";
import type { Token } from "@stricahq/typhonjs/dist/types";
import BigNumber from "bignumber.js";

export function convertADAToLovelace(amount: BigNumber) {
  return amount.multipliedBy(1000000);
}

export function convertLovelaceToADA(amount: BigNumber) {
  return amount.dividedBy(1000000);
}

export function getCardanoScanTransactionURL({
  currentNetwork,
  transactionId,
}: {
  currentNetwork: string | null;
  transactionId: string;
}) {
  return currentNetwork == Network.PREPROD
    ? "https://" + "preprod.cardanoscan.io/transaction/" + transactionId
    : "https://" + "cardanoscan.io/transaction/" + transactionId;
}

export function sanitizeAmount(amount: string) {
  if (amount.match(/^(\d+)?(\.\d{0,6})?$/)) {
    return amount;
  }
  return amount
    .replace(/[^0-9.]/g, "") // Remove non-numeric and non-dot
    .replace(/^([^.]*\.)|\./g, "$1") // Keep only the first dot
    .replace(/^(\d*\.\d{0,6}).*$/, "$1"); // Limit to 6 decimals
}

export function onlyNumbers(input: string) {
  return input.replace(/\D+/g, "");
}

export function formatToken(tokens: Token[] | undefined) {
  if (tokens)
    return tokens.map((token) => {
      return {
        policyId: token.policyId,
        assetName: token.assetName,
        amount: token.amount.toString(),
      };
    });
  else return [];
}
