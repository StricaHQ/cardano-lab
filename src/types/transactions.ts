import type { RewardAddress } from "@stricahq/typhonjs/dist/address";
import type { BipPath, CertificateType } from "@stricahq/typhonjs/dist/types";

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

export type CertificateTrxItem = {
  id: number;
  poolHash: string;
  deposit: string;
  address: RewardAddress;
  stakePath: BipPath;
  certificateType: CertificateType;
};
