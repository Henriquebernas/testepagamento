const express = require('express');
const dotenv = require('dotenv');
const path = require('path'); // Added for path.join
const mercadopago = require('mercadopago');

// Load environment variables
dotenv.config();

// TODO: Replace with your actual Mercado Pago Access Token from .env
mercadopago.configure({
    access_token: process.env.MP_ACCESS_TOKEN || 'TEST-your-access-token' // Keep a placeholder for now
});

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public'
app.use(express.json()); // Parse JSON bodies

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to provide public key to frontend
app.get('/config', (req, res) => {
    res.json({ publicKey: process.env.MP_PUBLIC_KEY });
});

// Placeholder for Mercado Pago routes (to be added in the next subtask)
app.post('/create_preference', async (req, res) => {
    const preference = {
        items: [
            {
                title: 'Produto Exemplo',
                unit_price: 10.50,
                quantity: 1,
                currency_id: 'BRL'
            }
        ],
        back_urls: {
            success: `${process.env.APP_URL || 'http://localhost:3000'}/payment/success`,
            failure: `${process.env.APP_URL || 'http://localhost:3000'}/payment/failure`,
            pending: `${process.env.APP_URL || 'http://localhost:3000'}/payment/pending`
        },
        auto_return: 'approved'
    };

    try {
        const response = await mercadopago.preferences.create(preference);
        res.json({ preferenceId: response.body.id });
    } catch (error)
        console.error('Error creating preference:', error.cause || error.message || error);
        // It's good to check error.cause for more detailed messages from mercadopago SDK v2
        let errorMessage = 'Failed to create preference';
        if (error.cause && error.cause.message) {
            errorMessage = error.cause.message;
        } else if (error.message) {
            errorMessage = error.message;
        }
        // Check if the error response from MercadoPago has more details
        if (error.response && error.response.data && error.response.data.message) {
             errorMessage = error.response.data.message;
        }
        res.status(500).json({ error: errorMessage, details: error.cause || error });
    }
});

// Routes for payment status callbacks
app.get('/payment/success', (req, res) => {
    console.log('Payment success query params:', req.query);
    // Potentially save payment info from req.query to database here
    res.redirect('/success.html');
});

app.get('/payment/failure', (req, res) => {
    console.log('Payment failure query params:', req.query);
    // Log failure details, potentially guide user
    res.redirect('/failure.html');
});

app.get('/payment/pending', (req, res) => {
    console.log('Payment pending query params:', req.query);
    // User might be returned here if payment is e.g. by bank slip and awaiting confirmation
    res.redirect('/index.html?status=pending');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
