import * as Kilt from '@kiltprotocol/sdk-js'
import type { MultibaseKeyPair } from '@kiltprotocol/types'

interface GeneratedAccounts {
  issuerAccount: MultibaseKeyPair
  holderAccount: MultibaseKeyPair
  getSubmittableAccount: MultibaseKeyPair
}

export function generateAccounts(): GeneratedAccounts {
  const issuerAccount = Kilt.generateKeypair({ type: 'ed25519' })
  const holderAccount = Kilt.generateKeypair({ type: 'ed25519' })
  const getSubmittableAccount = Kilt.generateKeypair({ type: 'ed25519' })

  console.log('keypair generation complete')
  console.log(`ISSUER_ACCOUNT_ADDRESS=${issuerAccount.publicKeyMultibase}`)
  console.log(`HOLDER_ACCOUNT_ADDRESS=${holderAccount.publicKeyMultibase}`)
  console.log(
    `GET_SUBMITTABLE_ACCOUNT_ADDRESS=${getSubmittableAccount.publicKeyMultibase}`
  )

  return { issuerAccount, holderAccount, getSubmittableAccount }
}
