import { Bip32PrivateKey, Bip32PublicKey } from "@stricahq/bip32ed25519";
import {
  DerivationChain,
  type BipPath,
  type CryptoCurrencyId,
} from "./types/types";
import { getBaseAddress, getBipPath } from "./helpers/helpers";

export class Account {
  private secret: Bip32PrivateKey;
  xpub: Bip32PublicKey;
  index: number;
  currencyId: CryptoCurrencyId;

  constructor(
    secret: Bip32PrivateKey,
    index: number,
    currencyId: CryptoCurrencyId,
  ) {
    this.secret = secret;
    this.index = index;
    this.currencyId = currencyId;
    this.xpub = this.secret.toBip32PublicKey();
  }

  getReceiveAddressDetails() {
    const paymentPath = getBipPath({
      account: this.index,
      chain: DerivationChain.externalKey,
      index: 0,
    });
    const stakePath = getBipPath({
      account: this.index,
      chain: DerivationChain.stakingKey,
      index: 0,
    });
    const address = getBaseAddress(
      this.xpub,
      this.currencyId,
      paymentPath,
      stakePath,
    );
    const paymentPrivateKey = this.getPrivateKeyByPath(paymentPath);
    const stakePrivateKey = this.getPrivateKeyByPath(stakePath);

    return {
      bech32: address.getBech32(),
      paymentCredential: {
        pubKeyHashHex: paymentPrivateKey.toPublicKey().hash().toString("hex"),
        pubKeyHex: paymentPrivateKey.toPublicKey().toBytes().toString("hex"),
        privKeyHex: paymentPrivateKey.toBytes().toString("hex"),
      },
      stakeCredential: {
        pubKeyHashHex: stakePrivateKey.toPublicKey().hash().toString("hex"),
        pubKeyHex: stakePrivateKey.toPublicKey().toBytes().toString("hex"),
        privKeyHex: stakePrivateKey.toBytes().toString("hex"),
      },
    };
  }

  private getPrivateKeyByPath(path: BipPath) {
    if (path.account !== this.index) {
      throw new Error("Invalid purpose, coin or account");
    }
    return this.secret.derive(path.chain).derive(path.index).toPrivateKey();
  }
}
