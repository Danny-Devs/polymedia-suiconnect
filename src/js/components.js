// Header component management
const loadHeader = async () => {
  const headerHTML = `
    <header>
      <a href="/" class="logo">Sui Universe</a>
      <nav>
        <a href="/" class="nav-link">Home</a>
        <a href="/pages/assets.html" class="nav-link">Assets</a>
        <a href="/pages/create.html" class="nav-link">Create</a>
        <a href="/pages/kiosk.html" class="nav-link">Marketplace</a>
      </nav>
      <div class="wallet-section">
        <button id="connect-wallet" class="button">Connect Wallet</button>
        <div id="wallet-info" class="hidden">
          <span id="wallet-address"></span>
          <button id="disconnect-wallet" class="button">Disconnect</button>
        </div>
      </div>
    </header>
  `;

  // Create a container for the header
  const headerContainer = document.createElement('div');
  headerContainer.id = 'header-container';
  headerContainer.innerHTML = headerHTML;

  // Insert at the beginning of the body
  document.body.insertBefore(headerContainer, document.body.firstChild);
};

// Export the function
window.loadHeader = loadHeader; 