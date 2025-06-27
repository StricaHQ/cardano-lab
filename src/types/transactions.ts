type Tokens = {
  id: number;
  name: string;
  amount: string;
};

export type InputTrxItem = {
  id: number;
  trxId: string;
  trxIndex: string;
  adaAmount: string;
  tokens: Array<Tokens>;
};

export type OutputTrxItem = {
  id: number;
  address: string;
  adaAmount: string;
  tokens: Array<Tokens>;
};
