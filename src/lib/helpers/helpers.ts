import {
  address as TyphonAddress,
  types as TyphonTypes,
} from "@stricahq/typhonjs";
import { type BipPath, type CryptoCurrencyId } from "../types/types";
import { getNetworkParameters } from "./networks";
import type { Bip32PublicKey } from "@stricahq/bip32ed25519";

export function getBipPath(params: {
  account: number;
  chain: number;
  index: number;
}): BipPath {
  return {
    purpose: 1852,
    coin: 1815,
    account: params.account,
    chain: params.chain,
    index: params.index,
  };
}

export function toBipPathString(path: BipPath): string {
  return `${path.purpose}'/${path.coin}'/${path.account}'/${path.chain}/${path.index}`;
}

export function toBipPathObject(path: string): BipPath {
  const regEx = /^(\d*)'\/(\d*)'\/(\d*)'\/(\d*)\/(\d*)/;
  const result = path.match(regEx);
  if (result == null) {
    throw new Error("Invalid derivation path");
  }
  return {
    purpose: parseInt(result[1], 10),
    coin: parseInt(result[2], 10),
    account: parseInt(result[3], 10),
    chain: parseInt(result[4], 10),
    index: parseInt(result[5], 10),
  };
}

export function getBaseAddress(
  accountXPub: Bip32PublicKey,
  currencyId: CryptoCurrencyId,
  paymentPath: BipPath,
  stakePath: BipPath,
): TyphonAddress.BaseAddress {
  const networkParams = getNetworkParameters(currencyId);
  const paymentHashHex = accountXPub
    .derive(paymentPath.chain)
    .derive(paymentPath.index)
    .toPublicKey()
    .hash();
  const stakeHashHex = accountXPub
    .derive(stakePath.chain)
    .derive(stakePath.index)
    .toPublicKey()
    .hash();

  const address = new TyphonAddress.BaseAddress(
    networkParams.networkId,
    {
      type: TyphonTypes.HashType.ADDRESS,
      hash: paymentHashHex,
      bipPath: paymentPath,
    },
    {
      type: TyphonTypes.HashType.ADDRESS,
      hash: stakeHashHex,
      bipPath: stakePath,
    },
  );

  return address;
}

export const getRewardAddress = (
  accountXPub: Bip32PublicKey,
  currencyId: CryptoCurrencyId,
  stakePath: BipPath,
) => {
  const networkParams = getNetworkParameters(currencyId);

  const stakeHashHex = accountXPub
    .derive(stakePath.chain)
    .derive(stakePath.index)
    .toPublicKey()
    .hash();

  const rewardAddress = new TyphonAddress.RewardAddress(
    networkParams.networkId,
    {
      hash: stakeHashHex,
      type: TyphonTypes.HashType.ADDRESS,
      bipPath: stakePath,
    },
  );

  return rewardAddress;
};
