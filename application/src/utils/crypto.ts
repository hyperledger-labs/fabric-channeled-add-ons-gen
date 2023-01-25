import * as bip39 from '@scure/bip39';
import { HDKey } from '@scure/bip32';
import { wordlist } from '@scure/bip39/wordlists/english';

import { getErrorMessage } from './errors';

import Keys from '../models/keys.model';

function createMnemonic(strength?: number): string {
    const mn = bip39.generateMnemonic(wordlist, strength);
    return mn;
}

async function createMasterKeys(mnemonic: string, passphrase?: string): Promise<Keys | string> {
    try {
        const seed = await bip39.mnemonicToSeed(mnemonic, passphrase);
        const hdkey = HDKey.fromMasterSeed(seed);
        const keys = {
            privateKey: hdkey.privateExtendedKey,
            publicKey: hdkey.publicExtendedKey,
        }
        return keys;
    } catch (e: unknown) {
        return getErrorMessage(e);
    }

}

function masterKeysMatch(keyOriginal: string, certOriginal: string): boolean | string {
    try {
        const hdkey = HDKey.fromExtendedKey(keyOriginal);
        return (certOriginal === hdkey.publicExtendedKey);

    } catch (e: unknown) {
        return getErrorMessage(e);
    }
}

async function pubKeyMatchesMnemonic(mnemonic: string, pubKey: string, passphrase?: string): Promise<boolean | string> {
    try {
        const seed = await bip39.mnemonicToSeed(mnemonic, passphrase);
        const hdkey = HDKey.fromMasterSeed(seed);
        return (pubKey === hdkey.publicExtendedKey);
    } catch (e: unknown) {
        return getErrorMessage(e);
    }
}


export {
    createMnemonic,
    createMasterKeys,
    masterKeysMatch,
    pubKeyMatchesMnemonic,
};
