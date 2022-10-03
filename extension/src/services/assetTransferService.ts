import Asset from '../models/asset.model';
import APIResponse from '../models/APIResponse.model';

import { assetsURL, transferAssetURL } from '../utils/constants';

async function getAllAssets(): Promise<Response> {
  return fetch(assetsURL, {
    method: 'GET',
  });
}

async function getAsset(assetID: string): Promise<APIResponse> {
  const response = await fetch(`${assetsURL}/${assetID}`, {
    method: 'GET',
  });
  if (response.status === 200) {
    const json = await response.json() as Asset;
    return { success: true, asset: json };
  }
  if (response.status === 404) {
    return { success: false, message: `Asset ${assetID} not found` };
  }
  if (response.status === 500) {
    const json = await response.json();
    return { success: false, message: json };
  }
  return { success: false };
}

async function createAsset(asset: Asset): Promise<APIResponse> {
  const response = await fetch(assetsURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(asset),
  });
  if (response.status === 201) {
    return { success: true };
  }
  const json = await response.json();
  return { success: false, message: json };
}

async function transferAsset(assetID: string, newOwner: string) {
  const response = await fetch(transferAssetURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ assetID, newOwner }),
  });
  const json = await response.json();
  return json;
}

const assetTransferService = {
  getAllAssets,
  getAsset,
  createAsset,
  transferAsset,
};

export default assetTransferService;
