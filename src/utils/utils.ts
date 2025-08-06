import BigNumber from "bignumber.js";

export function convertADAToLovelace(amount: BigNumber) {
  return amount.multipliedBy(1000000);
}

export function convertLovelaceToADA(amount: BigNumber) {
  return amount.dividedBy(1000000);
}
