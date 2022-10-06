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
<!-- TODO: Add here about the two chaincodes when they are spit. -->

### Application Chaincode

The smart contract (in folder `chaincode`) is written in GO, based on the `asset-transfer-basic` sample.
The following functions are implemented to support the application:

- CreateAsset
- ReadAsset
- UpdateAsset
- DeleteAsset
- TransferAsset
- AssetExists

### User Chaincode

There is a second chaincode which includes simplistic user management functionalities. These functionalities are:

- UserExists
- CreateUser
- ReadUser
- GetAllUsers

The credentials for

Note that the asset transfer implemented by the smart contract is a simplified scenario, without ownership validation, meant only to demonstrate how to invoke transactions.

## Running the sample

The Fabric test network is used to deploy and run this sample. Follow these steps in order:

0. Install Hyperledger Fabric and get the fabric-samples.
   Instructions can be found on the [Fabric documentation](https://hyperledger-fabric.readthedocs.io/en/release-2.4/install.html).

1. Clone this repository inside the fabric-samples folder.

2. Create the test network and a channel (from the `test-network` folder).

   ```bash
   ./network.sh up createChannel -c mychannel -ca
   ```

3. Deploy one of the smart contract implementations (from the `test-network` folder). Here
   we use the chaincode we provide:

   ```bash
   ./network.sh deployCC -ccn basic -ccp ../fabric-channeled-add-ons-gen/chaincode/ -ccl go
   ```

4. Rename the `.env.example` file to `.env` and set a strong password for `COOKIES_SECRET`.
   This is the only configuration needed to be set up for now.

5. Run the application (from the `fabric-channeled-add-ons-gen` folder).

   ```bash
   cd application
   npm install
   npm start
   ```

6. Before building the extension rename the `.env.example` to `.env` and make changes if necessary.

7. Build the extension

   ```bash
   cd extension
   npm install
   npm run build
   ```

8. Install the extension

   On Google Chrome or Edge go to Settings -> Extensions, enable
   developer mode and then click load unpacked and select the
   `/build` folder of the extension.

9. Use the given credentials

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
      ./network.sh deployCC -c channel2 -ccn othercc -ccp ../fabric-channeled-add-ons-gen/chaincode/ -ccl go
   ```

3. Before starting the application edit the `.env` file and set there
   the needed configuration (such as `CHANNEL_NAME` and `CHAINCODE_NAME` and possibly the
   `APP_PORT` if running multiple apps at the same time). For example:

   ```bash
   APP_PORT=8001
   CHANNEL_NAME=channel2
   CHAINCODE_NAME=othercc
   ```

4. If needed edit the extension's `.env` file and make any changes needed there. Rebuild the extension after.

   ```bash
    REACT_APP_APPLICATION_PROTOCOL=http
    REACT_APP_APPLICATION_HOSTNAME=localhost
    REACT_APP_APPLICATION_PORT=8001
   ```

## Clean up

When you are finished, you can bring down the test network (from the `test-network` folder). The command will remove all the nodes of the test network, and delete any ledger data that you created.

```bash
./network.sh down
```

## Status & Credits

- Initial version supports an **asset-transfer-basic** workflow on **Google Chrome**.
