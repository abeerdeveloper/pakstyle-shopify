import { shopifyFetch } from '../../../lib/shopify';
import { getProductByHandle, getProducts } from '../../../lib/queries';
import { getPakstyleProductByHandle, getPakstyleProducts } from '../../../lib/pakstyle-products';
import ProductGrid from '../../../components/ProductGrid';

export default async function ProductPage({ params }){
  const handle = params.handle;
  
  // Try PakStyle local catalog first, then fall back to Shopify
  let product = getPakstyleProductByHandle(handle);
  
  if (!product) {
    const res = await shopifyFetch({ query: getProductByHandle, variables: { handle } });
    product = res?.data?.productByHandle || null;
  }

  // Related products from PakStyle catalog
  const relatedProducts = getPakstyleProducts(4);

  if (!product) return <div className="container">Product not found</div>;

  return (
    <div className="container">
      <div className="grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'24px'}}>
        <div>
          {product.localImage ? (
            <img src={product.localImage} alt={product.title} style={{width:'100%',borderRadius:16,marginBottom:8}} />
          ) : (
            product.images.edges.map((img, i)=> (
              <img key={i} src={img.node.url} alt={img.node.altText||product.title} style={{width:'100%',marginBottom:8}} />
            ))
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <p className="text-xl mt-2">{product.priceRange?.minVariantPrice?.amount} {product.priceRange?.minVariantPrice?.currencyCode}</p>
          <div className="mt-4" dangerouslySetInnerHTML={{__html:product.descriptionHtml}} />
          <div className="mt-6">
            <button className="btn-accent">Add to cart</button>
          </div>
        </div>
      </div>

      <section className="mt-12">
        <h3 className="text-xl font-semibold mb-4">Related Products</h3>
        <ProductGrid products={relatedProducts} />
      </section>
    </div>
  );
}
