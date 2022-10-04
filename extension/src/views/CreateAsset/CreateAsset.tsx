import React from 'react';
import {
  ActionFunctionArgs, useNavigate, useFetcher,
} from 'react-router-dom';

import assetTransferService from '../../services/assetTransferService';
import Asset from '../../models/Asset.model';
import Button from '../../components/Button/Button';
import APIResponse from '../../models/APIResponse.model';
import Loader from '../../components/Loader/Loader';

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const assetObj = Object.fromEntries(formData);

  const asset: Asset = {
    ID: assetObj.ID as string,
    AppraisedValue: parseInt(assetObj.AppraisedValue as string, 10),
    Color: assetObj.Color as string,
    Owner: assetObj.Owner as string,
    Size: parseInt(assetObj.Size as string, 10),
  };

  return assetTransferService.createAsset(asset);
}

export function CreateAsset() {
  const navigate = useNavigate();
  const fetcher = useFetcher();

  const [success, setSuccess] = React.useState(false);
  const [message, setMessage] = React.useState('');

  React.useEffect(() => {
    if (fetcher.data && Object.keys(fetcher.data).length) {
      const data = fetcher.data as APIResponse;
      setSuccess(data.success!);
      if (!data.success) {
        setMessage(data.message!);
      }
    }
  }, [fetcher.data]);

  return (
    <>
      <div>
        <h1>Create Asset</h1>
        <fetcher.Form method="post">
          <label htmlFor="ID">
            ID:
            <input type="text" id="ID" name="ID" />
          </label>
          <label htmlFor="appraisedValue">
            Appraised value:
            <input type="number" id="appraisedValue" name="AppraisedValue" />
          </label>
          <label htmlFor="color">
            Color:
            <input type="text" id="color" name="Color" />
          </label>
          <label htmlFor="owner">
            Owner:
            <input type="text" id="owner" name="Owner" />
          </label>
          <label htmlFor="size">
            Size:
            <input type="number" id="size" name="Size" />
          </label>
          <Button fullWidth>Submit</Button>
        </fetcher.Form>
      </div>
      <Button fullWidth onClick={() => navigate('/navigation')}>Back</Button>
      {
        fetcher.state === 'submitting'
        && <Loader />
      }
      { success
        ? <p>Asset created</p>
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
