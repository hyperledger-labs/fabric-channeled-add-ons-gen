import Asset from '../models/asset.model';
import { assetsURL, transferAssetURL } from '../utils/constants';

const getAllAssets = async () => {
  const response = await fetch(assetsURL, {
    method: 'GET',
  });
  const json = await response.json();
  return json;
};

const createAsset = async (asset: Asset) => {
  const response = await fetch(assetsURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(asset),
  });
  const json = await response.json();
  console.log(json);
  return json;
};

const transferAsset = async (assetID: string, newOwner: string) => {
  const response = await fetch(transferAssetURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ assetID, newOwner }),
  });
  const json = await response.json();
  return json;
};

const assetTransferService = {
  getAllAssets,
  createAsset,
  transferAsset,
};

export default assetTransferService;
