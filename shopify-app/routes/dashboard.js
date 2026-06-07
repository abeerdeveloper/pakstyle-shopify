const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

const SHOP = process.env.SHOP || 'pakstyle-dev.myshopify.com';
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

router.get('/', async (req, res) => {
  if (!ADMIN_TOKEN) return res.status(500).json({ error: 'Missing SHOPIFY_ADMIN_ACCESS_TOKEN in env' });

  const url = `https://${SHOP}/admin/api/2023-10/graphql.json`;
  const query = `query {
    shop {
      name
      myshopifyDomain
    }
    orders {
      totalCount
    }
    products {
      totalCount
    }
  }`;

  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ADMIN_TOKEN,
      },
      body: JSON.stringify({ query }),
    });
    const data = await resp.json();
    if (data.errors) return res.status(500).json({ error: data.errors });
    res.json({ kpis: data.data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
