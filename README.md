# Mercado Pago Integration Example

## Description

This project demonstrates a simple web application with a payment button integrated with Mercado Pago. It includes a Node.js/Express backend to create payment preferences and handle callbacks, and a plain HTML/CSS/JavaScript frontend.

## Features

*   Frontend built with HTML, CSS, and vanilla JavaScript.
*   Backend powered by Node.js and Express.
*   Integration with Mercado Pago for payment processing.
*   Redirects to specific success or failure pages based on payment outcome.
*   Secure handling of API keys using environment variables.

## Prerequisites

*   [Node.js](https://nodejs.org/) (which includes npm) installed on your system.
*   A [Mercado Pago](https://www.mercadopago.com) account with access to your **test** credentials (Public Key and Access Token).

## Setup and Configuration

1.  **Clone the Repository / Download Files:**
    If this is a Git repository, clone it:
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```
    If you downloaded the files, navigate to the project directory.

2.  **Install Dependencies:**
    Open your terminal in the project directory and run:
    ```bash
    npm install
    ```

3.  **Create Environment File:**
    Copy the example environment file to a new `.env` file:
    ```bash
    cp .env.example .env
    ```

4.  **Configure Environment Variables:**
    Edit the `.env` file with your Mercado Pago **test** credentials and application settings:

    ```env
    MP_ACCESS_TOKEN=YOUR_MERCADOPAGO_TEST_ACCESS_TOKEN
    MP_PUBLIC_KEY=YOUR_MERCADOPAGO_TEST_PUBLIC_KEY
    APP_URL=http://localhost:3000
    PORT=3000
    ```
    *   `MP_ACCESS_TOKEN`: Your Mercado Pago **test** Access Token. Found in your Mercado Pago developer dashboard under "Credentials".
    *   `MP_PUBLIC_KEY`: Your Mercado Pago **test** Public Key. Also found in your developer dashboard.
    *   `APP_URL`: The base URL where your application will be accessible (e.g., `http://localhost:3000` for local testing). This is critical for constructing the `back_urls` for Mercado Pago.
    *   `PORT`: The port on which the server will listen (defaults to 3000 if not specified in `server.js` or `.env`).

    **Important Security Note:** The `.env` file contains sensitive credentials. **Never commit this file to version control.** The provided `.gitignore` file already includes `.env` to prevent accidental uploads.

## Running the Application

1.  **Start the Server:**
    In your terminal, from the project root directory, run:
    ```bash
    node server.js
    ```
    You should see a message like `Server running on port 3000`.

2.  **Access in Browser:**
    Open your web browser and navigate to the `APP_URL` you configured (e.g., `http://localhost:3000`).

## How it Works

1.  The user visits the main page (`index.html`) and clicks the "Pagar" (Pay) button.
2.  The frontend JavaScript (`public/script.js`) makes a request to the `/config` endpoint on the backend to fetch the Mercado Pago Public Key.
3.  The Mercado Pago SDK is initialized in the frontend using this Public Key.
4.  Upon clicking "Pagar", the frontend script sends a POST request to the `/create_preference` endpoint on the backend.
5.  The backend (`server.js`), using the Mercado Pago SDK (configured with your Access Token), creates a payment preference. This preference includes:
    *   Details of the item(s) for sale (e.g., title, price, quantity).
    *   `back_urls`: URLs to which Mercado Pago will redirect the user after the payment attempt (`/payment/success`, `/payment/failure`, `/payment/pending`).
    *   `auto_return: 'approved'` ensures automatic redirection for approved payments.
6.  The backend responds to the frontend with the `preferenceId`.
7.  The frontend uses this `preferenceId` to initialize the Mercado Pago checkout, which redirects the user to the Mercado Pago payment page.
8.  The user completes (or cancels) the payment on the Mercado Pago platform.
9.  Mercado Pago redirects the user to one of the `back_urls` defined in the preference:
    *   `/payment/success`: If the payment is approved.
    *   `/payment/failure`: If the payment is rejected or fails.
    *   `/payment/pending`: If the payment is pending confirmation (e.g., for some offline payment methods).
10. The backend routes for `/payment/*` handle these redirects:
    *   They log any query parameters sent by Mercado Pago (useful for debugging and order processing).
    *   They redirect the user to the appropriate static HTML page (`success.html`, `failure.html`, or `index.html?status=pending`).

## Project Structure

```
.
├── .env.example        # Example environment variables
├── .gitignore          # Specifies intentionally untracked files
├── README.md           # This file
├── failure.html        # Page shown for failed payments
├── index.html          # Main page with the payment button
├── package-lock.json   # Records exact versions of dependencies
├── package.json        # Project metadata and dependencies
├── public/
│   ├── script.js       # Frontend JavaScript for Mercado Pago interaction
│   └── style.css       # Basic CSS for styling
├── server.js           # Node.js Express backend server logic
└── success.html        # Page shown for successful payments
```

This provides a clear and comprehensive guide for users to set up and run the application.
