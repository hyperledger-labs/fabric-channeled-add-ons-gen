import config from './config';

/**
 * displayInputParameters() will print the global scope parameters used by the main driver routine.
 */
async function displayInputParameters(): Promise<void> {
    console.log(`channelName:        ${config.channelName}`);
    console.log(`assetChaincodeName: ${config.assetChaincodeName}`);
    console.log(`userChaincodeName:  ${config.userChaincodeName}`);
    console.log(`mspId:              ${config.mspId}`);
    console.log(`cryptoPath:         ${config.cryptoPath}`);
    console.log(`keyDirectoryPath:   ${config.keyDirectoryPath}`);
    console.log(`certPath:           ${config.certPath}`);
    console.log(`tlsCertPath:        ${config.tlsCertPath}`);
    console.log(`peerEndpoint:       ${config.peerEndpoint}`);
    console.log(`peerHostAlias:      ${config.peerHostAlias}`);
}

export {
    displayInputParameters,
};
