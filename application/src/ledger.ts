import {Contract} from '@hyperledger/fabric-gateway';
import { TextDecoder } from 'util';
import { Asset } from './models';
const utf8Decoder = new TextDecoder();

/**
 * This type of transaction would typically only be run once by an application the first
 * time it was started after its initial deployment. A new version of the chaincode deployed
 * later would likely not need to run an "init" function.
 */
async function initLedger(contract: Contract): Promise<void> {
    console.info('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');

    const resultBytes = await contract.submitTransaction('InitLedger');
    const resultJson = utf8Decoder.decode(resultBytes);
    console.info('*** Init Result:', resultJson);

    console.info('*** Transaction committed successfully');
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
async function createAsset(contract: Contract, asset: Asset): Promise<void> {
    console.info('\n--> Submit Transaction: CreateAsset, creates new asset with ID, Color, Size, Owner and AppraisedValue arguments');

    const resultBytes = await contract.submitTransaction(
        'CreateAsset',
        asset.ID,
        asset.Color,
        asset.Size.toString(),
        asset.Owner,
        asset.AppraisedValue.toString(),
    );
    const resultJson = utf8Decoder.decode(resultBytes);
    console.info('*** Create asset Result:', resultJson);

    console.info('*** Transaction committed successfully');
}

/**
 * Submit transaction asynchronously, allowing the application to process the smart
 * contract response (e.g. update a UI) while waiting for the commit notification.
 */
async function transferAssetAsync(contract: Contract, id: string, newOwner: string): Promise<void> {
    console.info('\n--> Async Submit Transaction: TransferAsset, updates existing asset owner');

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
}

async function readAssetByID(contract: Contract, id: string): Promise<Asset> {
    console.info('\n--> Evaluate Transaction: ReadAsset, function returns asset attributes');

    const resultBytes = await contract.evaluateTransaction('ReadAsset', id);

    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    console.info('*** Result:', result);
    return result;
}

const ledger = {
    initLedger,
    getAllAssets,
    createAsset,
    transferAssetAsync,
    readAssetByID,
}

export default ledger;