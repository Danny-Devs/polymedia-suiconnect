# SuiConnect

Add a Sui wallet connector anywhere.

If you need to interact with Sui in a plain HTML/JS page and can't use libraries like `react` and `@mysten/dapp-kit`, SuiConnect has you covered.

## How to use

1. Load SuiConnect in your HTML `<head>`:
```html
<link rel="stylesheet" href="https://8d48b16d.polymedia-suiconnect.pages.dev/assets/index-1.0.0.css">
<script defer src="https://8d48b16d.polymedia-suiconnect.pages.dev/assets/index-1.0.0.js" onload="window.suiconnectInit()"></script>
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
        signTransaction, // prompt the user to sign a tx (to be executed with SuiClient)
        SuiClient, // SuiClient class
        Transaction, // Transaction class
    } = event.detail;
    // ... your code here ...
});
</script>
```

## Example

A complete working example is in [src/demo/index.html](./src/demo/index.html).

To try it locally, run one of the following commands and visit http://localhost:3333 in your browser.

Using Node:
```
cd src/demo/
npx http-server -p 3333
```

Using Python:
```
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

## Security

SuiConnect is served via immutable CloudFlare URLs. Once added to your project, the code will never change unless you choose to update it.

## Versions

### 1.0.0

Uses `@mysten/sui` 1.18.0 and `@mysten/dapp-kit` 0.14.44.

```html
<link rel="stylesheet" href="https://8d48b16d.polymedia-suiconnect.pages.dev/assets/index-1.0.0.css">
<link rel="stylesheet" href="https://8d48b16d.polymedia-suiconnect.pages.dev/assets/index-1.0.0.css">
<script defer src="https://8d48b16d.polymedia-suiconnect.pages.dev/assets/index-1.0.0.js" onload="window.suiconnectInit()"></script>
```
