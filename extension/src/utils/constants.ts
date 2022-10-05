const hostname = process.env.REACT_APP_APPLICATION_HOSTNAME;
const port = process.env.REACT_APP_APPLICATION_PORT;
const proto = process.env.REACT_APP_APPLICATION_PROTOCOL;

export const baseURL = `${proto}://${hostname}:${port}`;

export const assetsURL = `${baseURL}/assets`;
export const authURL = `${baseURL}/auth`;

export const transferAssetURL = `${assetsURL}/transfer`;
export const loginURL = `${authURL}/login`;
