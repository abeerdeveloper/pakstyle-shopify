const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

const SHOP = process.env.SHOP || 'pakstyle-dev.myshopify.com';
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

function generateRandomCode(prefix = 'PAK', length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let s = '';
  for (let i = 0; i < length; i++) s += chars.charAt(Math.floor(Math.random() * chars.length));
  return `${prefix}-${s}`;
}

// Generates a discount code. Attempts REST API creation if token present, otherwise returns a generated code.
router.post('/generate', async (req, res) => {
  const { prefix = 'PAK', value = '10.0', type = 'fixed_amount', applies_to = 'order', starts_at, ends_at } = req.body || {};
  if (!ADMIN_TOKEN) {
    return res.json({ code: generateRandomCode(prefix), note: 'No ADMIN token, returning local code only' });
  }

  try {
    // Create a price rule (REST)
    const priceRuleBody = {
      price_rule: {
        title: `Generated-${Date.now()}`,
        target_type: type === 'percentage' ? 'percentage' : 'line_item',
        value_type: type === 'percentage' ? 'percentage' : 'fixed_amount',
        value: type === 'percentage' ? `-${value}` : `-${value}`,
        allocation_method: 'across',
        once_per_customer: false,
        usage_limit: null,
        starts_at: starts_at || new Date().toISOString(),
      }
    };
    const prResp = await fetch(`https://${SHOP}/admin/api/2023-10/price_rules.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': ADMIN_TOKEN },
      body: JSON.stringify(priceRuleBody),
    });
    const prData = await prResp.json();
    if (prData.errors) return res.status(500).json({ error: prData.errors });
    const priceRuleId = prData.price_rule && prData.price_rule.id;
    if (!priceRuleId) return res.status(500).json({ error: 'Failed to create price rule' });

    const code = generateRandomCode(prefix, 8);
    const dcBody = { discount_code: { code } };
    const dcResp = await fetch(`https://${SHOP}/admin/api/2023-10/price_rules/${priceRuleId}/discount_codes.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': ADMIN_TOKEN },
      body: JSON.stringify(dcBody),
    });
    const dcData = await dcResp.json();
    if (dcData.errors) return res.status(500).json({ error: dcData.errors });
    res.json({ priceRule: prData.price_rule, discountCode: dcData.discount_code });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
