import express from 'express';

import { User } from '../models/User.model';
import ledger from '../ledger/ledger';
import { contract } from '../app';
import { keysMatch } from '../utils/auth';

const router = express.Router();

router.post('/login', async (request, res) => {
    const requestUser: User = request.body;
    if(!requestUser.privKey) {
        res.status(400).json({'message': 'Private key is missing'})
    }

    const ledgerUser = await ledger.getUser(contract, requestUser.name);
    if(typeof ledgerUser === 'string') {
        res.status(404).json({'message': ledgerUser});
    }

    const lUser = <User>ledgerUser;

    const match = keysMatch(requestUser.privKey as string, lUser.pubKey as string);
    if(typeof match !== 'boolean') {
        res.status(500).json({'message': match});
    }
    if(!match) {
        res.status(404).json({'message': 'Private and public key do not match'});
    }

    // Our token expires after one day
    const oneDayToSeconds = 24 * 60 * 60;

    // secure cookies require https, so we don't enable them by default
    res.status(200).cookie('fabricAuth', requestUser.name, {
        maxAge: oneDayToSeconds,
        signed: true,
        httpOnly: true,
        sameSite: 'strict',
    })
});


export default router;