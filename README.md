# SuiConnect

Add a Sui wallet connector anywhere.

If you need to interact with Sui in a plain HTML/JS page and can't use libraries like `react`, `@mysten/sui`, `@mysten/dapp-kit`, SuiConnect has you covered.

## How to use

See [src/demo/index.html](./src/demo/index.html) for a working example.

To try it locally:

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

Then visit http://localhost:3333 and open the browser console to see what's happening under the hood.
