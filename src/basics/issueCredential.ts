import * as Kilt from '@kiltprotocol/sdk-js'
import { CType } from '@kiltprotocol/credentials'
import type {
  SignerInterface,
  DidDocument,
  KiltAddress,
} from '@kiltprotocol/types'
import { Types } from '@kiltprotocol/credentials'

export async function issueCredential(
  issuerDid: DidDocument,
  holderDid: DidDocument,
  signers: SignerInterface[],
  submitter: SignerInterface<'Ed25519', KiltAddress>
): Promise<Types.VerifiableCredential> {
  const usernameCType = await CType.fetchFromChain(
    'kilt:ctype:0x05f099b888ddf3e8ef4fc690f12ca59d967bf934d58dda723921893cff0d8734'
  )

  // this one is to create creadential by the issuer for the holder.
  const usernameCredential = await Kilt.Issuer.createCredential({
    issuer: issuerDid.id,
    credentialSubject: {
      id: holderDid.id,
      Username: 'Testname',
    },
    cType: usernameCType.cType,
  })

  // issued credential for the holder as updated on the blockchian.
  const credential = await Kilt.Issuer.issue({
    credential: usernameCredential,
    issuer: {
      didDocument: issuerDid,
      signers: [...signers, submitter],
      submitter,
    },
  })

  console.log('credential issued')
  return credential
}
