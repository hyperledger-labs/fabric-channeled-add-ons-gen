import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import Asset from '../../models/Asset.model';
import AssetTransferService from '../../services/AssetTransferService';

export default function GetAsset() {
  const [asset, setAsset] = React.useState({} as Asset);
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const assetID = e.target.elements['asset-id'].value;
    AssetTransferService.getAsset(assetID)
      .then((response) => {
        if (response.success) {
          setAsset(response.asset!);
          setError('');
        } else {
          setAsset({} as Asset);
          setError(response.message!);
        }
      });
  };
  return (
    <>
      <h1>Search Asset</h1>
      <form action="GET" onSubmit={handleSubmit}>
        <Input type="text" id="asset-id" name="Asset ID:" placeholder="asset2" required />
        <Button fullWidth>Search</Button>
      </form>
      <Button fullWidth onClick={() => navigate('/navigation')}>Back</Button>

      {error !== '' && (
      <div>
        <h2>{`Error: ${error}`}</h2>
      </div>
      )}

      {Object.keys(asset).length > 0 && (
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Owner</th>
            <th>Color</th>
            <th>Size</th>
            <th>Appraised Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>{asset.ID}</th>
            <td>{asset.Owner}</td>
            <td>{asset.Color}</td>
            <td>{asset.Size}</td>
            <td>{asset.AppraisedValue}</td>
          </tr>
        </tbody>
      </table>
      )}
    </>
  );
}
