import { EndorseError, GatewayError} from '@hyperledger/fabric-gateway';
import { TextDecoder } from 'util';

import { getErrorMessage } from '../utils/errors';
import { Asset } from '../models/asset.model';
import { User } from '../models/user.model';
import { ResponseData } from '../models/responseData.model';
import { createKeys } from '../utils/crypto';
import { Contracts } from '../models/contracts.model';


const utf8Decoder = new TextDecoder();

/**
 * This type of transaction would typically only be run once by an application the first
 * time it was started after its initial deployment. A new version of the chaincode deployed
 * later would likely not need to run an "init" function.
 */
async function initLedger(contracts: Contracts): Promise<void> {
    console.info('\nSubmit Transaction: InitLedger, function creates the initial set of assets on the ledger');

    try {
        await contracts.assetContract.submitTransaction('InitLedger');
        console.info('*** InitLedger: Transaction committed successfully');
        // We create the users only the first time InitLedger is ran.
        const users = ['Tomoko', 'Brad', 'Jin Soo', 'Max', 'Adriana', 'Michel', 'Mario', 'Anton', 'Marek', 'George'];
        users.forEach(async (user) => {
            const keysOrError = await createKeys();
            if (typeof keysOrError === 'string') {
                throw new Error(keysOrError);
            }
            ledger.createUser(contracts, user, keysOrError.publicKey);
            console.info(`*** User ${user} PRIVATE KEY ***`);
            console.info(`\n${keysOrError.privateKey}\n`);
        });
    } catch (e: unknown) {
        if (e instanceof EndorseError) {
            if(Array.isArray(e.details) && e.details.length) {
                console.error(`Result: ${e.details[0].message}`);
            } else {
                console.error(e.cause.details)
            }
        } else {
            console.error(e);
        }
    }
}

/**
 * Evaluate a transaction to query ledger state.
 */
async function getAllAssets(contracts: Contracts): Promise<Asset[]> {
    console.info('\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger');

    const resultBytes = await contracts.assetContract.evaluateTransaction('GetAllAssets');

    const resultJson = utf8Decoder.decode(resultBytes);
    const result: Asset[] = JSON.parse(resultJson);
    console.info('*** Assets:', result);
    return result;
}

/**
 * Submit a transaction synchronously, blocking until it has been committed to the ledger.
 */
async function createAsset(contracts: Contracts, asset: Asset): Promise<ResponseData> {
    console.info('\n--> Submit Transaction: CreateAsset, creates new asset with ID, Color, Size, Owner and AppraisedValue arguments');

    try {
        await contracts.assetContract.submitTransaction(
            'CreateAsset',
            asset.ID,
            asset.Color,
            asset.Size.toString(10),
            asset.Owner,
            asset.AppraisedValue.toString(10),
        );
        console.info('*** CreateAsset: Transaction committed successfully');
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
async function transferAssetAsync(contracts: Contracts, id: string, newOwner: string): Promise<ResponseData> {
    console.info('\n--> Async Submit Transaction: TransferAsset, updates existing asset owner');

    try {
        const commit = await contracts.assetContract.submitAsync('TransferAsset', {
            arguments: [id, newOwner],
        });
        const oldOwner = utf8Decoder.decode(commit.getResult());

        console.info(`*** Successfully submitted transaction to transfer ownership from ${oldOwner} to ${newOwner}`);
        console.info('*** Waiting for transaction commit');

        const status = await commit.getStatus();
        if (!status.successful) {
            throw new Error(`Transaction ${status.transactionId} failed to commit with status code ${status.code}`);
        }

        console.info('*** TransferAsset: Transaction committed successfully');
        return {status: 200, message: oldOwner}
    } catch (e: unknown) {
        if(e instanceof EndorseError && e.code === 10) {
            return {status: 404, message: e.details[0].message}
        }
        console.error(e);
        return {status: 500, message: getErrorMessage(e)};
    }
}

async function readAssetByID(contracts: Contracts, id: string): Promise<ResponseData> {
    console.info('\n--> Evaluate Transaction: ReadAsset, function returns asset attributes');

    try {
        const resultBytes = await contracts.assetContract.evaluateTransaction('ReadAsset', id);

        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        console.info('*** ReadAsset: Result:', result);
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

async function getUser(contracts: Contracts, name: string): Promise<User|string> {
    console.info('\n--> Evaluate Transaction: ReadUser, function returns user public key');
    try {
        const resultBytes = await contracts.userContract.evaluateTransaction('ReadUser', name);

        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        console.info('*** ReadUSer: Result:', result);

        return result as User;
    } catch (e: unknown) {
        return getErrorMessage(e);
    }

}

async function createUser(contracts: Contracts, name: string, pubkey: string): Promise<ResponseData> {
    console.info('\n--> Submit Transaction: CreateUser, creates new user with Name and Public Key arguments');

    try {
        await contracts.userContract.submitTransaction(
            'CreateUser',
            name,
            pubkey,
        );

        console.info('*** CreateUser: Transaction committed successfully');
        return {status:201};
    } catch (e: unknown) {
        if(e instanceof EndorseError) {
            if(Array.isArray(e.details) && e.details.length) {
                console.error(`Result: ${e.details[0].message}`);
                return {status: 422, message: e.details[0].message};
            } else {
                console.error(e.cause.details)
                return {status: 422, message: e.cause.details}
            }
        } else {
            console.error(e);
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
    getUser,
    createUser,
}

export default ledger;
