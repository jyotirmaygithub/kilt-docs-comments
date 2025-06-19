import * as Kilt from "@kiltprotocol/sdk-js";
import * as kiltUtils from "@kiltprotocol/utils";
import * as KiltDid from "@kiltprotocol/did";
import axios from "axios";
import { mnemonicGenerate } from "@polkadot/util-crypto";

const signingKeyPairType = "ed25519";
async function main() {
  let api = await Kilt.connect("wss://peregrine.kilt.io/");
  console.log("Connected to KILT network:", api.isConnected);

  const keypairs = generateKeypairs();
  console.log("Generated keypairs:", keypairs);

  createSimpleLightDid([keypairs.authentication], [keypairs.keyAgreement]);

  
}

async function disconnect() {
  await Kilt.disconnect();
}
export function generateKeypairs(mnemonic = mnemonicGenerate()) {
  const authentication = kiltUtils.Crypto.makeKeypairFromUri(mnemonic);

  const assertionMethod = kiltUtils.Crypto.makeKeypairFromUri(mnemonic);

  const capabilityDelegation = kiltUtils.Crypto.makeKeypairFromUri(mnemonic);

  const keyAgreement = kiltUtils.Crypto.makeEncryptionKeypairFromSeed(
    kiltUtils.Crypto.mnemonicToMiniSecret(mnemonic)
  );

  return {
    authentication: authentication,
    keyAgreement: keyAgreement,
    assertionMethod: assertionMethod,
    capabilityDelegation: capabilityDelegation,
    mnemonic: mnemonic,
  };
}

export function createSimpleLightDid(authentication, keyAgreement) {
  const lightDid = KiltDid.createLightDidDocument({
    authentication,
    keyAgreement,
  });
  console.log("Light DID Document:", lightDid);

  return lightDid;
}

export async function createSimpleFullDid(
  submitterAccount,
  { authentication },
  signCallback
) {
  const api = Kilt.ConfigService.get("api");

  // Generate the DID-signed creation tx and submit it to the blockchain with the specified account.
  // The submitter account parameter, ensures that only an entity authorized by the DID subject
  // can submit the tx to the KILT blockchain.
  const fullDidCreationTx = await KiltDid.getStoreTx(
    {
      authentication: [authentication],
    },
    submitterAccount.address,
    signCallback
  );

  await Kilt.Blockchain.signAndSubmitTx(fullDidCreationTx, submitterAccount);

  // The new information is fetched from the blockchain and returned.
  const fullDid = KiltDid.getFullDidUriFromKey(authentication);
  const encodedUpdatedDidDetails = await api.call.did.query(
    KiltDid.toChain(fullDid)
  );
  return KiltDid.linkedInfoFromChain(encodedUpdatedDidDetails).document;
}

main();
