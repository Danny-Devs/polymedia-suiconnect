// Transfer modal state
let currentTransferObject = null;

// Transfer Modal Functions
function showTransferModal(objectId, type, balance = null) {
  currentTransferObject = objectId;
  const modal = document.getElementById('transferModal');
  const backdrop = document.getElementById('modalBackdrop');
  const details = document.getElementById('transferDetails');

  details.innerHTML = `
        <p>Transferring: ${type}${balance ? ` (${balance} SUI)` : ''}</p>
        <div class="object-explainer">Object ID: ${objectId}</div>
    `;

  modal.classList.remove('hidden');
  backdrop.classList.remove('hidden');
  document.getElementById('recipientAddress').value = '';
}

function closeTransferModal() {
  document.getElementById('transferModal').classList.add('hidden');
  document.getElementById('modalBackdrop').classList.add('hidden');
  currentTransferObject = null;
}

async function confirmTransfer() {
  const recipientAddress = document.getElementById('recipientAddress').value;
  if (!recipientAddress) {
    alert('Please enter a recipient address');
    return;
  }

  try {
    await transferObject(currentTransferObject, recipientAddress);
    closeTransferModal();
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

async function transferObject(objectId) {
  const recipientAddress = document.getElementById('recipientAddress').value;
  if (!recipientAddress) return;

  try {
    const { Transaction, signAndExecuteTransaction } = suiconnect;
    const tx = new Transaction();
    tx.transferObjects([objectId], recipientAddress);

    const result = await signAndExecuteTransaction({
      transaction: tx,
      options: { showEffects: true }
    });

    alert(`Transfer successful!\nTransaction digest: ${result.digest}`);
    await loadWalletContents();
  } catch (error) {
    alert(`Error transferring object: ${error.message}`);
  }
} 