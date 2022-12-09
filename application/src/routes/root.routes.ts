import express from 'express';

import config from '../utils/config';

const router = express.Router();

router.get('/', async (request, res) => {
    return res.status(200).json({ name: config.appName });
});

export default router;
