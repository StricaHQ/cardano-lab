import { PrivateKey } from "@stricahq/bip32ed25519";
import { types as TyphonTypes } from "@stricahq/typhonjs";

export const createWitness = (
  hash: Buffer,
  privateKey: PrivateKey,
): TyphonTypes.VKeyWitness => {
  const publicKey = privateKey.toPublicKey().toBytes();
  const signature = privateKey.sign(hash);
  return {
    publicKey,
    signature,
  };
};
