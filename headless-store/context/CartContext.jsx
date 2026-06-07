'use client';
import React, { createContext, useEffect, useState } from 'react';
import { shopifyFetch } from '../lib/shopify';
import { createCart, addCartLines, getCart, updateCartLines, removeCartLines } from '../lib/queries';

export const CartContext = createContext({});

export function CartProvider({ children }){
  const [cartId, setCartId] = useState(null);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    const id = typeof window !== 'undefined' ? window.localStorage.getItem('pak_cart_id') : null;
    if (id) setCartId(id);
  },[]);

  useEffect(()=>{
    if (!cartId) return;
    async function load(){
      setLoading(true);
      const res = await shopifyFetch({ query: getCart, variables: { id: cartId } });
      setCart(res?.data?.cart || null);
      setLoading(false);
    }
    load();
  },[cartId]);

  async function createLocalCart(){
    const res = await shopifyFetch({ query: createCart, variables: { input: {} } });
    const id = res?.data?.cartCreate?.cart?.id;
    if (id){
      setCartId(id);
      if (typeof window !== 'undefined') window.localStorage.setItem('pak_cart_id', id);
      return id;
    }
    return null;
  }

  async function ensureCart(){
    if (!cartId) return await createLocalCart();
    return cartId;
  }

  async function addItem(variantId, quantity=1){
    setLoading(true);
    const id = await ensureCart();
    const variables = { cartId: id, lines: [{ merchandiseId: variantId, quantity }] };
    const res = await shopifyFetch({ query: addCartLines, variables });
    const newCart = res?.data?.cartLinesAdd?.cart;
    setCart(newCart);
    setLoading(false);
    return newCart;
  }

  async function updateQuantity(lineId, quantity){
    setLoading(true);
    const variables = { cartId, lines: [{ id: lineId, quantity }] };
    const res = await shopifyFetch({ query: updateCartLines, variables });
    const newCart = res?.data?.cartLinesUpdate?.cart;
    setCart(newCart);
    setLoading(false);
    return newCart;
  }

  async function removeItem(lineId){
    setLoading(true);
    const variables = { cartId, lineIds: [lineId] };
    const res = await shopifyFetch({ query: removeCartLines, variables });
    const newCart = res?.data?.cartLinesRemove?.cart;
    setCart(newCart);
    setLoading(false);
    return newCart;
  }

  async function clearCart(){
    // remove all lines
    if (!cart?.lines?.length) return;
    const lineIds = cart.lines.map(l=>l.id);
    await removeItem(lineIds);
    setCart(null);
    if (typeof window !== 'undefined') window.localStorage.removeItem('pak_cart_id');
    setCartId(null);
  }

  const itemCount = cart?.lines?.reduce((s,l)=>s + (l.quantity || 0), 0) || 0;

  return (
    <CartContext.Provider value={{ cartId, cart, addItem, updateQuantity, removeItem, clearCart, itemCount, loading }}>
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;
