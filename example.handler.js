window.addEventListener('nft-ownership-check', (event) => {
    const buyButton = document.getElementById('custom-cart-btn');
    if (buyButton) {
        if (event.detail.ownsNft) {
            buyButton.classList.remove('hidden');
        } else {
            buyButton.classList.add('hidden');
        }
    }
});
