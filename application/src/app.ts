/*
 * SPDX-License-Identifier: Apache-2.0
 */

import * as grpc from '@grpc/grpc-js';
import { connect, Gateway, Network } from '@hyperledger/fabric-gateway';
import { promises as fs } from 'fs';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import config from './utils/config';
import ledger from './ledger/ledger';
import { newIdentity, newSigner } from './utils/identities';
import { displayInputParameters } from './utils/utils';
import assetsRouter from './routes/assets.routes';
import authRouter from './routes/auth.routes';
import rootRouter from './routes/root.routes';
import { Contracts } from './models/contracts.model';

const app = express();

// Parse JSON bodies automatically
app.use(express.json());

// Enable CORS for all routes
app.use(cors({
    credentials: true,
}));

// Add cookie parsing with encrypted cookies
app.use(cookieParser(config.cookieSecret));

// gRPC client that handles all connections with Fabric
let client: grpc.Client;

// The Fabric gateway
let gateway: Gateway;

// The channel where the chaincode resides
let network: Network;

// The chaincode itself. We export it so ledger functions
// can use it.
export const contracts = {} as Contracts;


// Our own routes
app.use('/assets', assetsRouter);
app.use('/auth', authRouter);
app.use('/', rootRouter);

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
    contracts.assetContract = network.getContract(config.assetChaincodeName);
    contracts.userContract = network.getContract(config.userChaincodeName);

    await displayInputParameters();

    await ledger.initLedger(contracts);
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

