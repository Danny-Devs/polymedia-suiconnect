// Transfer modal state
let currentTransferObject = null;

// Transfer Modal Functions
export function showTransferModal(objectId, type, balance = null) {
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

export function closeTransferModal() {
  const modal = document.getElementById('transferModal');
  const backdrop = document.getElementById('modalBackdrop');
  modal.classList.add('hidden');
  backdrop.classList.add('hidden');
  currentTransferObject = null;
}

export async function confirmTransfer() {
  const recipientAddress = document.getElementById('recipientAddress').value;
  if (!recipientAddress) {
    alert('Please enter a recipient address');
    return;
  }

  try {
    await transferObject(currentTransferObject, recipientAddress);
    closeTransferModal();
  } catch (error) {
    alert(`Error transferring object: ${error.message}`);
  }
}

export async function transferObject(objectId, recipientAddress) {
  if (!window.suiconnect?.address) {
    throw new Error('Please connect your wallet first');
  }

  const { Transaction, signAndExecuteTransaction } = window.suiconnect;
  const tx = new Transaction();
  tx.transferObjects([objectId], recipientAddress);

  const result = await signAndExecuteTransaction({
    transaction: tx,
    options: { showEffects: true }
  });

  console.log('Transfer successful:', result);
  return result;
} 