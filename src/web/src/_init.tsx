import { createRoot } from "react-dom/client";
import { SuiConnect, SuiConnectConfig } from "./App";
import { getFullnodeUrl } from "@mysten/sui/client";

function init(cnf: SuiConnectConfig) {
    const container = document.getElementById("suiconnect-root");
    if (container) {
        const root = createRoot(container);
        root.render(<SuiConnect cnf={cnf} />);
    }
}

// initialize immediately if we're in development
if (import.meta.env.MODE === "development") {
    init({
        rpcUrl: getFullnodeUrl("mainnet"),
        autoConnect: true
    });
}

// export initialization function for production use
(window as any).suiconnectInit = init; // eslint-disable-line
