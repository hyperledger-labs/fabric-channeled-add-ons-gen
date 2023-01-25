import express from 'express';

import { User } from '../models/user.model';
import ledger from '../ledger/ledger';
import { contracts } from '../app';
import { pubKeyMatchesMnemonic } from '../utils/crypto';

const router = express.Router();

router.post('/login', async (request, res) => {
    const requestUser: User = request.body;

    if (!requestUser.name) {
        return res.status(400).json({ 'message': 'User name is missing' });
    }

    if (!requestUser.mnemonic) {
        return res.status(400).json({ 'message': 'Mnemonic key is missing' })
    }

    const ledgerUser = await ledger.getUser(contracts, requestUser.name);
    if (typeof ledgerUser === 'string') {
        return res.status(404).json({ 'message': ledgerUser });
    }

    const lUser = <User>ledgerUser;



    const match = pubKeyMatchesMnemonic(requestUser.mnemonic as string, lUser.pubkey as string);
    if (typeof match === 'string') {
        console.log(match);
        return res.status(500).json({ 'message': match });
    }
    if (!match) {
        return res.status(404).json({ 'message': 'Private and public key do not match' });
    }

    // secure cookies require https, so we don't enable them by default
    res.status(200).cookie('fabricAuth', requestUser.name, {
        maxAge: 1000 * 60 * 60, // one hour in ms
        signed: true,
        httpOnly: true,
        sameSite: 'lax',
    }).end();
});

export default router;
