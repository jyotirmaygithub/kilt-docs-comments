import * as Kilt from '@kiltprotocol/sdk-js'

import type {
  SignerInterface,
  DidDocument,
  KiltAddress,
} from '@kiltprotocol/types'

export async function claimW3N(
  name: string,
  holderDid: DidDocument,
  signers: SignerInterface[],
  submitter: SignerInterface<'Ed25519', KiltAddress>
): Promise<string[] | undefined> {
  //  getting access to the connected KILT blockchain client, so you can use its functions to interact with the blockchain.
  const api = Kilt.ConfigService.get('api')

  //Prepare web3 name to submit on the blockchian — but don't submit it to the blockchain yet
  const claimName = api.tx.web3Names.claim(name)

  // ttaches the Web3Name (W3N) to the DID and stores that link on the KILT blockchain. with other function as well.
  const transaction = await Kilt.DidHelpers.transact({
    api,
    call: claimName,
    didDocument: holderDid,
    signers: [...signers, submitter],
    submitter: submitter,
  }).submit()

  if (!transaction.asConfirmed) {
    console.log(transaction.status)
    throw new Error('claim W3N failed')
  }

  console.log(
    'Web3 Name Claim',
    transaction.asConfirmed.didDocument.alsoKnownAs
  )
  return transaction.asConfirmed.didDocument.alsoKnownAs
}
