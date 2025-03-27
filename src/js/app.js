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

// Utility Functions
function formatSuiAmount(amount) {
  return (amount / 1e9).toFixed(4);
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert('Copied to clipboard!');
  }).catch(err => {
    console.error('Failed to copy:', err);
  });
}

// Export modules
export {
  formatSuiAmount,
  copyToClipboard,
  loadWalletContents
}; 