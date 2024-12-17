import React, { useState } from 'react'

export default function TourComponent() {
  const [onTour, setOnTour] = useState()
  return (
    <div style={{position: 'fixed', width: '100%', maxWidth: '300px', background: '#FFFFFF', border: '1px solid #E4E4E7', zIndex: '100', marginTop: '300px', padding: '20px 10px', borderRadius: '12px', gap: '20px', boxShadow:'0px 0px 10px 0px #00000045', left: '600px'}}>
      <div>
        <h5>Let’s explore ChainGlance!</h5>
        <span>Hi there! Right now, this is demo info. Connect your wallet to load your actual data.</span>
      </div>
      <footer style={{display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between'}}>
        <span>1/4</span>
        <button style={{backgroundColor: '#fff', border: '1px solid #EBEEF3', padding: '5px 10px', borderRadius: '8px', boxShadow:'0px 0px 4px 0px #00000045'}}>Next</button>
      </footer>
    </div>
  )
}
