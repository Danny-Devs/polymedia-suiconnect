import { ConnectModal, SuiClientProvider, useCurrentAccount, useDisconnectWallet, useSignAndExecuteTransaction, useSignPersonalMessage, useSignTransaction, useSuiClient, WalletProvider } from "@mysten/dapp-kit";
import "@mysten/dapp-kit/dist/index.css";
import { SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import "./App.css";

type WalletChangeDetail = {
    address: string | null;
    client: SuiClient;
    signTransaction: unknown;
    signAndExecuteTransaction: unknown;
    signPersonalMessage: unknown;
    Transaction: typeof Transaction;
};

const emitWalletChangeEvent = (detail: WalletChangeDetail) => {
    const event = new CustomEvent("suiconnect-wallet-change", { detail });
    console.debug("[suiconnect] wallet change:", detail.address);
    window.dispatchEvent(event);
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
                <WalletProvider autoConnect={true}>
                    <App />
                </WalletProvider>
            </SuiClientProvider>
        </QueryClientProvider>
    );
};

const App = () =>
{

    const suiClient = useSuiClient();
    const currAcct = useCurrentAccount();
    const { mutate: disconnect } = useDisconnectWallet();
	const { mutateAsync: signTransaction } = useSignTransaction();
	const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();
	const { mutateAsync: signPersonalMessage } = useSignPersonalMessage();

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        emitWalletChangeEvent({
            address: currAcct?.address ?? null,
            client: suiClient,
            signTransaction,
            signAndExecuteTransaction,
            signPersonalMessage,
            Transaction,
        });
    }, [currAcct]);

    return <div id="suiconnect">
        <ConnectModal
            trigger={<></>}
            open={isOpen}
            onOpenChange={setIsOpen}
        />
        {!currAcct &&
            <button className="btn connect" onClick={() => setIsOpen(true)}>
                CONNECT WALLET
            </button>
        }
        {currAcct &&
            <button className="btn disconnect" onClick={() => disconnect()}>
                DISCONNECT
            </button>
        }
    </div>;
};
