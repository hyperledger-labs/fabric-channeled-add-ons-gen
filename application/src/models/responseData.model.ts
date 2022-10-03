import { Asset } from './asset.model';

export interface ResponseData {
    status: number,
    message?: string,
    asset?: Asset,
}
