'use client'

import React from 'react'
import Link from 'next/link'
import "./Last.css"
function Last(props) {
  return (

  
<>
<div className="footer">
  <div className="list">
    <h2>ZAIKAVERSE</h2><br />
    <p> <Link href="/about" style={{color:"white"}}>
      About us
      </Link></p><br />
    <p>
<Link href="/Join" style={{color:"white"}}>
Work With Us
</Link></p><br />
    <p> <Link href="/about" style={{color:"white"}}>

Contact Us
  </Link></p><br />
    <p><Link href="/about" style={{color:"white"}}>

Contact Us
  </Link></p><br />
    <p><Link href="#" style={{color:"white"}}>
Investor, Relations
  </Link></p><br/>
  </div>

  <div className="list">
    <h2>FOR RESTAURANTS</h2><br />
    <p><Link href="/Elogin" onClick={props.logged} style={{color:"white"}}>
Login here
</Link></p><br />
    <p> <Link href="#" style={{color:"white"}}>
LEARN MORE
  </Link></p><br />
    <p> <Link href="#" style={{color:"white"}}>
Privacy & Security
  
  </Link></p><br />
    <p> <Link href="#" style={{color:"white"}}>
SOCIAL LINKS
  
  </Link></p><br />
<p> <Link href="#" className = 'report'>
  
  Report Fraud
    </Link></p>
   
  </div>
</div>
</>
 
  )
}

export default Last
