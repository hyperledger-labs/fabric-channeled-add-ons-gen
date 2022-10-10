import { Contract } from '@hyperledger/fabric-gateway';

export interface Contracts {
    assetContract: Contract,
    userContract: Contract
}

