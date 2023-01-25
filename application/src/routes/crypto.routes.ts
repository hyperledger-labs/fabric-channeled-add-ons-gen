import express from 'express';

import { User } from '../models/user.model';
import { contracts } from '../app';
import ledger from '../ledger/ledger';
import isAuthenticated from '../middleware/isAuthenticated';

const router = express.Router();


router.post('/create', isAuthenticated, async (request, response) => {
    const requestUser: User = request.body;

    if (!requestUser.pubkey) {
        return response.status(400).json({ 'message': 'Cannot create user without public key' });
    }

    const resp = await ledger.createUser(contracts, requestUser.name, requestUser.pubkey);

    if (resp.status === 201) {
        return response.status(201).end();
    }
    return response.status(resp.status).json(resp.message);
});

export default router;

