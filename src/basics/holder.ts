import { Holder } from '@kiltprotocol/sdk-js'
import { DidDocument, SignerInterface } from '@kiltprotocol/types'
import { randomAsHex } from '@polkadot/util-crypto'

import { Types } from '@kiltprotocol/credentials'

export async function createCredentialPresentation(
  credential: Types.VerifiableCredential[],
  holderDid: DidDocument,
  signers: SignerInterface[],
  issuerDid: DidDocument
): Promise<{ presentation: Types.VerifiablePresentation; challenge: string }> {
  // Create a presentation
  const challenge = randomAsHex()

  // presentation is not the credential itself — it’s a signed proof of the credential
  const presentation = await Holder.createPresentation({
    credentials: credential,
    holder: { didDocument: holderDid, signers },
    presentationOptions: {
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24),
      verifier: issuerDid.id,
    },
    proofOptions: { challenge },
  })

  return { presentation, challenge }
}

export async function derivedProof(
  credential: Types.VerifiableCredential
): Promise<void> {
  const derivedProof = await Holder.deriveProof({
    credential,
    proofOptions: {
      includeClaims: ['/credentialSubject/Username'],
    },
  })
  console.log('derived proof', derivedProof)
}
