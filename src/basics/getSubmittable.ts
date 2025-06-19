import { ConfigService, DidHelpers } from '@kiltprotocol/sdk-js'
import { Blockchain } from '@kiltprotocol/chain-helpers'

import {
  SignerInterface,
  KiltAddress,
  HexString,
  MultibaseKeyPair,
} from '@kiltprotocol/types'

export async function getSubmittable(
  authenticationKeyPair: MultibaseKeyPair,
  submitterAddress: KiltAddress
): Promise<HexString> {
  const api = ConfigService.get('api')

  // creating did for the new accound now.
  const transactionHandler = DidHelpers.createDid({
    api,
    signers: [authenticationKeyPair],
    submitter: submitterAddress,
    fromPublicKey: authenticationKeyPair.publicKeyMultibase,
  })

  // but we havenot submitted it yet. have a hex to proceed further.
  const didDocumentTransactionResultTx =
    await transactionHandler.getSubmittable({
      signSubmittable: false,
    })

  return didDocumentTransactionResultTx.txHex
}

export async function handleSubmittable(
  submittableHex: HexString,
  submitter: SignerInterface<'Ed25519', KiltAddress>
): Promise<void> {
  const api = ConfigService.get('api')

  // submit the pending tranaction.
  const result = await Blockchain.signAndSubmitTx(
    api.tx(submittableHex),
    submitter
  )

  if (result.isError) {
    throw new Error('Transaction failed')
  }

  console.log(result.toHuman())
}
