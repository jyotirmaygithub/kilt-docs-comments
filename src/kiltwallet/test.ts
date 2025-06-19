import * as Kilt from "@kiltprotocol/sdk-js";
import { generateAccounts } from "./generateAccount";
import { generateDid } from "./generateDid";
import { claimW3N } from "./claimW3N";
import { verifyDid } from "./addVerification2Did";
import { issueCredential } from "./issueCredential";
import { Balances, KiltAddress, SignerInterface } from "@kiltprotocol/types";
import { mnemonicGenerate } from "@polkadot/util-crypto";
import { queryW3N } from "./queryW3N";

async function runAll(): Promise<void> {
  //1 kilt wallet connection
  let api = await Kilt.connect("wss://peregrine.kilt.io/");

  console.log("connected");
  // await queryW3N();
  
  //for 
  // const keypair = Kilt.generateKeypair({
  //   seed: mnemonicGenerate(),
  //   type: "ed25519",});
  // console.log("keypair", keypair);


  const faucet = {
    publicKey: new Uint8Array([
      238, 93, 102, 137, 215, 142, 38, 187, 91, 53, 176, 68, 23, 64, 160, 101,
      199, 189, 142, 253, 209, 193, 84, 34, 7, 92, 63, 43, 32, 33, 181, 210,
    ]),
    secretKey: new Uint8Array([
      205, 253, 96, 36, 210, 176, 235, 162, 125, 84, 204, 146, 164, 76, 217,
      166, 39, 198, 155, 45, 189, 161, 94, 215, 229, 128, 133, 66, 81, 25, 174,
      3,
    ]),
  };
  //2 get submitter from pub and secret key
  const [submitter] = (await Kilt.getSignersForKeypair({
    keypair: faucet,
    type: "Ed25519",
  })) as Array<SignerInterface<"Ed25519", KiltAddress>>;

  const balance = await api.query.system.account(submitter.id);
  // console.log("balance", balance.toHuman());

  //3 generate accounts
  let { holderAccount, issuerAccount } = generateAccounts();
  console.log("Successfully transferred tokens");

  //4 generate holder dids
  let holderDid = await generateDid(submitter, holderAccount);

  //5 claim w3name
  // await claimW3N(
  //   "testw3nabc1452",
  //   holderDid.didDocument,
  //   holderDid.signers,
  //   submitter
  // );

  //6 genrate issuer dids
  let issuerDid = await generateDid(submitter, issuerAccount);

  //7 verify issuer did
  issuerDid = await verifyDid(
    submitter,
    issuerDid.didDocument,
    issuerDid.signers
  );
  
  console.log("Issuer DID verified verify response:", issuerDid);

  //8 get credential
  const credential = await issueCredential(
    issuerDid.didDocument,
    holderDid.didDocument,
    issuerDid.signers,
    submitter
  );


  // console.log("Credential", credential);
  const config_api = Kilt.ConfigService.get("api");
  console.log("config api", config_api.tx.balances);

  await api.disconnect();
  console.log("disconnected");
}

runAll()
  .then(() => {
    console.log("All done");
  })
  .catch((error) => {
    console.error("Error:", error);
  })
  .finally(() => {
    console.log("Finally");
    process.exit();
  });
