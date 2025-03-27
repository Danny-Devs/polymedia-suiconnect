async function createKiosk() {
  if (!suiconnect?.address) {
    alert('Please connect your wallet first');
    return;
  }

  try {
    const { Transaction, signAndExecuteTransaction } = suiconnect;
    const tx = new Transaction();

    // Create kiosk transaction
    tx.moveCall({
      target: '0x2::kiosk::new',
      arguments: []
    });

    const result = await signAndExecuteTransaction({
      transaction: tx,
      options: { showEffects: true }
    });

    alert(`Kiosk created successfully!\nTransaction digest: ${result.digest}`);
    // TODO: Refresh kiosk contents
  } catch (error) {
    alert(`Error creating kiosk: ${error.message}`);
  }
} 