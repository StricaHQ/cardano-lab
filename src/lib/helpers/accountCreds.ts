import { Bip32PublicKey } from "@stricahq/bip32ed25519";

import { type AccountCredential, DerivationChain } from "../types/types";

export const getAccountCredentialMetaByKey = (payload: {
  accountXPub: Bip32PublicKey;
  accountIndex: number;
  addressCount: number;
}): Record<string, AccountCredential> => {
  const { accountXPub, addressCount, accountIndex } = payload;
  const accountCredentialsByKey: Record<string, AccountCredential> = {};

  // stake credential
  const stakeHash = accountXPub
    .derive(DerivationChain.stakingKey)
    .derive(0)
    .toPublicKey()
    .hash()
    .toString("hex");
  accountCredentialsByKey[stakeHash] = {
    hash: stakeHash,
    type: "ADDRESS",
    path: {
      purpose: 1852,
      coin: 1815,
      account: accountIndex,
      chain: DerivationChain.stakingKey,
      index: 0,
    },
  };

  for (let index = 0; index < addressCount; index++) {
    const internalHash = accountXPub
      .derive(DerivationChain.internalKey)
      .derive(index)
      .toPublicKey()
      .hash()
      .toString("hex");
    const externalHash = accountXPub
      .derive(DerivationChain.externalKey)
      .derive(index)
      .toPublicKey()
      .hash()
      .toString("hex");

    accountCredentialsByKey[internalHash] = {
      hash: internalHash,
      type: "ADDRESS",
      path: {
        purpose: 1852,
        coin: 1815,
        account: accountIndex,
        chain: DerivationChain.internalKey,
        index,
      },
    };

    accountCredentialsByKey[externalHash] = {
      hash: externalHash,
      type: "ADDRESS",
      path: {
        purpose: 1852,
        coin: 1815,
        account: accountIndex,
        chain: DerivationChain.externalKey,
        index,
      },
    };
  }

  return accountCredentialsByKey;
};
