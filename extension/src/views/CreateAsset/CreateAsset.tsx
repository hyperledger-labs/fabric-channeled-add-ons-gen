import React from 'react';
import { Form, ActionFunctionArgs } from 'react-router-dom';

import assetTransferService from '../../services/assetTransferService';
import Asset from '../../models/asset.model';
import Button from '../../components/Button/Button';

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

  assetTransferService.createAsset(asset);
}

export function CreateAsset() {
  return (
    <div>
      <h2>Create Asset</h2>
      <Form method="post">
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
      </Form>
    </div>
  );
}
