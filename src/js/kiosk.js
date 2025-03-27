// Kiosk state
let kioskId = null;

// Kiosk Functions
export async function createKiosk() {
  if (!window.suiconnect?.address) {
    alert('Please connect your wallet first');
    return;
  }

  try {
    const { Transaction, signAndExecuteTransaction } = window.suiconnect;
    const tx = new Transaction();

    tx.moveCall({
      target: '0x2::kiosk::create',
      arguments: []
    });

    const result = await signAndExecuteTransaction({
      transaction: tx,
      options: { showEffects: true }
    });

    kioskId = result.effects.created[0].reference.objectId;
    alert(`Kiosk created successfully!\nKiosk ID: ${kioskId}`);

    // Reload listings
    await Promise.all([loadListedNFTs(), loadMyListings()]);
  } catch (error) {
    alert(`Error creating kiosk: ${error.message}`);
  }
}

export async function loadListedNFTs() {
  const listedNFTs = document.getElementById('listedNFTs');

  try {
    const { getKioskListings } = window.suiconnect;
    const listings = await getKioskListings();

    if (!listings.length) {
      listedNFTs.innerHTML = `
        <div class="empty-state">
          <p>No NFTs listed in the marketplace</p>
        </div>
      `;
      return;
    }

    listedNFTs.innerHTML = listings.map(nft => `
      <div class="nft-card card">
        <div class="nft-image">
          ${nft.image_url
        ? `<img src="${nft.image_url}" alt="${nft.name}">`
        : `<span class="placeholder">No Image</span>`
      }
        </div>
        <div class="nft-details">
          <h4>${nft.name || 'Untitled NFT'}</h4>
          <p>${nft.description || 'No description'}</p>
          <div class="price-tag">
            <svg class="sui-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.8L19.2 8 12 11.2 4.8 8 12 4.8zM4 9.5l7 3.5v7L4 16.5v-7zm9 10.5v-7l7-3.5v7l-7 3.5z"/>
            </svg>
            ${(nft.price / 1e9).toFixed(4)} SUI
          </div>
          <div class="action-buttons">
            <button class="btn btn-primary" onclick="buyNFT('${nft.id}', ${nft.price})">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    listedNFTs.innerHTML = `
      <div class="error">
        Error loading marketplace: ${error.message}
      </div>
    `;
  }
}

export async function loadMyListings() {
  const myListings = document.getElementById('myListings');

  try {
    const { getMyKioskListings } = window.suiconnect;
    const listings = await getMyKioskListings();

    if (!listings.length) {
      myListings.innerHTML = `
        <div class="empty-state">
          <p>You haven't listed any NFTs yet</p>
        </div>
      `;
      return;
    }

    myListings.innerHTML = listings.map(nft => `
      <div class="nft-card card">
        <div class="nft-image">
          ${nft.image_url
        ? `<img src="${nft.image_url}" alt="${nft.name}">`
        : `<span class="placeholder">No Image</span>`
      }
        </div>
        <div class="nft-details">
          <h4>${nft.name || 'Untitled NFT'}</h4>
          <p>${nft.description || 'No description'}</p>
          <div class="price-tag">
            <svg class="sui-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.8L19.2 8 12 11.2 4.8 8 12 4.8zM4 9.5l7 3.5v7L4 16.5v-7zm9 10.5v-7l7-3.5v7l-7 3.5z"/>
            </svg>
            ${(nft.price / 1e9).toFixed(4)} SUI
          </div>
          <div class="action-buttons">
            <button class="btn btn-secondary" onclick="delistNFT('${nft.id}')">
              Delist
            </button>
          </div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    myListings.innerHTML = `
      <div class="error">
        Error loading your listings: ${error.message}
      </div>
    `;
  }
}

export async function listNFT(nftId, price) {
  if (!kioskId) {
    alert('Please create a kiosk first');
    return;
  }

  try {
    const { Transaction, signAndExecuteTransaction } = window.suiconnect;
    const tx = new Transaction();

    tx.moveCall({
      target: '0x2::kiosk::list',
      arguments: [tx.pure(kioskId), tx.pure(nftId), tx.pure(price)]
    });

    const result = await signAndExecuteTransaction({
      transaction: tx,
      options: { showEffects: true }
    });

    alert(`NFT listed successfully!\nTransaction digest: ${result.digest}`);

    // Reload listings
    await Promise.all([loadListedNFTs(), loadMyListings()]);
  } catch (error) {
    alert(`Error listing NFT: ${error.message}`);
  }
}

export async function delistNFT(nftId) {
  if (!kioskId) {
    alert('No kiosk found');
    return;
  }

  try {
    const { Transaction, signAndExecuteTransaction } = window.suiconnect;
    const tx = new Transaction();

    tx.moveCall({
      target: '0x2::kiosk::delist',
      arguments: [tx.pure(kioskId), tx.pure(nftId)]
    });

    const result = await signAndExecuteTransaction({
      transaction: tx,
      options: { showEffects: true }
    });

    alert(`NFT delisted successfully!\nTransaction digest: ${result.digest}`);

    // Reload listings
    await Promise.all([loadListedNFTs(), loadMyListings()]);
  } catch (error) {
    alert(`Error delisting NFT: ${error.message}`);
  }
}

export async function buyNFT(nftId, price) {
  try {
    const { Transaction, signAndExecuteTransaction } = window.suiconnect;
    const tx = new Transaction();

    tx.moveCall({
      target: '0x2::kiosk::purchase',
      arguments: [tx.pure(kioskId), tx.pure(nftId), tx.pure(price)]
    });

    const result = await signAndExecuteTransaction({
      transaction: tx,
      options: { showEffects: true }
    });

    alert(`NFT purchased successfully!\nTransaction digest: ${result.digest}`);

    // Reload listings
    await Promise.all([loadListedNFTs(), loadMyListings()]);
  } catch (error) {
    alert(`Error purchasing NFT: ${error.message}`);
  }
} 