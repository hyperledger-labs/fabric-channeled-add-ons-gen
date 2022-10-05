import { RequestHandler } from 'express';

const isAuthenticated: RequestHandler  = async function (req, res, next) {
    const cookie = req.signedCookies.fabricAuth;
    if(!cookie) {
        return res.status(401).json('Unauthorized');
    }
    next();
}

export default isAuthenticated;