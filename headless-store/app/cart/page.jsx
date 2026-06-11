'use client';

import { useContext } from 'react';
import { CartContext } from '../../context/CartContext';

export default function CartPage(){
  const { cart, updateQuantity, removeItem, clearCart } = useContext(CartContext);

  if (!cart) return <div className="container">Your cart is empty</div>;

  return (
    <div className="container">
      <h1 className="text-3xl font-semibold">Cart</h1>
      <div className="mt-6">
        {cart.lines?.length ? (
          <div>
            {cart.lines.map(line => (
              <div key={line.id} className="card mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{line.merchandise?.product?.title}</div>
                    <div className="text-sm text-gray-600">{line.merchandise?.title}</div>
                  </div>
                  <div>
                    <button onClick={()=>updateQuantity(line.id, line.quantity-1)}>-</button>
                    <span className="mx-2">{line.quantity}</span>
                    <button onClick={()=>updateQuantity(line.id, line.quantity+1)}>+</button>
                    <button onClick={()=>removeItem(line.id)} className="ml-4 text-red-600">Remove</button>
                  </div>
                </div>
              </div>
            ))}
            <div className="mt-4">
              <div className="font-semibold">Subtotal: {cart.cost?.subtotalAmount?.amount} {cart.cost?.subtotalAmount?.currencyCode}</div>
              <div className="mt-4">
                <a href={cart.checkoutUrl || '#'} className="btn-accent">Checkout</a>
              </div>
            </div>
          </div>
        ) : (
          <div>Your cart is empty</div>
        )}
      </div>
    </div>
  );
}
