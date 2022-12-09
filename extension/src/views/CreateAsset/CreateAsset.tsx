import React from 'react';
import {
  ActionFunctionArgs, useNavigate, useFetcher,
} from 'react-router-dom';

import AssetTransferService from '../../services/AssetTransferService';
import Asset from '../../models/Asset.model';
import Button from '../../components/Button/Button';
import APIResponse from '../../models/APIResponse.model';
import Loader from '../../components/Loader/Loader';
import Input from '../../components/Input/Input';

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const assetObj = Object.fromEntries(formData);

  const asset: Asset = {
    ID: assetObj.ID as string,
    AppraisedValue: parseInt(assetObj['appraised-value'] as string, 10),
    Color: assetObj.Color as string,
    Owner: assetObj.Owner as string,
    Size: parseInt(assetObj.Size as string, 10),
  };

  return AssetTransferService.createAsset(asset);
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
          <Input type="text" id="id" name="ID:" required />
          <Input type="text" id="appraised-value" name="Appraised Value:" required />
          <Input type="text" id="color" name="Color:" required />
          <Input type="text" id="owner" name="Owner:" required />
          <Input type="text" id="size" name="Size:" required />
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
