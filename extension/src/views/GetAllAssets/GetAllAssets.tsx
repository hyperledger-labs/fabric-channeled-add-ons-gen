import React from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import Asset from '../../models/asset.model';

export default function GetAllAssets() {
  const assets = useLoaderData() as Asset[];
  const navigate = useNavigate();
  return (
    <>
      <h1>Assets</h1>
      {assets.length
        ? (
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
              {assets.map((asset) => (
                <tr key={asset.ID}>
                  <th>{asset.ID}</th>
                  <td>{asset.Owner}</td>
                  <td>{asset.Color}</td>
                  <td>{asset.Size}</td>
                  <td>{asset.AppraisedValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
        : <p>There are no assets to show.</p>}
      <Button fullWidth onClick={() => navigate('/navigation')}>Back</Button>
    </>
  );
}
