'use client'

import React from "react";
import "./Cards.css";
function Cards() {
  return (
 

    <div className="gh" style={{color: "black" }}>
      
        <div className="card" style={{height:"28em"}}>
          <img style={{height:300}} src="/fast.png" className="card-img-top" alt="..." />
          <div className="card-body">
            <div className="card-text">
           But we give you
           <h6>

          Fast, cheap and good quality of food delivery and handle your product with care.
           </h6>
            </div>
            
          </div>
        </div>
  

      
        <div className="card" style={{height:"28em"}}>
          <img style={{height:300}} src="/trusted.webp" className="card-img-top" alt="..." />
          <div className="card-body">
            <div className="card-text">

            Authenticated by ISIS
              <h6>
             Genuine and trustable app to use and top-notch services for our beloved customers
              </h6>
            </div>
          </div>
        </div>
    

    <div className="card" style={{height:"28em"}}>
    <img style={{height:300}} src="/food stall.png" className="card-img-top" alt="Every locale shop" />
    <div className="card-body">
      <div className="card-text">
      Diversified orders 
      <h6>

        You Can order any piece of item of your locality either from tiny or largest food supplier.
      </h6>
      </div>
    </div>
  </div>
  <div className="card" style={{height:"28em"}}>
    <img style={{height:300}} src="/deliveef.webp" className="card-img-top" alt="Customer Oriented" />
    <div className="card-body">
      <div className="card-text">
      Customer Oriented
        <h6>
       we endulge to provide customer satisfication as well as with marketing which pleases us and you at all steps. 
        </h6>
      </div>
    </div>
  </div>
   


      </div>



  );
}

export default Cards;
