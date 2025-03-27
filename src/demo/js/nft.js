// NFT creation state
let imageBase64 = null;

// File handling functions
function initNFTHandlers() {
  const uploadZone = document.getElementById('uploadZone');
  const fileInput = document.getElementById('fileInput');
  const imagePreview = document.getElementById('imagePreview');
  const imageControls = document.querySelector('.image-controls');

  if (!uploadZone) return;

  // Drag and drop handlers
  uploadZone.addEventListener('dragover', e => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
  });

  uploadZone.addEventListener('dragleave', e => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
  });

  uploadZone.addEventListener('drop', e => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFile(file);
    }
  });

  fileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) {
      handleFile(file);
    }
  });
}

function handleFile(file) {
  const imagePreview = document.getElementById('imagePreview');
  const uploadZone = document.getElementById('uploadZone');
  const imageControls = document.querySelector('.image-controls');

  const reader = new FileReader();
  reader.onload = e => {
    imageBase64 = e.target.result;
    imagePreview.src = imageBase64;
    imagePreview.style.display = 'block';
    uploadZone.classList.add('has-image');
    imageControls.style.display = 'flex';
  };
  reader.readAsDataURL(file);
}

function removeImage() {
  const imagePreview = document.getElementById('imagePreview');
  const uploadZone = document.getElementById('uploadZone');
  const imageControls = document.querySelector('.image-controls');
  const fileInput = document.getElementById('fileInput');

  imageBase64 = null;
  imagePreview.src = '';
  imagePreview.style.display = 'none';
  uploadZone.classList.remove('has-image');
  imageControls.style.display = 'none';
  fileInput.value = '';
}

async function createNFT(event) {
  event.preventDefault();

  if (!suiconnect?.address) {
    alert('Please connect your wallet first');
    return;
  }

  const name = document.getElementById('nftForm').nftName.value;
  const description = document.getElementById('nftForm').nftDescription.value;

  try {
    const { Transaction, signAndExecuteTransaction } = suiconnect;
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

    // Refresh wallet contents
    await loadWalletContents();
  } catch (error) {
    alert(`Error creating NFT: ${error.message}`);
  }
}

// Initialize NFT handlers when the page loads
document.addEventListener('DOMContentLoaded', initNFTHandlers); 