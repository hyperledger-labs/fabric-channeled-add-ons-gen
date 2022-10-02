/*
 * SPDX-License-Identifier: Apache-2.0
 */

import * as grpc from '@grpc/grpc-js';
import { connect, Contract, Gateway, Network } from '@hyperledger/fabric-gateway';
import { promises as fs } from 'fs';
import express from 'express';

import { displayInputParameters } from './utils';
import { newIdentity, newSigner } from './identities';
import config from './config';
import ledger from './ledger';
import { Asset } from './asset.model';

const app = express();
app.use(express.json());

// gRPC client that handles all connections with Fabric
let client: grpc.Client;

// The Fabric gateway
let gateway: Gateway;

// The channel where the chaincode resides
let network: Network;

// The chaincode itself
let contract: Contract;

// Initialize a set of asset data on the ledger using the chaincode 'InitLedger' function.
app.post('/init', async (request, response) => {
    await ledger.initLedger(contract);
    response.status(200).end();

});

// Return all the current assets on the ledger.
app.get('/assets', async (request, response) => {
    const assets = await ledger.getAllAssets(contract);
    response.status(200).json(assets);

});

// Create a new asset on the ledger.
app.post('/assets', async (request, response) => {
    // TODO: Add error handling for duplicate assets etc
    const asset: Asset = request.body;
    await ledger.createAsset(contract, asset);
    response.status(201).end();
});

// Update an existing asset asynchronously.
app.post('/transfer', async (request, response) => {
    const assetId: string = request.body.assetId;
    const newOwner: string = request.body.newOwner;
    await ledger.transferAssetAsync(contract, assetId, newOwner);
    response.status(200).end();
});

// Get the asset details by assetID.
app.get('/assets/:assetId', async (request, response) => {
    // TODO: error handling for bad id?
    const asset:Asset = await ledger.readAssetByID(contract, request.params.assetId);
    response.status(200).json(asset);
});

async function newGrpcConnection(): Promise<grpc.Client> {
    const tlsRootCert = await fs.readFile(config.tlsCertPath);
    const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
    return new grpc.Client(config.peerEndpoint, tlsCredentials, {
        'grpc.ssl_target_name_override': config.peerHostAlias,
    });
}

// start the Express server
const server = app.listen(config.port, async () => {
    // The gRPC client connection should be shared by all Gateway connections to this endpoint.
    client = await newGrpcConnection();
    gateway = connect({
        client,
        identity: await newIdentity(),
        signer: await newSigner(),
        // Default timeouts for different gRPC calls
        evaluateOptions: () => ({ deadline: Date.now() + 5000 }), // 5 seconds
        endorseOptions: () => ({ deadline: Date.now() + 15000 }), // 15 seconds
        submitOptions: () => ({ deadline: Date.now() + 5000 }), // 5 seconds
        commitStatusOptions: () => ({ deadline: Date.now() + 60000 }), // 1 minute
    });

    // Get a network instance representing the channel where the smart contract is deployed.
    network = gateway.getNetwork(config.channelName);

    // Get the smart contract from the network.
    contract = network.getContract(config.chaincodeName);

    await displayInputParameters();
    console.info( `server started at port ${ config.port }` );
});


process.on('SIGTERM', () => {
    console.debug('SIGTERM signal received: closing HTTP server')
    server.close(() => {
        gateway.close();
        client.close();
        console.debug('HTTP server closed')
    })
})