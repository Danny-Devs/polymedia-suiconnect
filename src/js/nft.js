// NFT creation state
let imageBase64 = null;

// Initialize NFT page
export function initNFTPage() {
  setupDropZone();
  setupPropertyHandlers();
}

// File handling
function setupDropZone() {
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');

  // Drag and drop handlers
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  });

  // Click to upload
  dropZone.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  });
}

function handleFile(file) {
  if (!file.type.startsWith('image/')) {
    alert('Please upload an image file');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    imageBase64 = e.target.result;
    updatePreview();
  };
  reader.readAsDataURL(file);
}

function updatePreview() {
  const preview = document.getElementById('imagePreview');
  const controls = document.getElementById('imageControls');

  if (imageBase64) {
    preview.innerHTML = `<img src="${imageBase64}" alt="NFT Preview">`;
    controls.classList.remove('hidden');
  } else {
    preview.innerHTML = '';
    controls.classList.add('hidden');
  }
}

export function removeImage() {
  imageBase64 = null;
  updatePreview();
  document.getElementById('fileInput').value = '';
}

// Property handling
function setupPropertyHandlers() {
  document.getElementById('addProperty').addEventListener('click', addPropertyRow);
}

function addPropertyRow() {
  const container = document.getElementById('properties');
  const row = document.createElement('div');
  row.className = 'property-row';
  row.innerHTML = `
    <input type="text" placeholder="Property name" class="property-key">
    <input type="text" placeholder="Property value" class="property-value">
    <button type="button" class="remove-property" onclick="this.parentElement.remove()">Remove</button>
  `;
  container.appendChild(row);
}

// NFT Creation
export async function createNFT(event) {
  event.preventDefault();

  if (!window.suiconnect?.address) {
    alert('Please connect your wallet first');
    return;
  }

  const name = document.getElementById('nftForm').nftName.value;
  const description = document.getElementById('nftForm').nftDescription.value;

  try {
    const { Transaction, signAndExecuteTransaction } = window.suiconnect;
    const tx = new Transaction();

    // Prepare NFT fields
    const fields = [
      { key: 'name', value: name },
      { key: 'description', value: description }
    ];

    // Add image if one was uploaded
    if (imageBase64) {
      fields.push({ key: 'image_url', value: imageBase64 });
    }

    // Add custom properties
    document.querySelectorAll('.property-row').forEach(row => {
      const inputs = row.querySelectorAll('input');
      if (inputs[0].value && inputs[1].value) {
        fields.push({
          key: inputs[0].value,
          value: inputs[1].value
        });
      }
    });

    // Move call to create an NFT
    tx.moveCall({
      target: '0x2::display::create_with_fields',
      arguments: [
        tx.pure(name),
        tx.pure(description),
        tx.pure(imageBase64 || ''),
        tx.pure(fields)
      ]
    });

    // Execute the transaction
    const result = await signAndExecuteTransaction({
      transaction: tx,
      options: { showEffects: true }
    });

    alert(`NFT created successfully!\nTransaction digest: ${result.digest}`);

    // Reset form
    document.getElementById('nftForm').reset();
    removeImage();
    document.getElementById('properties').innerHTML = '';
  } catch (error) {
    alert(`Error creating NFT: ${error.message}`);
  }
} 