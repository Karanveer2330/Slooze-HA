'use client'

import React, { useState, Fragment } from "react";
import './Login.css'
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";
import API_URL from '../utils/api';


function Login(props) {
const router = useRouter();
const[user_email,setemail]=useState("");
const[user_password,setpassword]=useState("");

   const onSubmitform = async(e)=>{
      e.preventDefault();
      try {
        const body = {user_email, user_password };
        const response = await fetch(
          `${API_URL}/authentication/login`,
          {
            method: "POST",
            headers: {
              "Content-type": "application/json"
            },
            body: JSON.stringify(body)
          }
        );
  
        const parseRes = await response.json();
        if (parseRes.token) {
         localStorage.setItem("token", parseRes.token);
         props.setAuth(true, parseRes.user);
         toast.success(`Logged in successfully as ${parseRes.user?.role || 'user'}`);
         router.push('/PPMenu');
       } else {
         props.setAuth(false);
         toast.error(parseRes || "Login failed");
       }
  
     
        
       
      } catch (err) {
        console.error(err.message);
      }
    };
  
  
  

  return (
    <Fragment>
      <div className="login-wrapper">
        <div className="login-form">
          <div className="text">
            -LOGIN-
          </div>
          <form>
            <div className="field">
              <div className="fas fa-envelope"></div>
              <input
                type="text"
                placeholder="Email or Phone"
                value={user_email}
                onChange={e => setemail(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <div className="fas fa-lock"></div>
              <input
                type="password"
                placeholder="Password"
                value={user_password}
                onChange={e => setpassword(e.target.value)}
                required
              />
            </div>
            {/* <Link class="nav-link" to="/Terms" > */}
            <button onClick={onSubmitform}>LOGIN</button>
            {/* </Link> */}
            <div
              className="link"
              style={{ marginTop: "1.5rem", marginBottom: "1rem" }}
            >
              <Link href="/Sign" className="signup-link">
                Not a member? <strong>Sign up now</strong>
              </Link>
            </div>
          </form>
          <div
            style={{
              marginTop: "1rem",
              paddingTop: "1rem",
              borderTop: "1px solid rgba(0,0,0,0.1)",
            }}
          >
            <Link href="/Join" className="join-link">
              Join our team now - click here
            </Link>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Login;
