let mp; // Declare mp outside to be accessible globally within this script

document.addEventListener('DOMContentLoaded', async () => {
    const payButton = document.getElementById('pay-button');

    if (!payButton) {
        console.error('Pay button not found.');
        // Optionally display an error to the user if the button is critical
        return;
    }

    try {
        const response = await fetch('/config');
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch config: ${response.status} ${errorText}`);
        }
        const config = await response.json();
        if (!config.publicKey) {
            throw new Error('Public key not found in config response');
        }
        mp = new MercadoPago(config.publicKey, { locale: 'pt-BR' });
    } catch (error) {
        console.error('Error fetching/setting public key:', error);
        payButton.textContent = 'Erro ao carregar. Tente mais tarde.';
        payButton.disabled = true;
        // Display a more user-friendly message on the page itself if possible
        const errorDisplay = document.createElement('p');
        errorDisplay.textContent = 'Falha ao carregar a configuração de pagamento. Por favor, atualize a página ou tente mais tarde.';
        errorDisplay.style.color = 'red';
        payButton.parentNode.insertBefore(errorDisplay, payButton.nextSibling);
        return; // Stop further execution if MP can't be initialized
    }

    payButton.addEventListener('click', async () => {
        if (!mp) {
            console.error('MercadoPago SDK not initialized.');
            alert('Erro de configuração. Não é possível processar o pagamento. Tente recarregar a página.');
            payButton.disabled = true; // Disable button if mp is not initialized
            return;
        }

        payButton.disabled = true; // Disable button on click to prevent multiple submissions
        payButton.textContent = 'Processando...';

        try {
            const orderResponse = await fetch('/create_preference', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Item details are defined on the backend in this example
            });

            if (!orderResponse.ok) {
                const errorData = await orderResponse.json();
                throw new Error(errorData.message || `Error creating preference: ${orderResponse.statusText}`);
            }

            const preference = await orderResponse.json();

            if (!preference.preferenceId) { // Corrected to check preference.preferenceId
                throw new Error('Preference ID not received from backend.');
            }

            mp.checkout({
                preference: { id: preference.preferenceId }, // Corrected to use preference.preferenceId
                autoOpen: true,
            });
        } catch (error) {
            console.error('Error in payment process:', error);
            alert(`Erro ao iniciar o pagamento: ${error.message}. Tente novamente.`);
            payButton.disabled = false; // Re-enable button on error
            payButton.textContent = 'Pagar';
        }
    });
});
