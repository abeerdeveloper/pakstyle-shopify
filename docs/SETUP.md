# PakStyle Setup Guide

## Prerequisites
- Node.js 18+ installed
- npm available
- Shopify CLI installed and logged in
- Git installed
- A Shopify partner account or store admin access to `pakstyle-dev.myshopify.com`

## Clone the Repository
```bash
git clone https://github.com/abeerdeveloper/pakstyle-shopify.git
cd pakstyle-shopify
```

## Theme Setup
1. Change into the theme folder:
   ```bash
   cd theme
   ```
2. Authenticate with Shopify CLI and point to the development store.
3. Preview locally:
   ```bash
   shopify theme serve
   ```
4. Deploy changes to the store via theme push when ready.

## Headless Store Setup
1. Change into the headless storefront folder:
   ```bash
   cd ../headless-store
   ```
2. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
3. Open `.env.local` and update the following values:
   - `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=pakstyle-dev.myshopify.com`
   - `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_token_here`
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```
6. Open `http://localhost:3000` in your browser.

## Shopify App Setup
1. Change into the app folder:
   ```bash
   cd ../shopify-app
   ```
2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
3. Update `.env` with the correct store and Admin API token.
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start the app server:
   ```bash
   npm start
   ```

## Shopify API Credentials
- Headless storefront requires a Shopify Storefront API access token.
- Custom app requires a Shopify Admin API access token.
- Create private apps or custom app credentials in Shopify admin under Apps > Develop apps.
- Store credential values in `.env` files only; do not commit secrets.
