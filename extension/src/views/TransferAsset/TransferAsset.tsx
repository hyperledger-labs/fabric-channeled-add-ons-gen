import React from 'react';
import { ActionFunctionArgs, useFetcher, useNavigate } from 'react-router-dom';

import Button from '../../components/Button/Button';
import Loader from '../../components/Loader/Loader';
import APIResponse from '../../models/APIResponse.model';
import assetTransferService from '../../services/assetTransferService';

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  return assetTransferService.transferAsset(
    data.assetID as string,
    data.newOwner as string,
  );
}

export function TransferAsset() {
  const navigate = useNavigate();
  const fetcher = useFetcher();

  const [success, setSuccess] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [newOwner, setNewOwner] = React.useState('');

  React.useEffect(() => {
    if (fetcher.data && Object.keys(fetcher.data).length) {
      const data = fetcher.data as APIResponse;
      setSuccess(data.success!);
      setMessage(data.message!);
    }
  }, [fetcher.data]);

  return (
    <>
      <h1>TransferAsset</h1>
      <fetcher.Form method="post">
        <label htmlFor="assetID">
          Asset ID:
          <input type="text" id="assetID" name="assetID" />
        </label>
        <label htmlFor="newOwner">
          New Owner:
          <input
            type="text"
            id="newOwner"
            name="newOwner"
            onChange={(e) => setNewOwner(e.target.value)}
            value={newOwner}
            placeholder="John Doe"
          />
        </label>
        <Button fullWidth>Transfer</Button>
      </fetcher.Form>
      <Button fullWidth onClick={() => navigate('/navigation')}>Back</Button>
      {
        fetcher.state === 'submitting'
        && <Loader />
      }
      { success
        ? (
          <div>
            <p>Asset transferred</p>
            <p>{`Old owner: ${message}`}</p>
            <p>{`New owner: ${newOwner}`}</p>
          </div>
        )
        : (message && (
          <p>
            Error:
            {' '}
            {message}
          </p>
        ))}
    </>
  );
}