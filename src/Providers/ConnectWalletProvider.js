import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { coinbaseWallet, metaMask, walletConnect } from 'wagmi/connectors';

// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Get projectId from https://cloud.walletconnect.com
const projectId =
    process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID ||
    'f3ec191ff1a02016249d76c9de7ad02b';

const chains = [mainnet];

export const wagmiConfig = createConfig({
    chains,
    connectors: [
        walletConnect({ projectId }),
        metaMask(),
        coinbaseWallet({
            appName: 'ChainGlance',
            // appLogoUrl: 'https://coin.tax/logo.png',
        }),
    ],
    transports: {
        [mainnet.id]: http(),
    },
});

export const validConnectorIds = [
    'walletConnect',
    'io.metamask',
    'coinbaseWalletSDK',
];

export function ConnectWalletProvider({ children }) {
    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    );
}
