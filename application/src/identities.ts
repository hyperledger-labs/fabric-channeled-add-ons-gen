import { promises as fs } from 'fs';
import {
    Identity, Signer, signers,
} from '@hyperledger/fabric-gateway';
import * as crypto from 'crypto';
import * as path from 'path';

import config from './config';

async function newIdentity(): Promise<Identity> {
    const credentials = await fs.readFile(config.certPath);
    const mspId = config.mspId;
    return { mspId, credentials };
}

async function newSigner(): Promise<Signer> {
    const files = await fs.readdir(config.keyDirectoryPath);
    const keyPath = path.resolve(config.keyDirectoryPath, files[0]);
    const privateKeyPem = await fs.readFile(keyPath);
    const privateKey = crypto.createPrivateKey(privateKeyPem);
    return signers.newPrivateKeySigner(privateKey);
}

export {
    newIdentity,
    newSigner,
}