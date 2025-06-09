import { Bip32PrivateKey } from "@stricahq/bip32ed25519";
import * as bip39 from "bip39";
import { DEFAULT_ENTROPY_STRENGTH, HARDENED_THRESHOLD } from "./constants";
import { Account } from "./account";
import type { CryptoCurrencyId } from "./types/types";

export class CardanoWallet {
  private secret: Bip32PrivateKey;
  currencyId: CryptoCurrencyId;
  accounts: Array<Account> = [];

  constructor(secret: Bip32PrivateKey, currencyId: CryptoCurrencyId) {
    this.secret = secret;
    this.currencyId = currencyId;

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
  const mnemonic = bip39.generateMnemonic(DEFAULT_ENTROPY_STRENGTH);
  const walletSecret = await Bip32PrivateKey.fromEntropy(
    Buffer.from(bip39.mnemonicToEntropy(mnemonic), "hex"),
  );
  return new CardanoWallet(walletSecret, currencyId);
}
