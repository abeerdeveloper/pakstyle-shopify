export async function shopifyFetch({ query, variables }) {
  const res = await fetch(
    `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
      cache: 'no-store'
    }
  );
  return res.json();
}
