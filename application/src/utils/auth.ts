import crypto from 'crypto';
import {getErrorMessage} from './errors';

function toPEMFormat(str: string): string {
    return str.replaceAll('\t', '').replaceAll('\\n', '\n').replaceAll(/ \n/g, '\n');
}

export function keysMatch(keyOriginal:string, certOriginal: string): boolean | string {
    try {
        const key = toPEMFormat(keyOriginal);
        const cert = toPEMFormat(certOriginal);

        const publicKeyFromPrivate = crypto.createPublicKey(key);
        const publicKey = crypto.createPublicKey(cert);
        const exportedPublicKeyFromPrivate = publicKeyFromPrivate.export({ type: 'spki', format: 'pem' });
        const exportedPublicKey = publicKey.export({ type: 'spki', format: 'pem' });
        return (exportedPublicKeyFromPrivate === exportedPublicKey);
    } catch (e: unknown) {
        console.error(getErrorMessage(e));
        return getErrorMessage(e);
    }
}
