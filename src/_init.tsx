import { createRoot } from "react-dom/client";
import { WalletConnector } from "./App";

function init() {
    const container = document.getElementById("shopisui-root");
    if (container) {
        const root = createRoot(container);
        root.render(<WalletConnector />);
    }
}

// initialize immediately if we're in development
if (import.meta.env.MODE === "development") {
    init();
}

// export initialization function for production use in Shopify
(window as any).shopisuiInit = init;
