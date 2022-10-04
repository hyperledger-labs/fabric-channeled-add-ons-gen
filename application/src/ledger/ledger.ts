import {Contract, EndorseError, GatewayError} from '@hyperledger/fabric-gateway';
import { TextDecoder } from 'util';

import { getErrorMessage } from '../utils/errors';
import { Asset } from '../models/asset.model';
import { ResponseData } from '../models/responseData.model';


const utf8Decoder = new TextDecoder();

/**
 * This type of transaction would typically only be run once by an application the first
 * time it was started after its initial deployment. A new version of the chaincode deployed
 * later would likely not need to run an "init" function.
 */
async function initLedger(contract: Contract): Promise<void> {
    console.info('\nSubmit Transaction: InitLedger, function creates the initial set of assets on the ledger');

    try {
        await contract.submitTransaction('InitLedger');
        console.info('*** Transaction committed successfully');
    } catch (e: unknown) {
        if (e instanceof EndorseError) {
            console.info(`Result: ${e.details[0].message}`);
        } else {
            console.error(e);
        }
    }
}

/**
 * Evaluate a transaction to query ledger state.
 */
async function getAllAssets(contract: Contract): Promise<Asset[]> {
    console.info('\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger');

    const resultBytes = await contract.evaluateTransaction('GetAllAssets');

    const resultJson = utf8Decoder.decode(resultBytes);
    const result: Asset[] = JSON.parse(resultJson);
    console.info('*** Assets:', result);
    return result;
}

/**
 * Submit a transaction synchronously, blocking until it has been committed to the ledger.
 */
async function createAsset(contract: Contract, asset: Asset): Promise<ResponseData> {
    console.info('\n--> Submit Transaction: CreateAsset, creates new asset with ID, Color, Size, Owner and AppraisedValue arguments');

    try {
        await contract.submitTransaction(
            'CreateAsset',
            asset.ID,
            asset.Color,
            asset.Size.toString(10),
            asset.Owner,
            asset.AppraisedValue.toString(10),
        );
        console.info('*** Transaction committed successfully');
        return {status:201};
    } catch (e: unknown) {
        if(e instanceof EndorseError) {
            console.error(e.details[0].message)
            return {status: 422, message: e.details[0].message};
        } else {
            console.error(e);
            return {status: 500, message: getErrorMessage(e)};
        }
    }
}

/**
 * Submit transaction asynchronously, allowing the application to process the smart
 * contract response (e.g. update a UI) while waiting for the commit notification.
 */
async function transferAssetAsync(contract: Contract, id: string, newOwner: string): Promise<ResponseData> {
    console.info('\n--> Async Submit Transaction: TransferAsset, updates existing asset owner');

    try {
        const commit = await contract.submitAsync('TransferAsset', {
            arguments: [id, newOwner],
        });
        const oldOwner = utf8Decoder.decode(commit.getResult());

        console.info(`*** Successfully submitted transaction to transfer ownership from ${oldOwner} to ${newOwner}`);
        console.info('*** Waiting for transaction commit');

        const status = await commit.getStatus();
        if (!status.successful) {
            throw new Error(`Transaction ${status.transactionId} failed to commit with status code ${status.code}`);
        }

        console.info('*** Transaction committed successfully');
        return {status: 200, message: oldOwner}
    } catch (e: unknown) {
        if(e instanceof EndorseError && e.code === 10) {
            return {status: 404, message: e.details[0].message}
        }
        console.error(e);
        return {status: 500, message: getErrorMessage(e)};
    }
}

async function readAssetByID(contract: Contract, id: string): Promise<ResponseData> {
    console.info('\n--> Evaluate Transaction: ReadAsset, function returns asset attributes');

    try {
        const resultBytes = await contract.evaluateTransaction('ReadAsset', id);

        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        console.info('*** Result:', result);
        return {status: 200, asset: result};
    } catch (e:unknown) {
        if(e instanceof GatewayError && e.code === 2) {
            return {status: 404};
        }
        else {
            return {status: 500, message: getErrorMessage(e)};
        }
    }
}

const ledger = {
    initLedger,
    getAllAssets,
    createAsset,
    transferAssetAsync,
    readAssetByID,
}

export default ledger;
