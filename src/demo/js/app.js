// Theme Management
const ThemeManager = {
  init() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.setTheme(savedTheme);
  },

  setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  },

  toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
};

// Router Management
const Router = {
  routes: {
    '/': 'pages/home.html',
    '/assets': 'pages/assets.html',
    '/create': 'pages/create.html',
    '/kiosk': 'pages/kiosk.html'
  },

  init() {
    if (!location.hash) {
      location.hash = '/';
    }
    this.handleNavigation();
  },

  async handleNavigation() {
    const hash = location.hash.slice(1) || '/';
    const page = this.routes[hash];

    if (!page) {
      console.error('Page not found');
      return;
    }

    try {
      const response = await fetch(page);
      const html = await response.text();
      document.getElementById('app').innerHTML = html;

      // Initialize page-specific functionality
      const initFunctionName = `init${hash.split('/')[1]?.charAt(0).toUpperCase()}${hash.split('/')[1]?.slice(1)}Page`;
      if (typeof window[initFunctionName] === 'function') {
        window[initFunctionName]();
      }
    } catch (error) {
      console.error('Error loading page:', error);
      document.getElementById('app').innerHTML = `
                <div class="error">
                    Error loading page: ${error.message}
                </div>
            `;
    }
  }
};

// Wallet Management
const WalletManager = {
  init() {
    this.updateConnectionStatus();
    window.addEventListener('suiconnect:addressChanged', () => {
      this.updateConnectionStatus();
      Router.handleNavigation();
    });
  },

  async connect() {
    try {
      await window.suiconnect.connect();
      this.updateConnectionStatus();
      Router.handleNavigation();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Error connecting wallet: ' + error.message);
    }
  },

  async disconnect() {
    try {
      await window.suiconnect.disconnect();
      this.updateConnectionStatus();
      Router.handleNavigation();
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      alert('Error disconnecting wallet: ' + error.message);
    }
  },

  updateConnectionStatus() {
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('.status-text');
    const connectBtn = document.getElementById('connectBtn');
    const address = window.suiconnect?.address;

    if (address) {
      statusDot.classList.add('connected');
      statusText.textContent = `${address.slice(0, 6)}...${address.slice(-4)}`;
      connectBtn.textContent = 'Disconnect';
    } else {
      statusDot.classList.remove('connected');
      statusText.textContent = 'Disconnected';
      connectBtn.textContent = 'Connect Wallet';
    }
  }
};

// Utility Functions
function formatSuiAmount(amount) {
  return (amount / 1e9).toFixed(4);
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert('Copied to clipboard!');
  }).catch(err => {
    console.error('Error copying to clipboard:', err);
  });
}

// Export modules
window.ThemeManager = ThemeManager;
window.Router = Router;
window.WalletManager = WalletManager;

// Core wallet functionality
let suiconnect = null;
let allObjects = [];

// Initialize wallet connection
window.addEventListener('suiconnect-wallet-change', async event => {
  suiconnect = event.detail;
  updateUI();
  if (suiconnect?.address) {
    await loadWalletContents();
  } else {
    document.getElementById('balance').classList.add('hidden');
    document.getElementById('wallet-grid').innerHTML = '';
  }
});

// UI Updates
function updateUI() {
  const address = suiconnect?.address;
  if (address) {
    document.getElementById('fullAddress').textContent = address;
  } else {
    document.getElementById('fullAddress').textContent = '';
  }
}

