export type Token = {
  id: number;
  policyId: string;
  assetName: string;
  amount: string;
};

export type InputTrxItem = {
  id: number;
  txId: string;
  index: string;
  amount: string;
  address: string;
  tokens: Array<Token>;
};

export type OutputTrxItem = {
  id: number;
  address: string;
  amount: string;
  tokens: Array<Token>;
};
