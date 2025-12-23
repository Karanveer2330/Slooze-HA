'use client'

import React from 'react'
import { useState } from 'react'
import './Sign.css'
import { Fragment } from 'react'
import { toast } from "react-toastify";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import API_URL from '../utils/api';

function Sign(props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  
  const [user_name, setfname] = useState("");
  const [user_lname, setlname] = useState("");
  const [user_email, setemail] = useState("");
  const [user_password, setpassword] = useState("");
  const [adr, setadr] = useState("");
  const [adr1, setadr2] = useState("");
  const [city, setcity] = useState("");
  const [state, setstate] = useState("");
  const [zip, setzip] = useState("");
  const [country, setCountry] = useState("India");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Password strength checker
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: '', color: '' };
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    if (strength <= 2) return { strength, text: 'Weak', color: '#dc3545' };
    if (strength <= 3) return { strength, text: 'Fair', color: '#ffc107' };
    if (strength <= 4) return { strength, text: 'Good', color: '#17a2b8' };
    return { strength, text: 'Strong', color: '#28a745' };
  };

  const passwordStrength = getPasswordStrength(user_password);

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!user_name.trim()) newErrors.user_name = 'First name is required';
    if (!user_lname.trim()) newErrors.user_lname = 'Last name is required';
    if (!user_email.trim()) {
      newErrors.user_email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user_email)) {
      newErrors.user_email = 'Please enter a valid email';
    }
    if (!user_password) {
      newErrors.user_password = 'Password is required';
    } else if (user_password.length < 8) {
      newErrors.user_password = 'Password must be at least 8 characters';
    }
    if (!adr.trim()) newErrors.adr = 'Address is required';
    if (!city.trim()) newErrors.city = 'City is required';
    if (!state.trim()) newErrors.state = 'State is required';
    if (!zip.trim()) {
      newErrors.zip = 'Zip code is required';
    } else if (!/^\d{5,6}$/.test(zip)) {
      newErrors.zip = 'Please enter a valid zip code';
    }
    if (!agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    try {
      const body = { user_name, user_email, user_password, adr, adr1, city, state, zip, user_lname, country };

      const response = await fetch(
        `${API_URL}/authentication/register`,
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
        toast.success("Account created successfully! Welcome!");
        router.push('/terms');
      } else {
        props.setAuth(false);
        toast.error(parseRes || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error(err.message);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <div className="signup-container">
        <div className="signup-card">
          <div className="signup-header">
            <h2>Create Your Account</h2>
            <p>Join Zaika and start ordering delicious food!</p>
          </div>

          <form className="signup-form" onSubmit={onSubmitForm}>
            {/* Name Fields */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name <span className="required">*</span></label>
                <input
                  type="text"
                  id="firstName"
                  className={`form-control ${errors.user_name ? 'error' : ''}`}
                  placeholder="Enter your first name"
                  value={user_name}
                  onChange={e => setfname(e.target.value)}
                />
                {errors.user_name && <span className="error-message">{errors.user_name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name <span className="required">*</span></label>
                <input
                  type="text"
                  id="lastName"
                  className={`form-control ${errors.user_lname ? 'error' : ''}`}
                  placeholder="Enter your last name"
                  value={user_lname}
                  onChange={e => setlname(e.target.value)}
                />
                {errors.user_lname && <span className="error-message">{errors.user_lname}</span>}
              </div>
            </div>

            {/* Email and Password */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email Address <span className="required">*</span></label>
                <input
                  type="email"
                  id="email"
                  className={`form-control ${errors.user_email ? 'error' : ''}`}
                  placeholder="your.email@example.com"
                  value={user_email}
                  onChange={e => setemail(e.target.value)}
                />
                {errors.user_email && <span className="error-message">{errors.user_email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password <span className="required">*</span></label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className={`form-control ${errors.user_password ? 'error' : ''}`}
                    placeholder="Create a strong password"
                    value={user_password}
                    onChange={e => setpassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {user_password && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div
                        className="strength-fill"
                        style={{
                          width: `${(passwordStrength.strength / 5) * 100}%`,
                          backgroundColor: passwordStrength.color
                        }}
                      ></div>
                    </div>
                    <span className="strength-text" style={{ color: passwordStrength.color }}>
                      {passwordStrength.text}
                    </span>
                  </div>
                )}
                {errors.user_password && <span className="error-message">{errors.user_password}</span>}
              </div>
            </div>

            {/* Address Fields */}
            <div className="form-group">
              <label htmlFor="address1">Street Address <span className="required">*</span></label>
              <input
                type="text"
                id="address1"
                className={`form-control ${errors.adr ? 'error' : ''}`}
                placeholder="1234 Main St"
                value={adr}
                onChange={e => setadr(e.target.value)}
              />
              {errors.adr && <span className="error-message">{errors.adr}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="address2">Apartment, Suite, etc. (Optional)</label>
              <input
                type="text"
                id="address2"
                className="form-control"
                placeholder="Apartment, studio, or floor"
                value={adr1}
                onChange={e => setadr2(e.target.value)}
              />
            </div>

            {/* City, State, Zip */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City <span className="required">*</span></label>
                <input
                  type="text"
                  id="city"
                  className={`form-control ${errors.city ? 'error' : ''}`}
                  placeholder="Enter city"
                  value={city}
                  onChange={e => setcity(e.target.value)}
                />
                {errors.city && <span className="error-message">{errors.city}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="state">State <span className="required">*</span></label>
                <input
                  type="text"
                  id="state"
                  className={`form-control ${errors.state ? 'error' : ''}`}
                  placeholder="Enter state"
                  value={state}
                  onChange={e => setstate(e.target.value)}
                />
                {errors.state && <span className="error-message">{errors.state}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="zip">Zip Code <span className="required">*</span></label>
                <input
                  type="text"
                  id="zip"
                  className={`form-control ${errors.zip ? 'error' : ''}`}
                  placeholder="12345"
                  value={zip}
                  onChange={e => setzip(e.target.value)}
                  maxLength={6}
                />
                {errors.zip && <span className="error-message">{errors.zip}</span>}
              </div>
            </div>

            {/* Country Selection */}
            <div className="form-group">
              <label htmlFor="country">Country <span className="required">*</span></label>
              <select
                id="country"
                className="form-control"
                value={country}
                onChange={e => setCountry(e.target.value)}
              >
                <option value="India">India</option>
                <option value="America">America</option>
              </select>
            </div>

            {/* Terms and Conditions */}
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={agreeToTerms}
                  onChange={e => setAgreeToTerms(e.target.checked)}
                />
                <span>I agree to the <Link href="/Terms" className="terms-link">Terms of Service</Link> and <Link href="/Terms" className="terms-link">Privacy Policy</Link> <span className="required">*</span></span>
              </label>
              {errors.agreeToTerms && <span className="error-message">{errors.agreeToTerms}</span>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>

            {/* Login Link */}
            <div className="login-link">
              Already have an account? <Link href="/login" className="link">Sign in</Link>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  )
}

export default Sign
