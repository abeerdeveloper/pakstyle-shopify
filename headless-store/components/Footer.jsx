export default function Footer(){
  return (
    <footer style={{background:'#0F172A',color:'#fff',padding:'28px 0',marginTop:48}}>
      <div className="container" style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
        <div>
          <div style={{fontWeight:700,fontSize:18}}>PakStyle</div>
          <div className="mt-2">Dress Bold. Live Bold.</div>
        </div>
        <div>
          <div><strong>Quick Links</strong></div>
          <div className="mt-2">Home · Products · Collections · Sale</div>
        </div>
        <div>
          <div><strong>Follow</strong></div>
          <div className="mt-2">Instagram · Facebook</div>
        </div>
      </div>
      <div className="container" style={{borderTop:'1px solid rgba(255,255,255,0.05)',marginTop:18,paddingTop:12}}>
        © {new Date().getFullYear()} PakStyle
      </div>
    </footer>
  );
}
