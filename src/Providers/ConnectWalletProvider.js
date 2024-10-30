import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { coinbaseWallet, metaMask, walletConnect } from 'wagmi/connectors';
import config from '../config';

// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Get projectId from https://cloud.walletconnect.com
const projectId = config.walletConnect.PROJECT_ID;
const chains = [mainnet];

export const wagmiConfig = createConfig({
    chains,
    connectors: [
        walletConnect({ projectId }),
        metaMask(),
        coinbaseWallet({
            appName: 'ChainGlance',
            headlessMode: false
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
