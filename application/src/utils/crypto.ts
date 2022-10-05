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

function toPEMFormat(str: string): string {
    /*
     * 1) Match the contents of a certificate only. This is not a
     * perfect way to do this, but I think it suits the purpose.
     * 2) Split the string in parts to cut out the BEGIN and END part.
     * 3) We remove redundant whitespace around the text and remove empty
     * indexes.
     * 4) We change the characters '\''n' with the single character '\n'.
     *
     * Now there should be 3 parts. if there are more, there is an issue.
     */
    const parts = str
        .split(/(-+[\w ]+-+[a-zA-Z0-9\s/+=]*?-+[\w ]+-+)/g)[1]
        .split(/(-+[\w ]+-+)/g)
        .map(s => s.trim())
        .filter(s => s.length !== 0)
        .map(s => s.replaceAll('\\n', '\n'));

    if (parts.length !== 3) {
        throw new Error('invalid PEM format');

    }
    parts[1] = parts[1].replaceAll('\t', '').replaceAll(/[ \n]/g, '\n');
    return parts.join('\n');
}

function keysMatch(keyOriginal:string, certOriginal: string): boolean | string {
    try {
        const key = toPEMFormat(keyOriginal);
        const cert = toPEMFormat(certOriginal);

        const publicKeyFromPrivate = crypto.createPublicKey(key);
        const publicKey = crypto.createPublicKey(cert);
        const exportedPublicKeyFromPrivate = publicKeyFromPrivate.export({ type: 'spki', format: 'pem' });
        const exportedPublicKey = publicKey.export({ type: 'spki', format: 'pem' });
        return (exportedPublicKeyFromPrivate === exportedPublicKey);
    } catch (e: unknown) {
        return getErrorMessage(e);
    }
}


export {
    createKeys,
    keysMatch,
};