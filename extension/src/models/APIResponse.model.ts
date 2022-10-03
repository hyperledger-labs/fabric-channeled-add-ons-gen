import Asset from './asset.model';

interface APIResponse {
  asset?: Asset,
  success: boolean,
  message?: string,
}

export default APIResponse;
