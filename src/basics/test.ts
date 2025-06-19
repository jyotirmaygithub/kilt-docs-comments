import * as Kilt from '@kiltprotocol/sdk-js'
import { verifyDid } from './addVerification2Did'
import { generateAccounts } from './generateAccount'
import { generateDid } from './generateDid'
import { KiltAddress, SignerInterface } from '@kiltprotocol/types'
import { issueCredential } from './issueCredential'
import { claimW3N } from './claimW3N'
import { releaseW3N } from './releaseW3N'
import {
  checkStatus,
  verifyCredential,
  verifyPresentation,
} from './verifier'
import { didResolve } from './didResolve'
import { deleteDid } from '../advance/deleteDid'
import { createCredentialPresentation, derivedProof } from './holder'
import { getSubmittable, handleSubmittable } from './getSubmittable'

async function runAll(): Promise<void> {

  // connecting to the test net of the klit blockchain.
  let api = await Kilt.connect('wss://peregrine.kilt.io/')

  console.log('connected')

  const faucetMnemonic =
    'receive clutch item involve chaos clutch furnace arrest claw isolate okay together'

  // generating public and private keys. 
  const faucet = Kilt.generateKeypair({ seed: faucetMnemonic })

  // getSignersForKeypair --> transforms a raw keypair (like { publicKey, secretKey }) into a signer object compatible with KILT’s DID and transaction system.
  const [submitter] = (await Kilt.getSignersForKeypair({
    keypair: faucet,
    type: 'Ed25519',
  })) as Array<SignerInterface<'Ed25519', KiltAddress>>
  console.log('submitter address', submitter.id)

  // this is what do we have inside the submitter.
  //[
  //   {
  //     id: '4pNXoq...',
  //     type: 'Ed25519',
  //     sign: (data) => ...
  //   }
  // ]

  const balance = await api.query.system.account(submitter.id)
  console.log('balance', balance.toHuman())
  let { holderAccount, issuerAccount, getSubmittableAccount } =
    generateAccounts()
  console.log('Successfully transferred tokens')

  let holderDid = await generateDid(holderAccount, submitter)
  const name = `testname${Math.floor(Math.random() * 10000)}`

  console.log("holder did = ", holderDid.signers);
  console.log("signere = ", submitter);

  console.log('user name', name)
  console.log("not found did web3name = ",holderDid.didDocument.alsoKnownAs);

  await claimW3N(name, holderDid.didDocument, holderDid.signers, submitter)

  await releaseW3N(holderDid.didDocument, holderDid.signers, submitter)

  let issuerDid = await generateDid(issuerAccount, submitter)

  await didResolve(issuerDid.didDocument.id)

  issuerDid = await verifyDid(
    issuerDid.didDocument,
    issuerDid.signers,
    submitter
  )

  const credential = await issueCredential(
    issuerDid.didDocument,
    holderDid.didDocument,
    issuerDid.signers,
    submitter
  )

  console.log('Credential', credential)

  await verifyCredential(credential)
  await checkStatus(credential)

  const { presentation, challenge } = await createCredentialPresentation(
    [credential],
    holderDid.didDocument,
    holderDid.signers,
    issuerDid.didDocument
  )
  console.log('Presentation', presentation)

  await verifyPresentation({
    presentation,
    challenge,
    issuerDid: issuerDid.didDocument,
  })
  await derivedProof(credential)

  const submittableHex = await getSubmittable(
    getSubmittableAccount,
    submitter.id
  )

  await handleSubmittable(submittableHex, submitter)
  console.log('Submittable handled')

  await deleteDid(issuerDid.didDocument, issuerDid.signers, submitter)

  await deleteDid(holderDid.didDocument, holderDid.signers, submitter)

  await api.disconnect()
  console.log('disconnected')
}

runAll()
  .then(() => {
    console.log('All done')
  })
  .catch((error) => {
    console.error('Error:', error)
  })
  .finally(() => {
    console.log('Finally')
    process.exit()
  })
