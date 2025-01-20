# SuiConnect

Add a Sui wallet connector anywhere.

If you need to interact with Sui in a plain HTML/JS page and can't use libraries like `react`, `@mysten/sui`, `@mysten/dapp-kit`, SuiConnect has you covered.

## How to use

1. Load SuiConnect in your HTML `<head>`:
```html
<link rel="stylesheet" href="https://suiconnect.polymedia.app/assets/index.css">
<script defer src="https://suiconnect.polymedia.app/assets/index.js" onload="window.suiconnectInit()"></script>
```

2. Add the wallet button container to your `<body>`:
```html
<div id="suiconnect-root"></div>
```

3. Handle wallet connect/disconnect:
```html
<script>
window.addEventListener("suiconnect-wallet-change", (event) => {
    const {
        address, // string if connected, null if disconnected
        signPersonalMessage, // prompt the user to sign a message
        signAndExecuteTransaction, // prompt the user to sign and execute a tx
        signTransaction, // prompt the user to sign a tx (to be executed with SuiClient)
        SuiClient, // SuiClient class
        Transaction, // Transaction class
    } = event.detail;
    // your code here
});
</script>
```

## Example

A complete working example is in [src/demo/index.html](./src/demo/index.html).

To try it locally, run the following commands and visit http://localhost:3333 in your browser.

With Node:
```
cd src/demo/
npx http-server -p 3333
```

With Python:
```
cd src/demo/
python3 -m http.server 3333
```
