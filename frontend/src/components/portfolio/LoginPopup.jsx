import { useState } from 'react';

const LoginPopup = ({ isOpen, onClose }) => {
  const [method, setMethod] = useState('email'); // 'email' | 'phone' | 'otp'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [emailError, setEmailError] = useState('');

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target.id === 'login-backdrop') {
      onClose();
    }
  };

  const handleSendOTP = (e) => {
    e.preventDefault();
    if (phone.length > 5) setMethod('otp');
  };

  const handleEmailLogin = (e) => {
    e.preventDefault();
    if (!email.toLowerCase().endsWith('@gmail.com')) {
      setEmailError('Please use a @gmail.com email address.');
      return;
    }
    setEmailError('');
    // Proceed with login
  };

  const renderEmailLogin = () => (
    <form className="login-popup__form" onSubmit={handleEmailLogin}>
      <div className="login-popup__input-group">
        <label>Email</label>
        <input 
          type="email" 
          placeholder="yourname@gmail.com" 
          value={email} 
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) setEmailError('');
          }} 
          style={emailError ? { borderColor: '#ef4444', backgroundColor: '#fef2f2' } : {}}
          required 
        />
        {emailError && <span className="login-popup__error-text">{emailError}</span>}
      </div>
      <div className="login-popup__input-group">
        <label>Password</label>
        <div className="login-popup__password-wrapper">
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="Enter your password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button 
            type="button" 
            className="login-popup__password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            )}
          </button>
        </div>
      </div>
      <button type="submit" className="btn btn-primary login-popup__submit">Sign In</button>
      
      <div className="login-popup__divider"><span>or</span></div>
      
      <button type="button" className="login-popup__social-btn" onClick={() => {}}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
        Continue with Google
      </button>

      <button type="button" className="login-popup__social-btn" onClick={() => setMethod('phone')}>
        <svg fill="currentColor" width="20" height="20" viewBox="0 0 24 24"><path d="M17.4 22A15.42 15.42 0 0 1 2 6.6 4.6 4.6 0 0 1 6.6 2h3.29a2 2 0 0 1 2 1.72 12.55 12.55 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L10.6 10.2a15.2 15.2 0 0 0 6.69 6.69l1.51-1.56a2 2 0 0 1 2.11-.45 12.55 12.55 0 0 0 2.81.7A2 2 0 0 1 22 17.58v3.31A4.6 4.6 0 0 1 17.4 22z"/></svg>
        Continue with Phone
      </button>
    </form>
  );

  const renderPhoneLogin = () => (
    <form className="login-popup__form" onSubmit={handleSendOTP}>
      <button type="button" className="login-popup__back-btn" onClick={() => setMethod('email')}>
        ← Back to Email
      </button>
      <div className="login-popup__input-group">
        <label>Phone Number</label>
        <input 
          type="tel" 
          placeholder="+1 (555) 000-0000" 
          value={phone} 
          onChange={(e) => setPhone(e.target.value)} 
          required 
        />
      </div>
      <button type="submit" className="btn btn-primary login-popup__submit">Send OTP</button>
    </form>
  );

  const renderOTPVerification = () => (
    <form className="login-popup__form" onSubmit={(e) => e.preventDefault()}>
      <button type="button" className="login-popup__back-btn" onClick={() => setMethod('phone')}>
        ← Back to Phone
      </button>
      <div className="login-popup__input-group">
        <label>Enter Verification Code</label>
        <p className="login-popup__desc">Sent to {phone}</p>
        <input 
          type="text" 
          placeholder="000000" 
          maxLength="6"
          value={otp} 
          onChange={(e) => setOtp(e.target.value)} 
          required 
          style={{ letterSpacing: '0.2em', textAlign: 'center', fontSize: '1.2rem' }}
        />
      </div>
      <button type="submit" className="btn btn-primary login-popup__submit">Verify & Login</button>
    </form>
  );

  return (
    <div className="login-backdrop" id="login-backdrop" onClick={handleBackdropClick}>
      <div className="login-popup fade-in visible">
        <div className="login-popup__header">
          <div className="login-popup__logo">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <defs>
                <linearGradient id="popupGrad" x1="0" y1="0" x2="32" y2="32">
                  <stop offset="0%" stopColor="#667eea" />
                  <stop offset="50%" stopColor="#2563EB" />
                  <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
              </defs>
              <circle cx="16" cy="16" r="15" fill="url(#popupGrad)" />
              <circle cx="12" cy="14" r="4" fill="rgba(255,255,255,0.6)" />
              <circle cx="20" cy="18" r="3" fill="rgba(255,255,255,0.4)" />
            </svg>
            <h2>Welcome Back</h2>
          </div>
          <button className="login-popup__close" aria-label="Close" onClick={onClose}>×</button>
        </div>
        
        <div className="login-popup__content">
          {method === 'email' && renderEmailLogin()}
          {method === 'phone' && renderPhoneLogin()}
          {method === 'otp' && renderOTPVerification()}
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
