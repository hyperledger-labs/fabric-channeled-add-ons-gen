import Asset from './Asset.model';

interface APIResponse {
  asset?: Asset,
  success: boolean,
  message?: string,
}

export default APIResponse;
