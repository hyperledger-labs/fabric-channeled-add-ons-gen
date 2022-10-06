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

The smart contract (in folder `chaincode`) is written in GO v1.18, based on the `asset-transfer-basic` sample.
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

0. Install Hyperledger Fabric and get the `fabric-samples`.
   Instructions can be found on the [Fabric v2.4 documentation](https://hyperledger-fabric.readthedocs.io/en/release-2.4/install.html).

   ```bash
   curl -sSL https://bit.ly/2ysbOFE | bash -s #-- 2.4.6 1.5.3
   cd fabric-samples/
   ```
   
1. Clone **fabric-channeled-add-ons-gen** inside the `fabric-samples` folder.

   ```bash
   cd fabric-samples/
   git clone https://github.com/nkapsoulis/fabric-channeled-add-ons-gen.git
   ```

2. Create the test network and a channel (from the `test-network` folder).

   ```bash
   cd test-network/
   ./network.sh up createChannel -c mychannel -ca
   ```

3. Chaincode deployment of i) the user-management and ii) the selected application (here `asset-transfer-basic`). 

   ```bash
   ./network.sh deployCC -ccn basic -ccp ../fabric-channeled-add-ons-gen/chaincode/ -ccl go
   ```

4. Running the application. Rename the `.env.example` file to `.env` and set a strong password for `COOKIES_SECRET`.
   This is the only configuration needed to be set up for now.

   ```bash
   cd ../fabric-channeled-add-ons-gen/application
   mv .env.example .env 
   # Set strong password for `COOKIES_SECRET`
   npm install
   npm start
   ```

5. Building the add-on app (`extension/` directory). First rename the `.env.example` to `.env`. 
Necessary changes should be made in the `.env` file at a latter step where more applications are enabled through the generator.

   ```bash
   cd ../extension
   mv .env.example .env
   npm install
   npm run build
   ```

6. Install the add-on as a browser extension.

   On Google Chrome or Edge go to Settings -> Extensions, enable
   developer mode and then click load unpacked and select the
   `/build` folder of the extension.

7. Use the given credentials.

   The private keys for the users created on startup are printed on the application logs.
   Copy them and use them with the extension.

## Deploying on more channels

In case you want to deploy the same chaincode in another channel, the following are the changes
that need to be done:

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
   
   Now start the application in a new terminal.

   ```bash
   cd ../fabric-channeled-add-ons-gen/application/
   # Set strong password for `COOKIES_SECRET`
   npm start
   ```

4. Copy the `extension/` directory to `extension2/`.

   ```bash
   cd ..
   cp -r extension/ extension2/
   ```
**Note: current development aims to use a single add-on build.**

5. Edit the add-on's environment `extension2/.env` and rebuild it.

   ```bash
    REACT_APP_APPLICATION_PROTOCOL=http
    REACT_APP_APPLICATION_HOSTNAME=localhost
    REACT_APP_APPLICATION_PORT=8001
   ```
   Now rebuild the add-on:

   ```bash
   cd ../extension2
   npm run build
   ```

## Clean up

Close applications:

#### _#TODO: kill apps in current environment_

Bring down the test network (from the `test-network` folder). The command will remove all the blockchain nodes, and delete any ledger data created.

```bash
./network.sh down
```

## Status

- Initial version supported an **asset-transfer-basic** workflow on **Google Chrome** and **Microsoft Edge**.
