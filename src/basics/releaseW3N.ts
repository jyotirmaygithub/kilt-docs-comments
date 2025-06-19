import { ConfigService, DidHelpers } from '@kiltprotocol/sdk-js'
import { DidDocument, KiltAddress, SignerInterface } from '@kiltprotocol/types'

export async function releaseW3N(
  holderDid: DidDocument,
  signers: SignerInterface[],
  submitter: SignerInterface<'Ed25519', KiltAddress>
) {
  const api = ConfigService.get('api')
  let transactionHandler = api.tx.web3Names.releaseByOwner()

  // realising the web3name and also from the did as well.
  let transaction = DidHelpers.transact({
    api,
    call: transactionHandler,
    didDocument: holderDid,
    signers: [...signers],
    submitter: submitter,
  })

  const release = await transaction.submit()

  if (release.status !== 'confirmed') {
    throw new Error(`release W3N failed ${release.status}`)
  }

  console.log('Web3 Name Release', release.asConfirmed.didDocument.alsoKnownAs)

  return release.asConfirmed
}
