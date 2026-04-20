import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function initGoogleButton(ref, isLogin, callback) {
  if (!ref || !window.google?.accounts?.id) return;
  if (!GOOGLE_CLIENT_ID) {
    console.error('VITE_GOOGLE_CLIENT_ID is not set in .env');
    return;
  }

  window.google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback,
  });

  window.google.accounts.id.renderButton(ref, {
    theme: 'outline',
    size: 'large',
    width: ref.offsetWidth || 380,
    text: isLogin ? 'signin_with' : 'signup_with',
    shape: 'rectangular',
  });
}

export default function LoginModal({ onClose }) {
  const { login, signup, googleLogin } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const googleBtnRef = useRef(null);

  async function handleGoogleResponse(response) {
    setError('');
    setLoading(true);
    try {
      await googleLogin(response.credential);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const ref = googleBtnRef.current;

    // If GIS is already loaded, render immediately
    if (window.google?.accounts?.id) {
      initGoogleButton(ref, isLogin, handleGoogleResponse);
      return;
    }

    // Otherwise wait for the GIS script to finish loading
    const script = document.querySelector('script[src*="accounts.google.com/gsi/client"]');
    if (script) {
      const onLoad = () => initGoogleButton(ref, isLogin, handleGoogleResponse);
      script.addEventListener('load', onLoad);
      return () => script.removeEventListener('load', onLoad);
    }
  }, [isLogin]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="modal-title">{isLogin ? 'Login' : 'Sign Up'}</h2>

        {/* Google Sign-In Button */}
        <div ref={googleBtnRef} className="google-btn-wrapper" id="google-signin-btn"></div>

        {!GOOGLE_CLIENT_ID && (
          <p className="error-msg" style={{ textAlign: 'center', fontSize: '0.8rem' }}>
            ⚠ Google Client ID not configured (VITE_GOOGLE_CLIENT_ID missing in .env)
          </p>
        )}

        <div className="divider">OR</div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
          )}
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              required
              minLength={6}
            />
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="btn-orange btn-full" disabled={loading}>
            {loading ? 'Please wait...' : isLogin ? 'Continue' : 'Create Account'}
          </button>
        </form>

        <p className="login-toggle-text">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            className="login-toggle-btn"
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </p>

        <p className="note text-center">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
