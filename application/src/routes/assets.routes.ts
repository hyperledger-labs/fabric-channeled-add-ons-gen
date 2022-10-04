import express from 'express';

import ledger from '../ledger/ledger';
import { getErrorMessage } from '../utils/errors';
import { Asset } from '../models/asset.model';
import { ResponseData } from '../models/responseData.model';
import {contract } from '../app';
import isAuthenticated from '../middleware/isAuthenticated';

const router = express.Router();

// Return all the current assets on the ledger.
router.get('/', isAuthenticated, async (request, response) => {
    const assets = await ledger.getAllAssets(contract);
    response.status(200).json(assets);

});

// Create a new asset on the ledger.
router.post('/', isAuthenticated, async (request, response) => {
    const asset: Asset = request.body;
    try {
        const res: ResponseData = await ledger.createAsset(contract, asset);
        if(res.message) {
            response.status(res.status).json(res.message);
        } else {
            response.status(res.status).end();
        }
    } catch (e: unknown) {
        response.status(500).json(getErrorMessage(e));
    }
});

// Update an existing asset asynchronously.
router.post('/transfer', isAuthenticated, async (request, response) => {
    const assetId: string = request.body.assetId;
    const newOwner: string = request.body.newOwner;
    const res = await ledger.transferAssetAsync(contract, assetId, newOwner);
    response.status(res.status).json(res.message);
});

// Get the asset details by assetID.
router.get('/:assetId', isAuthenticated, async (request, response) => {
    const data = await ledger.readAssetByID(contract, request.params.assetId);
    switch (data.status) {
    case 200:
        response.status(200).json(data.asset);
        break;
    case 500:
        response.status(500).json(data.message);
        break;
    case 404:
        response.status(404).end();
        break;
    default:
        response.status(500).end();
    }
});

export default router;