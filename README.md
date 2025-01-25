# SuiConnect

Add Sui connectivity anywhere, using just plain HTML/JS.

Use it if your website needs to interact with Sui wallets and RPCs, but can't use libraries like `react` and `@mysten/dapp-kit`.

![Polymedia SuiConnect](https://suiconnect.polymedia.app/img/open-graph.webp)

## How to use

1. Load SuiConnect in your `<head>`:
```html
<link rel="stylesheet" href="https://c9bb31a4.polymedia-suiconnect.pages.dev/assets/index-1.1.0.css">
<script defer src="https://c9bb31a4.polymedia-suiconnect.pages.dev/assets/index-1.1.0.js"
    onload="window.suiconnectInit({
        rpcUrl: 'https://fullnode.mainnet.sui.io',
        autoConnect: true,
    })">
</script>
```

2. Add the wallet button to your `<body>`:
```html
<div id="suiconnect-root">
    <div id="suiconnect">
        <button disabled class="btn connect">CONNECT WALLET</button>
    </div>
</div>
```

3. Handle wallet connect/disconnect:
```html
<script>
window.addEventListener("suiconnect-wallet-change", (event) => {
    // You can use one or more of the following:
    const {
        address, // string if connected, null if disconnected
        signPersonalMessage, // prompt the user to sign a message
        signAndExecuteTransaction, // prompt the user to sign and execute a tx
        signTransaction, // prompt the user to sign a tx (can then be executed with SuiClient)
        client, // SuiClient instance
        Transaction, // Transaction class
    } = event.detail;
    // ... your code here ...
});
</script>
```

## Demo

A working demo is available at [src/demo/index.html](./src/demo/index.html).

To try it locally, run one of the following commands and visit http://localhost:3333 in your browser.

Using Node:
```shell
cd src/demo/
npx http-server -p 3333
```

Using Python:
```shell
cd src/demo/
python3 -m http.server 3333
```

## Styling

You can style the wallet button and its container with these CSS selectors:

```css
#suiconnect-root { /* ... */ }
#suiconnect .btn { /* ... */ }
#suiconnect .btn.disconnect { /* ... */ }
```

## Security

SuiConnect is served via immutable CloudFlare URLs. Once added to your project, the code will never change unless you choose to update it.

## Versions

### 1.1.0

Notes:
- Uses `@mysten/sui@1.20.0` and `@mysten/dapp-kit@0.14.47`.
- Adds configuration options for `rpcUrl` and `autoConnect`.
- Exposes `SuiClient` instance instead of class.

Installation:
```html
<link rel="stylesheet" href="https://c9bb31a4.polymedia-suiconnect.pages.dev/assets/index-1.1.0.css">
<script defer src="https://c9bb31a4.polymedia-suiconnect.pages.dev/assets/index-1.1.0.js"
    onload="window.suiconnectInit({
        rpcUrl: 'https://fullnode.mainnet.sui.io',
        autoConnect: true,
    })">
</script>
```

### 1.0.0

Notes:
- Uses `@mysten/sui@1.18.0` and `@mysten/dapp-kit@0.14.44`.

Installation:
```html
<link rel="stylesheet" href="https://8d48b16d.polymedia-suiconnect.pages.dev/assets/index-1.0.0.css">
<link rel="stylesheet" href="https://8d48b16d.polymedia-suiconnect.pages.dev/assets/index-1.0.0.css">
<script defer src="https://8d48b16d.polymedia-suiconnect.pages.dev/assets/index-1.0.0.js" onload="window.suiconnectInit()"></script>
```
