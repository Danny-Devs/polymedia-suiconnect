// @ts-expect-error Property 'toJSON' does not exist on type 'BigInt'
BigInt.prototype.toJSON = function() { return this.toString(); };

import { createRoot } from 'react-dom/client';
import { WalletConnector } from './App';

// Initialize immediately if we're in development
if (import.meta.env.MODE === 'development') {
    const container = document.getElementById('wallet-connect-root');
    if (container) {
        const root = createRoot(container);
        root.render(<WalletConnector />);
    }
}

// Export initialization function for production use in Shopify
(window as any).initWalletConnector = () => {
    const container = document.getElementById('wallet-connect-root');
    if (container) {
        const root = createRoot(container);
        root.render(<WalletConnector />);
    }
};
