import express from 'express';

import { User } from '../models/User.model';
import ledger from '../ledger/ledger';
import { contract } from '../app';
import { keysMatch } from '../utils/crypto';
import isAuthenticated from '../middleware/isAuthenticated';

const router = express.Router();

router.post('/login', async (request, res) => {
    const requestUser: User = request.body;

    if(!requestUser.pubkey) {
        return res.status(400).json({'message':'User name is missing'});
    }

    if(!requestUser.privkey) {
        return res.status(400).json({'message': 'Private key is missing'})
    }

    const ledgerUser = await ledger.getUser(contract, requestUser.name);
    if(typeof ledgerUser === 'string') {
        return res.status(404).json({'message': ledgerUser});
    }

    const lUser = <User>ledgerUser;

    const match = keysMatch(requestUser.privkey as string, lUser.pubkey as string);
    if(typeof match === 'string') {
        console.log(match);
        return res.status(500).json({'message': match});
    }
    if(!match) {
        return res.status(404).json({'message': 'Private and public key do not match'});
    }

    // secure cookies require https, so we don't enable them by default
    res.status(200).cookie('fabricAuth', requestUser.name, {
        maxAge: 1000 * 60 * 60, // one hour in ms
        signed: true,
        httpOnly: true,
        sameSite: 'lax',
    }).end();
});

router.post('/create', isAuthenticated, async (request, response) =>  {
    const requestUser: User = request.body;

    if(!requestUser.pubkey) {
        return response.status(400).json({'message': 'Cannot create user without public key'});
    }

    const resp = await ledger.createUser(contract, requestUser.name, requestUser.pubkey);

    if (resp.status === 201) {
        return response.status(201).end();
    }
    return response.status(resp.status).json(resp.message);
});

export default router;