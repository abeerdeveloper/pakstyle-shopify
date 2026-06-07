'use client';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

export default function CartDrawer(){
  const { cart, itemCount } = useContext(CartContext);

  return (
    <aside style={{position:'fixed',right:12,top:80,background:'#fff',border:'1px solid #eee',padding:12,width:320,borderRadius:8}}>
      <div style={{fontWeight:700}}>Cart ({itemCount || 0})</div>
      <div style={{marginTop:8}}>
        {cart?.lines?.length ? cart.lines.map(l=> (
          <div key={l.id} style={{padding:8,borderBottom:'1px solid #f3f3f3'}}>
            <div>{l.merchandise?.product?.title}</div>
            <div className="text-sm">Qty: {l.quantity}</div>
          </div>
        )) : <div className="text-sm">No items</div>}
      </div>
    </aside>
  );
}
