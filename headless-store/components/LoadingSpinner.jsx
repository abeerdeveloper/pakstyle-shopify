'use client';
export default function LoadingSpinner(){
  return (
    <div style={{display:'flex',justifyContent:'center',padding:24}}>
      <div style={{width:36,height:36,border:'4px solid #eee',borderTop:'4px solid #0F172A',borderRadius:'50%'}} />
    </div>
  );
}
