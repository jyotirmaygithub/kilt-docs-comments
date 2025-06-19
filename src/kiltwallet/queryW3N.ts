import { ConfigService } from '@kiltprotocol/sdk-js'

export async function queryW3N(): Promise<void> {
  const api = ConfigService.get('api')
  const alice = 'testw3nabc1452'
  const aliceDid = 'did:kilt:4t2ggt4eZHYHeYhtm934wrEbu17wyafTrMZjCkcC9HRZW77g'

  // Checks if a DID has a web3name registered
  // strip the DID prefix to check
  // returns the web3name if it is registered
  const checksDIDW3N = await api.query.web3Names.names(
    aliceDid.replace('did:kilt:', '')
  )
  console.log('The web3name claimed by DID', checksDIDW3N.toHuman())

  // Checks if the name is registered and returns the owner
  // the owner includes the DID and block which the owner claimed the web3name
  // returns also the deposit owner of the web3name can be different from the owner.
  const did = await api.query.web3Names.owner(alice)
  console.log(`DID Owner of given web3name: ${alice}`, did.toHuman())
}