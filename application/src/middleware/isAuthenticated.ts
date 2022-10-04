import { Request, Response } from 'express';

const isAuthenticated = async function (req: Request, res: Response, next) {
    const cookie = req.signedCookies.fabricAuth;
    if(!cookie) {
        return res.status(401).json('Unauthorized');
    }
    next();
}

export default isAuthenticated;