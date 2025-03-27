// Assets page functionality
let suiPrice = 0;
let allAssets = [];

const initializeAssets = async () => {
  const loadingOverlay = document.getElementById('loading');
  const assetsContent = document.getElementById('assets-content');

  try {
    await Promise.all([
      loadSuiPrice(),
      loadAssets()
    ]);

    setupFilters();
    loadingOverlay.classList.add('hidden');
  } catch (error) {
    console.error('Error initializing assets:', error);
    assetsContent.innerHTML = `
      <div class="error-state">
        <p>Error loading assets: ${error.message}</p>
      </div>
    `;
    loadingOverlay.classList.add('hidden');
  }
};

const loadSuiPrice = async () => {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=sui&vs_currencies=usd');
    const data = await response.json();
    suiPrice = data.sui.usd;
    updateBalanceDisplay();
  } catch (error) {
    console.error('Error fetching SUI price:', error);
  }
};

const updateBalanceDisplay = () => {
  const balanceAmount = document.querySelector('.balance-amount');
  const balanceUSD = document.querySelector('.balance-usd');

  if (window.suiconnect?.balance) {
    const balance = Number(window.suiconnect.balance) / 1_000_000_000;
    balanceAmount.textContent = `${balance.toFixed(4)} SUI`;
    balanceUSD.textContent = `$${(balance * suiPrice).toFixed(2)} USD`;
  }
};

const loadAssets = async () => {
  if (!window.suiconnect?.address) {
    showConnectWalletState();
    return;
  }

  try {
    const { client } = window.suiconnect;
    const response = await client.getOwnedObjects({
      owner: window.suiconnect.address,
      options: {
        showContent: true,
        showDisplay: true
      }
    });

    allAssets = response.data || [];
    displayAssets(allAssets);
  } catch (error) {
    console.error('Error loading assets:', error);
    throw error;
  }
};

const displayAssets = (assets) => {
  const assetsContent = document.getElementById('assets-content');

  if (!assets.length) {
    assetsContent.innerHTML = `
      <div class="empty-state">
        <p>No assets found in your wallet</p>
      </div>
    `;
    return;
  }

  assetsContent.innerHTML = assets.map(asset => {
    const { data } = asset;
    const display = data.display?.data || {};
    const content = data.content?.fields || {};
    const isCoin = data.type?.includes('::sui::SUI');

    if (isCoin) {
      const balance = Number(content.balance) / 1_000_000_000;
      return `
        <div class="asset-card">
          <div class="asset-details">
            <div class="asset-name">${balance.toFixed(4)} SUI</div>
            <div class="asset-type">Coin</div>
            <div class="asset-value">≈ $${(balance * suiPrice).toFixed(2)} USD</div>
          </div>
        </div>
      `;
    }

    return `
      <div class="asset-card">
        ${display.image_url ? `
          <img src="${display.image_url}" alt="${display.name}" class="asset-image">
        ` : ''}
        <div class="asset-details">
          <div class="asset-name">${display.name || 'Unnamed Asset'}</div>
          <div class="asset-type">${data.type?.split('::').pop() || 'Unknown Type'}</div>
          ${display.description ? `
            <div class="asset-description">${display.description}</div>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
};

const setupFilters = () => {
  const searchInput = document.getElementById('search');
  const filterButtons = document.querySelectorAll('.filter-btn');

  searchInput.addEventListener('input', filterAssets);
  filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterButtons.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      filterAssets();
    });
  });
};

const filterAssets = () => {
  const searchTerm = document.getElementById('search').value.toLowerCase();
  const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;

  const filtered = allAssets.filter(asset => {
    const { data } = asset;
    const matchesSearch =
      data.objectId?.toLowerCase().includes(searchTerm) ||
      data.type?.toLowerCase().includes(searchTerm) ||
      data.display?.data?.name?.toLowerCase().includes(searchTerm);

    if (activeFilter === 'all') return matchesSearch;
    if (activeFilter === 'coin') return matchesSearch && data.type?.includes('::sui::SUI');
    if (activeFilter === 'nft') return matchesSearch && data.display?.data?.image_url;

    return matchesSearch;
  });

  displayAssets(filtered);
};

const showConnectWalletState = () => {
  const assetsContent = document.getElementById('assets-content');
  assetsContent.innerHTML = `
    <div class="connect-wallet-state">
      <p>Connect your wallet to view your assets</p>
    </div>
  `;
};

// Export functions
window.initializeAssets = initializeAssets; 