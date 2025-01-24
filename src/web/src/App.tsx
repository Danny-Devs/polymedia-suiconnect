import { ConnectModal, SuiClientProvider, SuiClientProviderContext, useCurrentAccount, useDisconnectWallet, useSignAndExecuteTransaction, useSignPersonalMessage, useSignTransaction, WalletProvider } from "@mysten/dapp-kit";
import "@mysten/dapp-kit/dist/index.css";
import { SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import "./App.css";

export type SuiConnectConfig = {
    rpcUrl: string;
    autoConnect: boolean;
};

export const SuiConnect = ({ cnf }: {
    cnf: SuiConnectConfig,
}) => {
    const queryClient = new QueryClient();
    const networkConfig = {
        NetworkNameDoesntMatter: { url: cnf.rpcUrl }
    };
    return (
        <QueryClientProvider client={queryClient}>
            <SuiClientProvider networks={networkConfig} network="NetworkNameDoesntMatter">
                <WalletProvider autoConnect={cnf.autoConnect}>
                    <App />
                </WalletProvider>
            </SuiClientProvider>
        </QueryClientProvider>
    );
};

type WalletChangeDetail = {
    address: string | null;
    signPersonalMessage: unknown;
    signAndExecuteTransaction: unknown;
    signTransaction: unknown;
    SuiClient: typeof SuiClient;
    Transaction: typeof Transaction;
};

const emitWalletChangeEvent = (detail: WalletChangeDetail) => {
    const event = new CustomEvent("suiconnect-wallet-change", { detail });
    console.debug("[suiconnect] wallet change:", detail.address);
    window.dispatchEvent(event);
};

const App = () =>
{
    const currAcct = useCurrentAccount();
	const { mutateAsync: signPersonalMessage } = useSignPersonalMessage();
	const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();
	const { mutateAsync: signTransaction } = useSignTransaction();
    const { mutate: disconnect } = useDisconnectWallet();

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        emitWalletChangeEvent({
            address: currAcct?.address ?? null,
            signPersonalMessage,
            signAndExecuteTransaction,
            signTransaction,
            SuiClient,
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
