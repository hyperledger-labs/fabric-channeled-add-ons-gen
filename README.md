# Fabric Channeled Add-ons Gen

**fabric-channeled-add-ons-gen** is an open-source generator for Hyperledger Fabric add-on apps in dedicated channels. Inspired by the increasing utilization of browser extensions, **fabric-channeled-add-ons-gen** provides a solution for deploying user-managed applications on different Hyperledger Fabric channels in the form of add-ons.

Contributors on **fabric-channeled-add-ons-gen** can bring their own business intelligence or browser support, and extend the generator beyond the initial release that consists of the **asset-transfer-basic** workflow.

**fabric-channeled-add-ons-gen** provides flexible configuration and deployment of add-on applications in separate Fabric channels by automating:

- User management
- Deployment as browser add-on
- Data privacy through channels

**fabric-channeled-add-ons-gen** is an open-source generator, suitable for Hyperledger Fabric networks, where the applications are deployed as add-ons for a separate channel with easy user management in mind.

## Application

The application is written in Typescript (4.8) and express (4.18). It is based on the newly introduced Gateway service (Fabric 2.4), but can be easily adjusted to work with older versions as well.

## Extension

The extension is written in React (18.2) Typescript (4.8). For routing between the views, React Router (6.4) was used. We
used fetch API for communicating with the application.

## Chaincodes

### Application Chaincode

Here, the classic `asset-transfer-basic` chaincode is deployed as an example case, in `chaincode` directory (GO v1.18).
In order to deploy another application, simply replace `asset-transfer-basic`.
The following functions are implemented by default:

- CreateAsset
- ReadAsset
- UpdateAsset
- DeleteAsset
- TransferAsset
- AssetExists

### User Chaincode

The user management chaincode creates ten (10) user accounts by default for the application chaincode selected above.
The implemented user-related functions are:

- UserExists
- CreateUser
- ReadUser
- GetAllUsers

Note that the asset transfer implemented by the smart contract is a simplified scenario, without ownership validation, meant only to demonstrate how to invoke transactions.

## Setup & Quickstart of the Generator

The Fabric test network is used to deploy and run this sample. Follow these steps in order:
0. Install Hyperledger Fabric and get the `fabric-samples`.
   Instructions can be found on the [Fabric v2.4 documentation](https://hyperledger-fabric.readthedocs.io/en/release-2.4/install.html).

   ```bash
   curl -sSL https://bit.ly/2ysbOFE | bash -s #-- 2.4.6 1.5.3
   cd fabric-samples/
   ```

1. Clone **fabric-channeled-add-ons-gen** inside the `fabric-samples` folder.

   ```bash
   cd fabric-samples/
   git clone https://github.com/hyperledger-labs/fabric-channeled-add-ons-gen.git
   ```

2. Create the test network and a channel (from the `test-network` folder).

   ```bash
   cd test-network/
   ./network.sh up createChannel -c mychannel -ca
   ```

3. Chaincode deployment of i) the user-management and ii) the selected application (here `asset-transfer-basic`).

   ```bash
   ./network.sh deployCC -ccn asset_basic -ccp ../fabric-channeled-add-ons-gen/chaincode/asset-chaincode -ccl go
   ./network.sh deployCC -ccn user_basic -ccp ../fabric-channeled-add-ons-gen/chaincode/user-chaincode -ccl go
   ```

4. Running the application. For running the app in docker, look at step 5. Rename the `.env.example` file to `.env` and set a strong password for `COOKIES_SECRET`.
   This is the only configuration needed to be set up for now.

   ```bash
   cd ../fabric-channeled-add-ons-gen/application
   mv .env.example .env
   # Set strong password for `COOKIES_SECRET`
   npm install
   npm start
   ```

5. (Optional) Running the application in docker. To run the application in docker, the environmental variables of `LOCAL_CRYPTO_PATH`, `PEER_ENDPOINT` and `COOKIES_SECRET` need to at least be set. Some sensible default values are the ones below (also in `.env.example`):

   ```bash
   LOCAL_CRYPTO_PATH=../test-network/organizations/peerOrganizations/org1.example.com
   ...
   PEER_ENDPOINT=peer0.org1.example.com:7051
   ```

   Then go to the root folder and run docker compose with a specified env file pointing on the `application/.env` file mentioned above.

   ```bash
   cd ..
   docker compose --env-file application/.env up -d
   ```

6. Building the add-on app (`extension/` directory). First rename the `.env.example` to `.env`.
Necessary changes should be made in the `.env` file at a latter step where more applications are enabled through the generator.

   ```bash
   cd ../extension
   mv .env.example .env
   npm install
   npm run build
   ```

7. Install the add-on as a browser extension.

   On Google Chrome or Edge go to Settings -> Extensions, enable
   developer mode and then click load unpacked and select the
   `/build` folder of the extension.

8. Use the given credentials.

   The private keys for the users created on startup are printed on the _application_ logs.
   Copy the name and the private key and paste them on the extension. For server address the location of the
   application should be used, for example `http://localhost:8000`.

## New app generation and deployment in new channel

**fabric-channeled-add-ons-gen** enables the easy generation and deployment of new apps (here, `asset-transfer-basic`) in other channels (here, `channel2`).

1. Create a new channel.

   ```bash
   cd ../../test-network
   ./network.sh createChannel -c channel2 -ca
   ```

2. Select the new channel to deploy to.

   ```bash
    ./network.sh deployCC -c channel2 -ccn othercc -ccp ../fabric-channeled-add-ons-gen/chaincode/ -ccl go
   ```

3. Before starting the application edit the `application/.env` file and set the environmental variables:
   `COOKIES_SECRET`, `CHANNEL_NAME`, `CHAINCODE_NAME`, and the `APP_PORT` if running on same environment):

   ```bash
   APP_PORT=8001
   COOKIES_SECRET=(...)

   CHANNEL_NAME=channel2
   CHAINCODE_NAME=othercc
   ```

   Now start the application in a new terminal (or add another app to the `docker-compose.yml` file).

   ```bash
   cd ../fabric-channeled-add-ons-gen/application/
   # Set strong password for `COOKIES_SECRET`
   npm start
   ```

4. Use the add-on to connect to the new channel, using the appropriate application port and address.

## Clean up

Close all applications:

To stop the application, if running on terminal, you can stop it with `Cntrl+C`, by sending it SIGTERM. If using the docker container,
`docker-compose down` should do.

Bring down the test network (from the `test-network` folder). The command will remove all the blockchain nodes, and delete any ledger data created.

```bash
cd ../../test-network
./network.sh down
```

## Using different chaincodes

In order to use a different sample, or tailor the add-on to your business needs, the asset chaincode needs to be adapted. The user chaincode is separated and can be used so.

For the asset chaincode, the core things that need to be changed are:

In the API/backend level (`application` folder):

- The ledger folder contains all the code related with the interaction with the chaincode, so all chaincode functionality should be encoded as functions there.
- The API code is found in `routes`. The `assets.routes.ts` contains all the API endpoints related with the interaction with the assets. The endpoints there could be adjusted to your needs.

On the add-on side:

- All the interaction with the API is mapped inside the `services` folder, and especially the `AssetTransferService.ts`. Depending on your use case, this functionality could be adjusted.
- Everything else has to be edited based on the UI you would be interested in presenting to your audience. 

## Status

- Initial version supported an **asset-transfer-basic** workflow on **Google Chrome** and **Microsoft Edge**.
- Inspired by [Hyperledger Labs Hyperledger Fabric Chrome Extension](https://github.com/hyperledger-labs/fabric-chrome-extension)

## Future works

- Enable private data collections integrations for dApps.
