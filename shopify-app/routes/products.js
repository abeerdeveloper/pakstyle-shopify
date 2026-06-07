const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

const SHOP = process.env.SHOP || 'pakstyle-dev.myshopify.com';
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

// Bulk tag editor: accepts { productIds: [id], tag: 'TagName' }
router.post('/bulk-tag', async (req, res) => {
  if (!ADMIN_TOKEN) return res.status(500).json({ error: 'Missing SHOPIFY_ADMIN_ACCESS_TOKEN in env' });
  const { productIds, tag } = req.body;
  if (!Array.isArray(productIds) || !tag) return res.status(400).json({ error: 'productIds (array) and tag are required' });

  try {
    const results = [];
    for (const id of productIds) {
      // fetch existing product
      const getUrl = `https://${SHOP}/admin/api/2023-10/products/${id}.json`;
      const getRes = await fetch(getUrl, { headers: { 'X-Shopify-Access-Token': ADMIN_TOKEN } });
      const getData = await getRes.json();
      const product = getData.product;
      if (!product) {
        results.push({ id, ok: false, error: 'not found' });
        continue;
      }
      const existingTags = product.tags ? product.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
      if (!existingTags.includes(tag)) existingTags.push(tag);
      const updateBody = { product: { id: product.id, tags: existingTags.join(', ') } };
      const putUrl = `https://${SHOP}/admin/api/2023-10/products/${id}.json`;
      const putRes = await fetch(putUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': ADMIN_TOKEN,
        },
        body: JSON.stringify(updateBody),
      });
      const putData = await putRes.json();
      results.push({ id, ok: !putData.errors, result: putData });
    }
    res.json({ results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Low-stock alerts: returns products where any variant inventoryQuantity <= threshold
router.get('/low-stock', async (req, res) => {
  if (!ADMIN_TOKEN) return res.status(500).json({ error: 'Missing SHOPIFY_ADMIN_ACCESS_TOKEN in env' });
  const threshold = Number(req.query.threshold || 5);
  const url = `https://${SHOP}/admin/api/2023-10/graphql.json`;
  const query = `query($first:Int!) {
    products(first:$first) {
      edges {
        node {
          id
          title
          variants(first:10) {
            edges { node { id inventoryQuantity } }
          }
        }
      }
    }
  }`;

  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ADMIN_TOKEN,
      },
      body: JSON.stringify({ query, variables: { first: 50 } }),
    });
    const data = await resp.json();
    if (data.errors) return res.status(500).json({ error: data.errors });
    const low = [];
    const edges = data.data.products.edges || [];
    for (const edge of edges) {
      const node = edge.node;
      const variants = node.variants.edges.map(v => v.node);
      const lowVariants = variants.filter(v => typeof v.inventoryQuantity === 'number' && v.inventoryQuantity <= threshold);
      if (lowVariants.length) low.push({ id: node.id, title: node.title, lowVariants });
    }
    res.json({ lowStock: low });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
