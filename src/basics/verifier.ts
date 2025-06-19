import { Types } from '@kiltprotocol/credentials'
import { Verifier } from '@kiltprotocol/sdk-js'
import { DidDocument } from '@kiltprotocol/types'

export async function checkStatus(
  credential: Types.VerifiableCredential
): Promise<boolean> {
  // Check the status of the credential
  const { status, verified, error } = await Verifier.checkStatus({
    credential,
  })
  if (error) {
    throw new Error(`Error checking status: ${error}`)
  }

  if (verified) {
    console.log('Credential is verified')
  }

  console.log('Status:', status)

  return verified
}

export async function verifyCredential(
  credential: Types.VerifiableCredential
): Promise<void> {
  // Verify the credential
  const { statusResult, proofResults, verified, error } =
    await Verifier.verifyCredential({
      credential,
    })

  if (verified) {
    console.log('Credential is verified')
  } else {
    throw new Error(`Error verifying credential: ${error}`)
  }

  if (!statusResult) {
    console.log('No status result returned')
    return
  }
  if (proofResults) {
    console.log('Proof results:', proofResults)
  }
}

export async function verifyPresentation({
  presentation,
  challenge,
  issuerDid,
}: {
  presentation: Types.VerifiablePresentation
  challenge: string
  issuerDid: DidDocument
}): Promise<void> {
  // Verify the presentation
  const { proofResults, credentialResults, verified, error } =
    await Verifier.verifyPresentation({
      presentation,
      verificationCriteria: {
        challenge,
        verifier: issuerDid.id,
      },
    })

  if (verified) {
    console.log('Presentation is verified')
  } else {
    throw new Error(`Error verifying presentation: ${error}`)
  }
  if (!credentialResults) {
    console.log('No credential results returned')
    return
  }
  if (proofResults) {
    console.log('Proof results:', proofResults)
  }
}
