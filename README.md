# SuiConnect

Add a Sui wallet connector anywhere.

If you need to interact with Sui in a plain HTML/JS page and can't use libraries like `react` and `@mysten/dapp-kit`, SuiConnect has you covered.

## How to use

1. Load SuiConnect in your HTML `<head>`:
```html
<link rel="stylesheet" href="https://suiconnect.polymedia.app/assets/index-1.0.0.css">
<script defer src="https://suiconnect.polymedia.app/assets/index-1.0.0.js" onload="window.suiconnectInit()"></script>
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

## Styling

You can style the wallet button and its container with these CSS selectors:

```css
#suiconnect-root {
}
#suiconnect .btn {
}
#suiconnect .btn.disconnect {
}
```
