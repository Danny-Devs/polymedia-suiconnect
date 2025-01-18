# SuiConnect

Add a Sui wallet connector anywhere.

## Installation

1. Add this where you want the wallet button to appear:

```html
<div id="suiconnect-root"></div>
```

2. Add the loader script to the `<head>` section of your page:

```html
<script>
    // === Load and initialize SuiConnect ===
    (() => {
        // CSS
        const cssLink = document.createElement("link");
        cssLink.rel = "stylesheet";
        cssLink.href = "https://suiconnect.polymedia.app/assets/index-Ci8EKbxv.css";
        document.head.appendChild(cssLink);

        // JS
        const script = document.createElement("script");
        script.src = "https://suiconnect.polymedia.app/assets/index-BRGtAXLz.js";
        script.onload = () => window.suiconnectInit();
        document.body.appendChild(script);
    })();
</script>
```

3. Handle wallet connections:

```js
window.addEventListener("suiconnect-wallet-change", (event) => {
    const { client, address } = event.detail;
    // address is a string or null when not connected
    console.log("Connected wallet:", address);
    // client is a SuiClient instance
    client.getLatestSuiSystemState().then(state => {
        console.log("Current epoch:", state.epoch);
    });
});
```

4. Style the connect button to your liking:

```css
#suiconnect-root button {
    background: blue;
    color: white;
}
#suiconnect-root button.disconnect {
    background: red;
}
```
