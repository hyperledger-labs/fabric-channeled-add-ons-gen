import crypto from 'crypto';
import util from 'util';
import { getErrorMessage } from './errors';

import Keys from '../models/keys.model';

const generateKeyPair = util.promisify(crypto.generateKeyPair);

async function createKeys(): Promise<Keys|string> {
    try {
        const keys = await generateKeyPair(
            'rsa',
            {
                modulusLength: 2048,
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem',
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem',
                },
            });
        return keys;
    } catch(e:unknown) {
        return getErrorMessage(e);
    }

}

export default createKeys;