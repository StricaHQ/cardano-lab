export enum DerivationChain {
  externalKey = 0,
  internalKey = 1,
  stakingKey = 2,
  dRepKey = 3,
  ccColdKey = 4,
  ccHotKey = 5,
}

export type CryptoCurrencyId = "cardano" | "cardano_testnet";

export enum NetworkId {
  MAINNET = 1,
  TESTNET = 0,
}

export type BipPath = {
  purpose: number;
  coin: number;
  account: number;
  chain: number;
  index: number;
};

export type CardanoNetworkParameters = {
  identifier: string;
  networkId: NetworkId;
  chainStartTime: number;
  byronSlotDuration: number;
  byronSlotsPerEpoch: number;
  shelleyStartEpoch: number;
  shelleySlotDuration: number;
  shelleySlotsPerEpoch: number;
  addressPrefix: string;
};

export type ShelleyAddress = {
  type: "BaseAddress";
  addressHex: string;
  addressBech32: string;
  paymentKey: {
    pubKey: string;
    pubKeyHashHex: string;
    path: string;
  };
  stakeKey: {
    pubKey: string;
    pubKeyHashHex: string;
    path: string;
  };
};

export type AccountCredential = {
  hash: string;
  type: "ADDRESS" | "SCRIPT";
  path: BipPath;
};
