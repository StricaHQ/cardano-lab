import * as bip39 from "bip39";

export function generateSeedWord(entropy: number): string {
  return bip39.generateMnemonic(entropy);
}
