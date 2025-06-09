import {
  NetworkId,
  type CardanoNetworkParameters,
  type CryptoCurrencyId,
} from "../types/types";

export const getNetworkParameters = (
  currencyId: CryptoCurrencyId,
): CardanoNetworkParameters => {
  if (currencyId === "cardano") {
    return {
      identifier: "cardano",
      networkId: NetworkId.MAINNET,
      chainStartTime: 1506203091000,
      byronSlotDuration: 20000,
      byronSlotsPerEpoch: 21600,
      shelleyStartEpoch: 208,
      shelleySlotDuration: 1000,
      shelleySlotsPerEpoch: 432000,
      addressPrefix: "addr",
    };
  }
  if (currencyId === "cardano_testnet") {
    return {
      identifier: "cardano_testnet",
      networkId: NetworkId.TESTNET,
      chainStartTime: 1654041600000,
      byronSlotDuration: 20000,
      byronSlotsPerEpoch: 21600,
      shelleyStartEpoch: 4,
      shelleySlotDuration: 1000,
      shelleySlotsPerEpoch: 432000,
      addressPrefix: "addr_test",
    };
  }

  throw new Error(`No network parameters set for ${currencyId}`);
};
