import { ConfigService, DidHelpers } from '@kiltprotocol/sdk-js'
import { DidDocument, KiltAddress, SignerInterface } from '@kiltprotocol/types'

export async function deleteDid(
  didDocument: DidDocument,
  signers: SignerInterface[],
  submitter: SignerInterface<'Ed25519', KiltAddress>
): Promise<void> {
  const api = ConfigService.get('api')

  const transactionHandler = DidHelpers.deactivateDid({
    api,
    signers,
    submitter,
    didDocument,
  })

  const result = await transactionHandler.submit()
  if (result.status === 'failed') {
    console.error('Error deleting DID:', result.asFailed)
    return
  } else if (result.status === 'confirmed') {
    console.log('Did deleted successfully')
    return
  }
}
