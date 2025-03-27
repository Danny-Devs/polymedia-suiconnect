// Header component management
const loadHeader = async () => {
  const headerHTML = `
    <header>
      <a href="/" class="logo">Sui Universe</a>
      <nav>
        <a href="/pages/assets.html" class="nav-link">Assets</a>
        <a href="/pages/create.html" class="nav-link">Create</a>
        <a href="/pages/kiosk.html" class="nav-link">Marketplace</a>
      </nav>
      <div class="header-actions">
        <button id="connect-wallet" class="button gradient-button">Connect Wallet</button>
        <div id="wallet-info" class="hidden">
          <span id="wallet-address"></span>
          <button id="disconnect-wallet" class="button">Disconnect</button>
        </div>
        <button id="theme-toggle" class="theme-toggle" aria-label="Toggle theme">
          <svg class="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <svg class="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>
      </div>
    </header>
  `;

  // Create a container for the header
  const headerContainer = document.createElement('div');
  headerContainer.id = 'header-container';
  headerContainer.innerHTML = headerHTML;

  // Insert at the beginning of the body
  document.body.insertBefore(headerContainer, document.body.firstChild);

  // Setup theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');

  // Apply initial theme
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  }

  // Theme toggle handler
  themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
};

// Export the function
window.loadHeader = loadHeader; 