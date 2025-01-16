# ShopiSui - Shopify wallet connector for Sui

## Installation

Add this "Custom liquid" to your Shopify theme:

```html
<div id="shopisui-root"></div>

<script>
(function()
{
    // === Your custom code ===

    async function onWalletChange(event) {
        const { client, address } = event.detail;
        console.debug("[shopisui.onWalletChange] wallet address:", address);
        // your custom code goes here
    }

    // === ShopiSui ===

    // Load ShopiSui CSS
    const cssLink = document.createElement("link");
    cssLink.rel = "stylesheet";
    cssLink.href = "https://shopisui.polymedia.app/assets/index-B_JEpp2Z.css";
    document.head.appendChild(cssLink);

    // Load and initialize ShopiSui JS
    const script = document.createElement("script");
    script.src = "https://shopisui.polymedia.app/assets/index-BYzmFkl_.js";
    script.onload = function() {
        window.shopisuiInit();
        window.addEventListener("shopisui-wallet-change", onWalletChange);
    };
    document.body.appendChild(script);
})();
</script>
```
