import { Network } from "@/enums/networks";
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
