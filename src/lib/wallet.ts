import { Bip32PrivateKey } from "@stricahq/bip32ed25519";
import * as bip39 from "bip39";
import { DEFAULT_ENTROPY_STRENGTH, HARDENED_THRESHOLD } from "./constants";
import { Account } from "./account";
import type { CryptoCurrencyId } from "./types/types";
import type { BipPath, VKeyWitness } from "@stricahq/typhonjs/dist/types";
import { getAccountCredentialMetaByKey } from "./helpers/accountCreds";
import { createWitness } from "./helpers/transaction";

export class CardanoWallet {
  private secret: Bip32PrivateKey;
  currencyId: CryptoCurrencyId;
  accounts: Array<Account> = [];
  mnemonic: string;

  constructor(
    secret: Bip32PrivateKey,
    currencyId: CryptoCurrencyId,
    mnemonic: string,
  ) {
    this.secret = secret;
    this.currencyId = currencyId;
    this.mnemonic = mnemonic;

    this.addAccount(0);
  }

  addAccount(index: number) {
    const accountXPub = this.secret
      .derive(HARDENED_THRESHOLD + 1852) // purpose
      .derive(HARDENED_THRESHOLD + 1815) // coin type
      .derive(HARDENED_THRESHOLD + index);

    this.accounts[index] = new Account(accountXPub, index, this.currencyId);
  }
}

export async function createNewWallet(
  currencyId: CryptoCurrencyId,
): Promise<CardanoWallet> {
  // const mnemonic = bip39.generateMnemonic(DEFAULT_ENTROPY_STRENGTH);
  const mnemonic =
    "crawl useless ritual frame cancel people era extend milk mixed oyster slender";
  const walletSecret = await Bip32PrivateKey.fromEntropy(
    Buffer.from(bip39.mnemonicToEntropy(mnemonic), "hex"),
  );
  return new CardanoWallet(walletSecret, currencyId, mnemonic);
}

export async function updateExistingWallet({
  currencyId,
  mnemonic,
}: {
  currencyId: CryptoCurrencyId;
  mnemonic: string;
}): Promise<CardanoWallet> {
  const walletSecret = await Bip32PrivateKey.fromEntropy(
    Buffer.from(bip39.mnemonicToEntropy(mnemonic), "hex"),
  );
  return new CardanoWallet(walletSecret, currencyId, mnemonic);
}

export function createWitnesses({
  requiredSigners,
  account,
  txHash,
}: {
  requiredSigners: Map<string, BipPath | undefined>;
  account: Account;
  txHash: Buffer;
}): Array<VKeyWitness> {
  const accountCredentialsByKey = getAccountCredentialMetaByKey({
    accountIndex: account.index,
    accountXPub: account.xpub,
    addressCount: 100,
  });

  const witnesses: Array<VKeyWitness> = [];
  for (const [key] of requiredSigners) {
    const bipPath = accountCredentialsByKey[key]?.path;
    if (bipPath !== undefined) {
      const privateKey = account.secret
        .derive(bipPath.chain)
        .derive(bipPath.index)
        .toPrivateKey();
      witnesses.push(createWitness(txHash, privateKey));
    }
  }

  return witnesses;
}
