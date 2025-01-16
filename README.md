# ShopiSui - Shopify wallet connector for Sui

Add this "Custom liquid" to your Shopify theme:

```js
<div id="shopisui-root"></div>

<script>
(function() {
    // Load ShopiSui CSS
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = 'https://shopisui.polymedia.app/assets/index-B_JEpp2Z.css';
    document.head.appendChild(cssLink);

    // Load and initialize ShopiSui JS
    const script = document.createElement('script');
    script.src = 'https://shopisui.polymedia.app/assets/index-CafobUI1.js';
    script.onload = function() {
        window.shopisuiInit();
    };
    document.body.appendChild(script);
})();
</script>
```
