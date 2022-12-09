import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import Asset from '../../models/Asset.model';
import AssetTransferService from '../../services/AssetTransferService';

export default function GetAsset() {
  const [asset, setAsset] = React.useState({} as Asset);
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const assetID = e.target.elements.assetID.value;
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
        <label htmlFor="assetID">
          Asset:
          <input type="text" id="assetID" name="assetID" placeholder="asset2" />
          <Button fullWidth>Search</Button>
        </label>
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
