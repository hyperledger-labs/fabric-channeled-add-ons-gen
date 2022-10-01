import React from 'react';
import { Form, ActionFunctionArgs } from 'react-router-dom';

import assetTransferService from '../../services/assetTransferService';
import Asset from '../../models/asset.model';
import Button from '../../components/Button/Button';

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const asset = Object.fromEntries(formData);
  assetTransferService.createAsset(asset as unknown as Asset);
}

export function CreateAsset() {
  return (
    <div>
      <h2>Create Asset</h2>
      <Form method="post">
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
