# Fabric Channeled Add-ons Gen

**fabric-channeled-add-ons-gen** is an open-source generator for Hyperledger Fabric add-on apps in dedicated channels.
Inspired by the increasing utilization of browser extensions, **fabric-channeled-add-ons-gen** provides a solution
for deploying user-managed applications on different Hyperledger Fabric channels in the form of add-ons.

## Application

The application is written in Typescript (4.8) and express (4.18).

## Extension

The extension is written in React (18.2) Typescript (4.8). For routing between the views, React Router (6.4) was used. We
used fetch API for communicating with the application.

## Smart Contract

The smart contract (in folder `chaincode`) is written in GO
and implements the following functions to support the application:

- CreateAsset
- ReadAsset
- UpdateAsset
- DeleteAsset
- TransferAsset
- AssetExists

- UserExists
- CreateUser
- ReadUser
- GetAllUsers

Note that the asset transfer implemented by the smart contract is a simplified scenario, without ownership validation, meant only to demonstrate how to invoke transactions.

## Running the sample

The Fabric test network is used to deploy and run this sample. Follow these steps in order:

1. Create the test network and a channel (from the `test-network` folder).

   ```bash
   ./network.sh up createChannel -c mychannel -ca
   ```

2. Deploy one of the smart contract implementations (from the `test-network` folder).

   ```bash
   ./network.sh deployCC -ccn basic -ccp ../fabric-channeled-add-ons-gen/chaincode/ -ccl go
   ```

3. Rename the `.env.example` file to `.env` and set a strong password for `COOKIES_SECRET`.
   This is the only configuration needed to be set up for now.

4. Run the application (from the `fabric-channeled-add-ons-gen` folder).

   ```bash
   cd application
   npm install
   npm start
   ```

5. Before building the extension rename the `.env.example` to `.env` and make changes if necessary.

6. Build the extension

   ```bash
   cd extension
   npm install
   npm run build
   ```

7. Install the extension

   On Google Chrome or Edge go to Settings -> Extensions, enable
   developer mode and then click load unpacked and select the
   `/build` folder of the extension.

8. Use the given credentials

   The private keys for the users created on startup are printed on the application logs.
   Copy them and use them with the extension.

## Deploying on more channels

In case you want to deploy the same chaincode in another channel, the following are the changes
that need to be done:

1. When creating the channel do not run the up command.

   ```bash
   ./network.sh createChannel -c channel2 -ca
   ```

2. Explicitly select the channel to deploy to.

   ```bash
      ./network.sh deployCC -c channel2 -ccn basic -ccp ../fabric-channeled-add-ons-gen/chaincode/ -ccl go
   ```

3. Before starting the application edit the `.env` file and set there
   the needed configuration (such as `CHANNEL_NAME` and `CHAINCODE_NAME` and possibly the
   `APP_PORT` if running multiple apps at the same time).

4. If needed edit the extension's `.env` file and make any changes needed there. Rebuild the extension after.

## Clean up

When you are finished, you can bring down the test network (from the `test-network` folder). The command will remove all the nodes of the test network, and delete any ledger data that you created.

```bash
./network.sh down
```

## Status & Credits

- Initial version supports an **asset-transfer-basic** workflow on **Google Chrome**.
- Inspired by [Hyperledger Labs Fabric Chrome Extension](https://github.com/hyperledger-labs/fabric-chrome-extension).
