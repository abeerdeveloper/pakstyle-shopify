import { config } from 'dotenv';

config({ path: '.env.local' });

const endpoint = `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/graphql.json`;
const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

if (!process.env.SHOPIFY_STORE_DOMAIN || !token) {
  console.error('Missing required environment variables. Please set SHOPIFY_STORE_DOMAIN and SHOPIFY_ADMIN_ACCESS_TOKEN.');
  process.exit(1);
}

const products = [
  {
    title: 'Classic Bomber Jacket',
    bodyHtml: 'Premium bomber jacket for the modern man. Bold style, all-day comfort.',
    price: '4500',
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
    tags: ['jackets', 'new-arrival'],
    status: 'ACTIVE',
  },
  {
    title: 'Essential Crew Tee',
    bodyHtml: 'Soft cotton crew neck t-shirt. A wardrobe essential.',
    price: '1200',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
    tags: ['t-shirts', 'essentials'],
    status: 'ACTIVE',
  },
  {
    title: 'Slim Fit Denim Jeans',
    bodyHtml: 'Slim fit denim jeans with a modern silhouette.',
    price: '3200',
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800',
    tags: ['jeans', 'denim'],
    status: 'ACTIVE',
  },
  {
    title: 'Urban Hoodie',
    bodyHtml: 'Cozy oversized hoodie for street style comfort.',
    price: '2800',
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
    tags: ['hoodies', 'streetwear'],
    status: 'ACTIVE',
  },
];

const variantSizes = ['S', 'M', 'L', 'XL'];

async function fetchGraphQL(query, variables = {}) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
  });

  const result = await response.json();
  if (!response.ok || result.errors?.length) {
    throw new Error(JSON.stringify(result.errors || result, null, 2));
  }
  return result.data;
}

const productCreateMutation = `mutation productCreate($input: ProductInput!) {
  productCreate(input: $input) {
    product { id title handle status }
    userErrors { field message }
  }
}`;

const productCreateMediaMutation = `mutation productCreateMedia($productId: ID!, $media: [CreateMediaInput!]!) {
  productCreateMedia(productId: $productId, media: $media) {
    media { id }
    userErrors { field message }
  }
}`;

function buildProductInput(product) {
  return {
    title: product.title,
    bodyHtml: product.bodyHtml,
    tags: product.tags,
    status: product.status,
    variants: variantSizes.map((size) => ({
      title: size,
      price: product.price,
      sku: `${product.title.toLowerCase().replace(/\s+/g, '-')}-${size.toLowerCase()}`,
      inventoryPolicy: 'CONTINUE',
      inventoryManagement: 'SHOPIFY',
      availableForSale: true,
    })),
  };
}

async function createProduct(product) {
  const input = buildProductInput(product);
  const data = await fetchGraphQL(productCreateMutation, { input });
  const result = data.productCreate;

  if (result.userErrors?.length) {
    throw new Error(`Failed to create product ${product.title}: ${JSON.stringify(result.userErrors)}`);
  }

  return result.product;
}

async function attachProductImage(productId, imageUrl) {
  const mediaInput = [{
    mediaContentType: 'IMAGE',
    image: { src: imageUrl },
  }];

  const data = await fetchGraphQL(productCreateMediaMutation, { productId, media: mediaInput });
  const result = data.productCreateMedia;

  if (result.userErrors?.length) {
    throw new Error(`Failed to attach media to product ${productId}: ${JSON.stringify(result.userErrors)}`);
  }

  return result.media[0];
}

(async () => {
  console.log('Creating Shopify sample products...');

  for (const product of products) {
    try {
      const createdProduct = await createProduct(product);
      console.log(`Created product: ${createdProduct.title} (${createdProduct.id})`);

      const media = await attachProductImage(createdProduct.id, product.imageUrl);
      console.log(`  Attached image media: ${media.id}`);
    } catch (error) {
      console.error('Error:', error.message || error);
      process.exitCode = 1;
    }
  }

  console.log('Done.');
})();
