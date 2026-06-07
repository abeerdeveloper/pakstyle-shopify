export const getProducts = `query getProducts($first:Int!){
  products(first:$first){
    edges{ node{
      id
      title
      handle
      description
      descriptionHtml
      priceRange{ minVariantPrice{ amount currencyCode } }
      images(first:5){ edges{ node{ url altText } } }
      variants(first:10){ edges{ node{ id title availableForSale priceV2{ amount currencyCode } } } }
    } }
  }
}`;

export const getProductByHandle = `query getProductByHandle($handle:String!){
  productByHandle(handle:$handle){
    id
    title
    handle
    description
    descriptionHtml
    images(first:10){ edges{ node{ url altText } } }
    variants(first:20){ edges{ node{ id title sku availableForSale priceV2{ amount currencyCode } } } }
    priceRange{ minVariantPrice{ amount currencyCode } }
  }
}`;

export const getCollections = `query getCollections($first:Int!){
  collections(first:$first){ edges{ node{ id title handle description } } }
}`;

export const getCollectionByHandle = `query getCollectionByHandle($handle:String!,$first:Int!){
  collection(handle:$handle){
    id
    title
    handle
    description
    image{ url altText }
    products(first:$first){ edges{ node{ id title handle priceRange{ minVariantPrice{ amount currencyCode } } images(first:3){ edges{ node{ url altText } } } } } }
  }
}`;

export const searchProducts = `query searchProducts($query:String!,$first:Int!){
  products(query:$query,first:$first){ edges{ node{ id title handle description priceRange{ minVariantPrice{ amount currencyCode } } images(first:3){ edges{ node{ url altText } } } variants(first:5){ edges{ node{ id title priceV2{ amount currencyCode } } } } } } }
}`;

export const createCart = `mutation createCart($input:CartInput){
  cartCreate(input:$input){
    cart{ id } userErrors{ field message }
  }
}`;

export const addCartLines = `mutation addCartLines($cartId:ID!,$lines:[CartLineInput!]!){
  cartLinesAdd(cartId:$cartId,lines:$lines){
    cart{ id lines(first:100){ edges{ node{ id quantity merchandise{... on ProductVariant{ id title product{ title handle } } } } } cost{ subtotalAmount{ amount currencyCode } } checkoutUrl } userErrors{ field message }
  }
}`;

export const updateCartLines = `mutation updateCartLines($cartId:ID!,$lines:[CartLineUpdateInput!]!){
  cartLinesUpdate(cartId:$cartId,lines:$lines){
    cart{ id lines(first:100){ edges{ node{ id quantity merchandise{... on ProductVariant{ id title product{ title handle } } } } } cost{ subtotalAmount{ amount currencyCode } } checkoutUrl } userErrors{ field message }
  }
}`;

export const removeCartLines = `mutation removeCartLines($cartId:ID!,$lineIds:[ID!]!){
  cartLinesRemove(cartId:$cartId,lineIds:$lineIds){
    cart{ id lines(first:100){ edges{ node{ id quantity merchandise{... on ProductVariant{ id title product{ title handle } } } } } cost{ subtotalAmount{ amount currencyCode } } checkoutUrl } userErrors{ field message }
  }
}`;

export const getCart = `query getCart($id:ID!){
  cart(id:$id){
    id
    checkoutUrl
    lines(first:100){ edges{ node{ id quantity merchandise{... on ProductVariant{ id title product{ title handle } } } } }
    cost{ subtotalAmount{ amount currencyCode } }
  }
}`;
