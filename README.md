# PakStyle — Custom Shopify Store

A fully custom enterprise-grade Shopify store built from scratch.
Built by Abeer Awan — Frontend & Shopify Developer

## Live Links
- 🌐 Headless Frontend: https://pakstyle-store-nine.vercel.app
- 🛍️ Shopify Theme: https://pakstyle-dev.myshopify.com/?preview_theme_id=152135794871
- 📦 GitHub: https://github.com/abeerdeveloper/pakstyle-shopify

## What Was Built
PakStyle is a complete end-to-end Shopify project with a native theme, a headless storefront, and a custom admin application. The project spans 13 phases, including theme design, custom storefront experience, backend tools, and deployment automation.

## Tech Stack
- Shopify Liquid, Online Store 2.0, Shopify CLI
- React.js, Next.js 14, Tailwind CSS
- Node.js, Express.js
- Shopify Admin API, Storefront API, GraphQL
- Vercel (headless deployment)
- Git, GitHub Actions (CI/CD)

## Project Structure
- `/theme` — Shopify theme source with Liquid templates, sections, snippets, assets, and storefront configuration.
- `/headless-store` — Next.js 14 App Router storefront connected to Shopify Storefront API.
- `/shopify-app` — Custom Node.js / Express Shopify app with admin KPI dashboard, bulk product tag editor, stock alerts, and discount generator.
- `/docs` — Documentation, setup instructions, feature reference, and deployment notes.

## Setup Instructions
### Theme
1. Install Shopify CLI.
2. Authenticate with Shopify and target `pakstyle-dev.myshopify.com`.
3. Use `shopify theme serve` for local theme preview.

### Headless Store
1. Copy `.env.example` to `.env.local` inside `/headless-store`.
2. Set `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=pakstyle-dev.myshopify.com`.
3. Set `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` with a valid storefront token.
4. Run `npm install` and `npm run dev`.

### Shopify App
1. Copy `.env.example` to `.env` inside `/shopify-app`.
2. Set `SHOP`, `SHOPIFY_ADMIN_ACCESS_TOKEN`, and optional API credentials.
3. Run `npm install` and `npm start`.

## Features Built
- Custom Shopify theme with sections, product pages, collection templates, cart drawer, and responsive design.
- Headless storefront with Next.js, product search, collection pages, and cart integration.
- Shopify app with dashboard metrics, bulk tag editing, low stock alerts, and discount code generation.
- Deployment automation with GitHub Actions and Vercel-ready configuration.

## Screenshots
_Add screenshots here after capture._

## Developer
Abeer Awan
- GitHub: github.com/abeerdeveloper
- Email: abeerawan555@gmail.com

