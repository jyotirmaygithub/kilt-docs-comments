import * as Kilt from '@kiltprotocol/sdk-js'
import type {
  SignerInterface,
  DidDocument,
  MultibaseKeyPair,
  KiltAddress,
} from '@kiltprotocol/types'

export async function generateDid(
  authenticationKeyPair: MultibaseKeyPair,
  submitter: SignerInterface<'Ed25519', KiltAddress>
): Promise<{ didDocument: DidDocument; signers: SignerInterface[] }> {
  const api = Kilt.ConfigService.get('api')

  // submitter is the entity (DID/account) that pays the transaction fee and puts the DID on the blockchain.
  const transactionHandler = Kilt.DidHelpers.createDid({
    api,
    signers: [authenticationKeyPair],
    submitter: submitter,
    fromPublicKey: authenticationKeyPair.publicKeyMultibase,
  })

  const didDocumentTransactionResult = await transactionHandler.submit()

  if (didDocumentTransactionResult.status !== 'confirmed') {
    console.log(didDocumentTransactionResult.status)
    throw new Error('create DID failed')
  }

  // The signer objects that are now linked to this DID — and can be used to sign future transactions (like issuing credentials, presentations, etc.)
  let { didDocument, signers } = didDocumentTransactionResult.asConfirmed
  console.log(`ISSUER_DID_URI=${didDocument.id}`)
  return { didDocument, signers }
}
