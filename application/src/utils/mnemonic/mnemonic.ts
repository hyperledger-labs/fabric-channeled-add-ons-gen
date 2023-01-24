/**
 * Re-implementation of the reference implementation in Python:
 * https://github.com/trezor/python-mnemonic/blob/master/src/mnemonic/mnemonic.py
 */

import fs from 'fs';
import path from 'path';
import process from 'process';
import crypto from 'crypto';

export class Mnemonic {
    language: string;
    radix: number;
    wordlist: string[];

    constructor(language = 'english') {
        this.language = language;
        this.radix = 2048;
        const d = path.join(process.cwd(), `wordlist/${language}.txt`)
        if (fs.existsSync(d) && fs.lstatSync(d).isFile()) {
            const data = fs.readFileSync(d, 'utf-8')
            this.wordlist = data.split('/\r?\n/');

            if (this.wordlist.length !== this.radix) {
                throw new Error(`Wordlist should contain ${this.radix} words, but it's ${this.wordlist.length} words long instead.`)
            }
        }
        else {
            this.wordlist = [];
            throw new Error('Language not detected');

        }
    }

    generate(strength = 128): string {
        /**
        Create a new mnemonic using a random generated number as entropy.
        As defined in BIP39, the entropy must be a multiple of 32 bits, and its size must be between 128 and 256 bits.
        Therefore the possible values for `strength` are 128, 160, 192, 224 and 256.
        If not provided, the default entropy length will be set to 128 bits.
        The return is a list of words that encodes the generated entropy.
        :param strength: Number of bytes used as entropy
        :type strength: int
        :return: A randomly generated mnemonic
        :rtype: str
         */
        if (![128, 160, 192, 224, 256].includes(strength)) {
            throw new Error('Invalid strength value. Allowed values are [128, 160, 192, 224, 256].');
        }
        return this.to_mnemonic(crypto.randomBytes(strength / 8));
    }

    to_mnemonic(data: Buffer): string {
        if (![16, 20, 24, 28, 32].includes(data.length)) {
            throw new Error(`Data length should be one of the following: [16, 20, 24, 28, 32], but it is not ${data.length}`);
        }
        const h = crypto.createHash('sha256').update(data).digest('hex');
        return h;
        // const b =
    }
}