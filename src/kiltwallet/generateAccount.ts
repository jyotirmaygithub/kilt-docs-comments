import * as Kilt from "@kiltprotocol/sdk-js";
import type { MultibaseKeyPair } from "@kiltprotocol/types";
import { mnemonicGenerate, mnemonicToMiniSecret } from "@polkadot/util-crypto";
import { u8aToHex } from "@polkadot/util";
import { Keyring } from "@polkadot/keyring/cjs/keyring";
import type { KeyringPair } from "@polkadot/keyring/types";

interface GeneratedAccounts {
  issuerAccount: MultibaseKeyPair;
  holderAccount: MultibaseKeyPair;
  issuerMnemonic: string;
  holderMnemonic: string;
  issuerWallet: KeyringPair;
  holderWallet: KeyringPair;
}

export function generateAccounts(): GeneratedAccounts {
  const keyring = new Keyring({ type: "sr25519", ss58Format: 38 }); // KILT chain
  const derivation = "//did//0";
  const issuerMnemonic = mnemonicGenerate();
  const holderMnemonic = mnemonicGenerate();

  const issuerSeed = u8aToHex(mnemonicToMiniSecret(issuerMnemonic));
  const holderSeed = u8aToHex(mnemonicToMiniSecret(holderMnemonic));

  const issuerAccount = Kilt.generateKeypair({
    seed: `${issuerMnemonic}${derivation}`,
    type: "sr25519",
  });

  const holderAccount = Kilt.generateKeypair({
    seed: `${holderMnemonic}${derivation}`,
    type: "sr25519",
  });

  const issuerWallet = keyring.addFromMnemonic(issuerMnemonic);
  const holderWallet = keyring.addFromMnemonic(holderMnemonic);

  console.log("=== ISSUER ===");
  console.log("Mnemonic:", issuerMnemonic);
  console.log("DID publicKey:", issuerAccount.publicKeyMultibase);
  console.log("Wallet Address:", issuerWallet.address);

  console.log("=== HOLDER ===");
  console.log("Mnemonic:", holderMnemonic);
  console.log("DID publicKey:", holderAccount.publicKeyMultibase);
  console.log("Wallet Address:", holderWallet.address);

  return {
    holderAccount,
    issuerAccount,
    holderMnemonic,
    issuerMnemonic,
    holderWallet,
    issuerWallet,
  };
}
