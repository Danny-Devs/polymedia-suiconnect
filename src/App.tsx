import { ConnectModal, SuiClientProvider, useCurrentAccount, WalletProvider } from '@mysten/dapp-kit';
import "@mysten/dapp-kit/dist/index.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export const WalletConnector = () =>
{
    const queryClient = new QueryClient();

    const networkConfig = {
        mainnet: { url: "https://fullnode.mainnet.sui.io/" }
    };

    return (
        <QueryClientProvider client={queryClient}>
            <SuiClientProvider networks={networkConfig} network="mainnet">
                <WalletProvider autoConnect={true}>
                    <App />
                </WalletProvider>
            </SuiClientProvider>
        </QueryClientProvider>
    );
};

const App = () =>
{
    const currAcct = useCurrentAccount();
    const [showConnectModal, setShowConnectModal] = useState(false);
    return <>
        <button
            onClick={() => setShowConnectModal(true)}
            style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                background: '#1E88E5',
                color: 'white',
                cursor: 'pointer'
            }}
        >
            Connect Wallet
        </button>

        <ConnectModal
            trigger={<></>}
            open={showConnectModal}
            onOpenChange={setShowConnectModal}
        />

        <div style={{
            marginTop: '1rem',
        }}>
            Connection status: {currAcct ?
                `Connected as ${currAcct.address.slice(0,6)}...${currAcct.address.slice(-4)}` :
                'Not connected'
            }
        </div>
    </>;
};
