import { ConnectModal, SuiClientProvider, useCurrentAccount, WalletProvider, useDisconnectWallet } from '@mysten/dapp-kit';
import "@mysten/dapp-kit/dist/index.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import './App.less';

const emitWalletEvent = (connected: boolean, address: string | null) => {
    const event = new CustomEvent('walletEvent', {
        detail: { connected, address }
    });
    window.dispatchEvent(event);
    console.debug('walletEvent', { connected, address });
};

export const WalletConnector = () =>
{
    const queryClient = new QueryClient();

    const networkConfig = {
        mainnet: { url: "https://fullnode.mainnet.sui.io/" }
    };

    return (
        <QueryClientProvider client={queryClient}>
            <SuiClientProvider networks={networkConfig} network="mainnet">
                <WalletProvider autoConnect={false}>
                    <App />
                </WalletProvider>
            </SuiClientProvider>
        </QueryClientProvider>
    );
};

const App = () =>
{
    const currAcct = useCurrentAccount();
    const { mutate: disconnect } = useDisconnectWallet();
    const [showConnectModal, setShowConnectModal] = useState(false);

    useEffect(() => {
        emitWalletEvent(!!currAcct, currAcct?.address ?? null);
    }, [currAcct]);

    return <div id="shopisui">

    {currAcct &&
        <div className="status">
            Connected as {currAcct.address.slice(0,6)}...{currAcct.address.slice(-4)}
        </div>
    }

        {!currAcct &&
            <button
                onClick={() => setShowConnectModal(true)}
                className="btn connect"
            >
                CONNECT WALLET
            </button>
        }

        {currAcct &&
            <button
                onClick={() => disconnect()}
                className="btn disconnect"
            >
                DISCONNECT
            </button>
        }

        <ConnectModal
            trigger={<></>}
            open={showConnectModal}
            onOpenChange={setShowConnectModal}
        />
    </div>;
};