function formatAddress(address) {
  if (!address) return '';
  const showFull = document.getElementById('showFullAddress')?.checked;
  return showFull ? address : `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Settings Management
function toggleSettings() {
  document.getElementById('settingsMenu').classList.toggle('active');
}

function toggleAddressDisplay() {
  updateUI();
}

// Wallet Content Loading
async function loadWalletContents() {
  const loading = document.getElementById('loading');
  const grid = document.getElementById('wallet-grid');
  loading.classList.remove('hidden');
  grid.innerHTML = '';

  try {
    const { client } = suiconnect;

    // Get SUI balance
    const balance = await client.getBalance({
      owner: suiconnect.address,
      coinType: '0x2::sui::SUI'
    });
    const totalBalance = Number(balance.totalBalance) / 1_000_000_000;

    document.getElementById('balance').classList.remove('hidden');
    document.querySelector('.balance-sui').textContent = `${totalBalance.toFixed(4)} SUI`;

    // Get all objects with pagination
    let cursor = null;
    allObjects = [];

    do {
      const response = await client.getOwnedObjects({
        owner: suiconnect.address,
        options: {
          showContent: true,
          showDisplay: true
        },
        cursor: cursor,
        limit: 50
      });

      if (response?.data) {
        allObjects = [...allObjects, ...response.data];
        cursor = response.hasNextPage ? response.nextCursor : null;
      } else {
        console.error('Invalid response format:', response);
        break;
      }
    } while (cursor);

    displayObjects(allObjects);
  } catch (error) {
    console.error('Error loading wallet contents:', error);
    grid.innerHTML = `<p class="error">Error loading wallet contents: ${error.message}</p>`;
  } finally {
    loading.classList.add('hidden');
  }
}

// Object Display and Filtering
function filterObjects() {
  const searchTerm = document.getElementById('search').value.toLowerCase();
  const typeFilter = document.getElementById('type-filter').value;

  const filtered = allObjects.filter(obj => {
    if (!obj?.data?.objectId || !obj?.data?.type) return false;

    const matchesSearch =
      obj.data.objectId.toLowerCase().includes(searchTerm) ||
      obj.data.type.toLowerCase().includes(searchTerm);

    if (typeFilter === 'all') return matchesSearch;
    if (typeFilter === 'coin')
      return matchesSearch && obj.data.type.includes('::sui::SUI');
    if (typeFilter === 'nft')
      return matchesSearch && (
        obj.data?.display?.data?.image_url ||
        obj.data?.content?.fields?.url ||
        obj.data?.content?.fields?.name
      );
    if (typeFilter === 'other')
      return matchesSearch &&
        !obj.data.type.includes('::sui::SUI') &&
        !(
          obj.data?.display?.data?.image_url ||
          obj.data?.content?.fields?.url ||
          obj.data?.content?.fields?.name
        );

    return matchesSearch;
  });

  displayObjects(filtered);
}

function displayObjects(objects) {
  const grid = document.getElementById('wallet-grid');
  grid.innerHTML = '';

  if (!Array.isArray(objects) || objects.length === 0) {
    grid.innerHTML = '<p class="empty-state">No objects found in your wallet.</p>';
    return;
  }

  objects.forEach(obj => {
    if (!obj?.data) return;

    const display = obj.data.display?.data || {};
    const content = obj.data.content?.fields || {};
    const isCoin = obj.data.type?.includes('::sui::SUI');
    const type = obj.data.type?.split('::').pop() || 'Unknown Type';

    const card = document.createElement('div');
    card.className = 'object-card card';

    if (isCoin && content?.balance) {
      const balance = Number(content.balance) / 1_000_000_000;
      const mist = Number(content.balance);
      card.innerHTML = createCoinCardHTML(obj.data.objectId, type, balance, mist);
    } else if (display.image_url || content.url) {
      card.innerHTML = createNFTCardHTML(obj.data, display, content, type);
    } else {
      card.innerHTML = createObjectCardHTML(obj.data.objectId, type, content);
    }

    grid.appendChild(card);
  });
}

// Card HTML Templates
function createCoinCardHTML(objectId, type, balance, mist) {
  return `
        <button class="copy-button" onclick="copyToClipboard('${objectId}')">Copy ID</button>
        <div class="object-type">
            ${type}
            <div class="info-tooltip">
                <div class="tooltip-content">This is a SUI coin object. The balance is shown in both SUI and MIST units.</div>
            </div>
        </div>
        <div class="object-id">${objectId}</div>
        <div class="object-details">
            <div>Balance: <span class="object-value">${balance.toFixed(4)} SUI</span></div>
            <div class="object-explainer">(${mist.toLocaleString()} MIST)</div>
        </div>
        <button class="btn transfer-btn" onclick="showTransferModal('${objectId}', 'SUI', ${balance})">Transfer</button>
    `;
}

function createNFTCardHTML(data, display, content, type) {
  return `
        <button class="copy-button" onclick="copyToClipboard('${data.objectId}')">Copy ID</button>
        <div class="object-type">
            ${type}
            <div class="info-tooltip">
                <div class="tooltip-content">This is an NFT with unique properties and metadata stored on the Sui blockchain.</div>
            </div>
        </div>
        ${display.image_url || content.url ? `<img class="nft-image" src="${display.image_url || content.url}" alt="NFT" onerror="this.src='https://via.placeholder.com/200'">` : ''}
        <div class="object-id">${data.objectId}</div>
        <div class="object-details">
            <div class="nft-name">${display.name || content.name || 'Unnamed NFT'}</div>
            <div class="nft-description">${display.description || content.description || 'No description'}</div>
        </div>
        <button class="btn transfer-btn" onclick="showTransferModal('${data.objectId}', 'NFT')">Transfer</button>
    `;
}

function createObjectCardHTML(objectId, type, content) {
  return `
        <button class="copy-button" onclick="copyToClipboard('${objectId}')">Copy ID</button>
        <div class="object-type">
            ${type}
            <div class="info-tooltip">
                <div class="tooltip-content">This is a custom object on the Sui blockchain with its own unique properties.</div>
            </div>
        </div>
        <div class="object-id">${objectId}</div>
        <div class="object-details">
            <pre class="object-content">${JSON.stringify(content, null, 2)}</pre>
        </div>
        <button class="btn transfer-btn" onclick="showTransferModal('${objectId}', 'Object')">Transfer</button>
    `;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('search')?.addEventListener('input', filterObjects);
  document.getElementById('type-filter')?.addEventListener('change', filterObjects);
}); 