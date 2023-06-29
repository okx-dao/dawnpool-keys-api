<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ yarn install
```

## Environment
Following params must be provided for running.  

|       Variable        | Required |                Default/Example                 |                                               Description                                               |
|:---------------------:|:--------:|:----------------------------------------------:|:-------------------------------------------------------------------------------------------------------:|
|         PORT          |   Yes    |                      3000                      |                                               Listen port                                               |
| CORS_WHITELIST_REGEXP |    No    |              ^https?://127.0.0.1$              |                                 The specified cors can be be accessible                                 |
|       LOG_LEVEL       |   Yes    |                      info                      |                         One of following: debug, info, notice, warning or error                         |
|      EL_API_URLS      |   Yes    |             http://127.0.0.1:8545              |                                        Execution client address                                         |
|        DB_NAME        |   Yes    |               dawn_pool_keys_db                |                                         Postgres database name                                          |
|        DB_PORT        |   Yes    |                      5432                      |                                              Database port                                              |
|        DB_HOST        |   Yes    |                   localhost                    |                                              Database host                                              |
|        DB_USER        |   Yes    |                    postgres                    |                                           Database user name                                            |
|      DB_PASSWORD      |   Yes    |                    postgres                    |                                            Database password                                            |
|       DB_DEBUG        |    No    |                     false                      |                                      Enable database debug config                                       |
|      CL_API_URLS      |   Yes    |             http://127.0.0.1:5052              |                                        Consensus client address                                         |
|   ENCRYPT_PASSWORD    |    No    |                                                |            If defined, the exit message will be encrypted before being saved to the database            |
| DAWN_STORAGE_CONTRACT |   Yes    |   0xf0718B4182C67Bbb94c0eDe3850cD41a4c44Ab6d   |                                      Dawn storage contract address                                      |
|    HARD_FORK_EPOCH    |   Yes    |                     180000                     |        The epoch of the last hard fork. The exit epoch of a exit message must larger than that.         |
|       ACCOUNTS        |    No    | ['0x115AFB41e704F2D095Cc471f8eC7ECEaF20a28c9'] | Accounts who can call following apis: /api/v1/auth, /api/v1/signatures/{index}, /api/v1/signatures/exit |
|      JWT_SECRET       |   Yes    |                   abc123456                    |                                     JWT secret, used for api token                                      |
|      JWT_EXPIRES      |   Yes    |                   '60 days'                    |                                          Api token expire time                                          |
|     ENABLE_HTTPS      |    No    |                                                |                          Defines whether enables https, true or false or empty                          |
|   HTTPS_PRIVATE_KEY   |    No    |           /path/to/certification/key           |                                       The certification key path                                        |
|   HTTPS_CERT_CHAINS   |    No    |          /path/to/certification/cert           |                                       The certification cert path                                       |

## Running the app
Before starting the app, you may need to run a postgres database instance. Use following command to start with docker:
```bash
docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -v $PWD/postgresql/data:/var/lib/postgresql/data -d postgres:13.11
```
Now, start running the app
```bash
# You may need to create the database and table automatically when firstly start
$ npx mikro-orm schema:create --run

# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Apis
The server provides following apis.
### POST /api/v1/auth
Authorize to get an api token, which can be used by some apis with authorization parameter.

Client must sign any message using the private key associated with the address specified by `accounts` config and send it to the server.

Query
- signer: Signer address
- signed: A struct includes signed message and signature and so on.
```TypeScript
export interface SignedDTO {
  message: string;
  messageHash: string;
  r: string;
  s: string;
  v: number;
  signature: string;
}
```

Response
- api token: A string of text.

The code to sign the signature looks like this
```TypeScript
import { privateKeyToAccount } from 'web3-eth-accounts'

const auth = async (url: string, privateKey: string) =>
{
  const account = privateKeyToAccount(privateKey)
  const signedMessage = account.sign('any message')
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      signer: account.address,
      signed: signedMessage,
    }),
  })
  const authToken = await res.text()
  console.log(authToken);
}
```
The returned value looks like this:
`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRyZXNzIjoiMHgxMTVBRkI0MWU3MDRGMkQwOTVDYzQ3MWY4ZUM3RUNFYUYyMGEyOGM5IiwibWVzc2FnZSI6InZhbGlkYXRvcl9lamVjdG9yIiwiaWF0IjoxNjg3Nzc2MTcxLCJleHAiOjE2OTI5NjAxNzF9.-dwbQB94_KeacNsfEtXAIym0NMpDPRDimU728Yw3_Jc`

### POST /api/v1/signatures/update
Query
- exit messages: An array of pre-signed exit messages
```TypeScript
export interface ExitMessage {
  message: {
    epoch: string;
    validator_index: string;
  };
  signature: string;
} 
```
Example
```Bash
curl -X 'POST' \
  'http://127.0.0.1:3000/api/v1/signatures/update' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '[{"message":{"epoch":"179252","validator_index":"464381"},"signature":"0xa9b93d5331de18dafb491cbd8ed5b16a8f516a697ae315fb6aa14c58c77034c18da687a923ff42d684d4a4507149d523174a5541ce55200fbaaac5906e02b67529676c13ed67a0348fa6426be391a2f76d1107dbbfb7210d8cc0872fd7522d17"},{"message":{"epoch":"179252","validator_index":"465086"},"signature":"0xaccd59e24cf2484122a1deb94b5536483402801d3e27fc31b26aec53fa62a1a0bf2f9cb14f5a0b8db49b7ca22086d0a80ccf31ad8bbdc4e1550f0aa5f87960fc929092f6e54747f333e739ef3f6b6d11f2d12bdeeec06996012718b69a1773af"}]'
```

### POST /api/v1/signatures/exit
Query
- exit log: The exit log sent by specified contract
```TypeScript
export interface ExitLogDTO {
  index: number;
  operator: string;
  pubkey: string;
}
```
This api requires api token, example
```Bash
curl -X 'POST' \
  'http://127.0.0.1:3000/api/v1/signatures/exit' \
  -H 'Content-Type: application/json' \
  -H 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRyZXNzIjoiMHgxMTVBRkI0MWU3MDRGMkQwOTVDYzQ3MWY4ZUM3RUNFYUYyMGEyOGM5IiwibWVzc2FnZSI6InZhbGlkYXRvcl9lamVjdG9yIiwiaWF0IjoxNjg3Nzc2MTcxLCJleHAiOjE2OTI5NjAxNzF9.-dwbQB94_KeacNsfEtXAIym0NMpDPRDimU728Yw3_Jc' \
  -d '{"index":0,"operator":"0x026Cc292d54Fa98F604F79EBa5ee6bCA46479944","pubkey":"0x8394ec842839950f906f39c0a827a1d05dffd1b213446deda4a51b51798ad86c6cc7bf4e5f559207804ad0b2ea87d781"}'
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- ContactUs - [Github](https://github.com/okx-dao/dawnpool-keys-api)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
