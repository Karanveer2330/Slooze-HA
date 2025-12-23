'use client'

import React from 'react'
import './First.css'
import Link from 'next/link'

function First() {
  return (
<>
<h4 className='Lo'>
    We prefer you to first order from our choices
</h4>
       <div className='gh'> 

<div className="card" style={{height:"20em"}}>
  <img src="/Thalli.png" className="card-img-top" alt="..." style={{height:"15em"}}/>

  <div className="card-body">
    <h5 className="card-title" style={{padding: "0"}}>Thalli</h5>
   
    <Link className="nav-link btn btn-primary" href="/login" style={{background: "#ff662e7f", display: "inline-block", textDecoration: "none"}}>
      Order
    </Link>
  </div>
</div>


<div className="card" style={{height:"20em"}}>
  <img src="/fRIES.png" className="card-img-top" alt="..." style={{height:"14em"}}/>

  <div className="card-body">
    <h5 className="card-title" style={{padding: "0"}}>Fries</h5>

    <Link className="nav-link btn btn-primary" href="/login" style={{background: "#ff662e7f", display: "inline-block", textDecoration: "none"}}>
      Order now
    </Link>
  </div>
</div>



<div className="card" style={{height:"20em"}}>
  <img src="/iCECR.png" className="card-img-top" alt="..." style={{height:"14em"}}/>

  <div className="card-body">
    <h5 className="card-title" style={{padding: "0"}}>Desserts</h5>
  
    <Link className="nav-link btn btn-primary" href="/login" style={{background: "#ff662e7f", display: "inline-block", textDecoration: "none"}}>
      Order now
    </Link>
  </div>
</div>


<div className="card" style={{height:"20em"}}>
  <img src="/PANCAKES.png" className="card-img-top" alt="..." style={{height:"14em"}}/>

  <div className="card-body">
    <h5 className="card-title" style={{padding: "0"}}>Pancakes</h5>
 
    <Link className="nav-link btn btn-primary" href="/login" style={{background: "#ff662e7f", display: "inline-block", textDecoration: "none"}}>
      Order now
    </Link>
  </div>
</div>


<div className="card" style={{height:"20em"}}>
  <img src="/pizza.png" className="card-img-top" alt="..." style={{height:"15em"}}/>

  <div className="card-body">
    <h5 className="card-title" style={{padding: "0"}}>Pizza</h5>
 
    <Link className="nav-link btn btn-primary" href="/login" style={{background: "#ff662e7f", display: "inline-block", textDecoration: "none"}}>
      Order now
    </Link>
  </div>
</div>


       </div>

<div style={{paddingBottom:"2em",paddingTop:"8em"}}>
        
        <h4 className = 'hehe'>Our App works in these Places</h4>

    </div>
    <div className='gh'>
    <div className="card" style={{width: "18rem"}}>
  <img src="/kharar.png" className="card-img-top" alt="..."/>
  <div className="card-body">
    <p className="card-text">Kharar</p>
  </div>
</div>
<div className="card" style={{width: "18rem"}}>
  <img src="/ek_onkar.png" className="card-img-top" alt="..."/>
  <div className="card-body">
    <p className="card-text">Ek Onkar City</p>
  </div>
</div>

<div className="card" style={{width: "18rem"}}>
  <img src="/omega.png" className="card-img-top" alt="..."/>
  <div className="card-body">
    <p className="card-text">Omega City</p>
  </div>
</div>

<div className="card" style={{width: "18rem"}}>
  <img src="/aura_avenue.png" className="card-img-top" alt="..."/>
  <div className="card-body">
    <p className="card-text">Aura Avenue</p>
  </div>
</div>

<div className="card" style={{width: "18rem"}}>
  <img src="/modern_valley.png" className="card-img-top" alt="..."/>
  <div className="card-body">
    <p className="card-text">Modern Valley</p>
  </div>
</div>

{/* <div class="card" style={{width: "18rem;"}}>
  <img src="..." class="card-img-top" alt="..."/>
  <div class="card-body">
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
  </div>
</div>

<div class="card" style={{width: "18rem;"}}>
  <img src="..." class="card-img-top" alt="..."/>
  <div class="card-body">
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
  </div>
</div>

<div class="card" style={{width: "18rem;"}}>
  <img src="..." class="card-img-top" alt="..."/>
  <div class="card-body">
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
  </div>
</div>

<div class="card" style={{width: "18rem;"}}>
  <img src="..." class="card-img-top" alt="..."/>
  <div class="card-body">
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
  </div>
</div>

<div class="card" style={{width: "18rem;"}}>
  <img src="..." class="card-img-top" alt="..."/>
  <div class="card-body">
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
  </div>
</div>

<div class="card" style={{width: "18rem;"}}>
  <img src="..." class="card-img-top" alt="..."/>
  <div class="card-body">
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
  </div>
</div>

<div class="card" style={{width: "18rem;"}}>
  <img src="..." class="card-img-top" alt="..."/>
  <div class="card-body">
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
  </div>
</div>

<div class="card" style={{width: "18rem;"}}>
  <img src="..." class="card-img-top" alt="..."/>
  <div class="card-body">
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
  </div>
</div> */}



    </div>

   
    </>
  )
}

export default First
