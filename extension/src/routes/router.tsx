import React from 'react';
import {
  createMemoryRouter,
} from 'react-router-dom';
import { CreateAsset, action as createAction } from '../views/CreateAsset/CreateAsset';

import Landing from '../views/Landing/Landing';
import Navigation from '../views/Navigation/Navigation';

const router = createMemoryRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/navigation',
    element: <Navigation />,
  },
  {
    path: '/create-asset',
    element: <CreateAsset />,
    action: createAction,
  },
]);

export default router;
