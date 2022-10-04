import crypto from 'crypto';
import {getErrorMessage} from './errors';

export function keysMatch(key:string, cert: string): boolean | string {
    try {
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
