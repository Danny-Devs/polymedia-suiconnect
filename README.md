# ShopiSui - Shopify wallet connector for Sui

## Installation

1. Add this to your HTML where you want to display the [CONNECT WALLET] button:

```html
<div id="shopisui-root"></div>
```

2. Load ShopiSui into your page by adding this to the `<head>` section of your HTML:
```html
<script>
    // === Load and initialize ShopiSui ===
    (() => {
        // CSS
        const cssLink = document.createElement("link");
        cssLink.rel = "stylesheet";
        cssLink.href = "https://shopisui.polymedia.app/assets/index-BRDBaH6M.css";
        document.head.appendChild(cssLink);

        // JS
        const script = document.createElement("script");
        script.src = "https://shopisui.polymedia.app/assets/index-SdeMN7eJ.js";
        script.onload = function() {
            window.shopisuiInit();
        };
        document.body.appendChild(script);
    })();
</script>
```

3. Listen to the `shopisui-wallet-change` event in your JavaScript code to get the wallet address and handle the wallet change:
```js
window.addEventListener("shopisui-wallet-change", (walletEvent) => {
    const { client, address } = walletEvent.detail;
    console.log("Wallet change:", address);
});
```
