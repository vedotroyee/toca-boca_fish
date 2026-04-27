import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isMockSupabase } from '../lib/supabase';
import CanvasAquarium from '../components/CanvasAquarium';
import './AuthPage.css';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rippling, setRippling] = useState(false);
  
  const navigate = useNavigate();

  const handleSuccess = () => {
    setRippling(true);
    setTimeout(() => {
      navigate('/app');
    }, 1200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (isMockSupabase) {
        // Mock authentication for local dev without keys
        setTimeout(() => {
            localStorage.setItem('toca_user', email);
            handleSuccess();
        }, 800);
        return;
    }

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      }
      handleSuccess();
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
      if (isMockSupabase) {
          localStorage.setItem('toca_user', 'google_user');
          handleSuccess();
          return;
      }
      try {
          const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
          if (error) throw error;
      } catch (err: any) {
          setError(err.message);
      }
  };

  return (
    <div className="auth-page">
      <div className={`glass-ripple ${rippling ? 'active' : ''}`}></div>
      
      <div className="auth-left">
        {/* Simplified Aquarium Scene for Auth */}
        <div className="auth-aquarium-scene">
           <CanvasAquarium />
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-container">
          <h2>{isLogin ? 'Welcome back' : 'Create an account'}</h2>
          <p>{isLogin ? 'The fish missed you.' : 'Start your focus aquarium.'}</p>
          
          {error && <div style={{ color: '#ff6b6b', marginBottom: '15px', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="auth-input-group">
              <label>Email</label>
              <input 
                type="email" 
                required 
                placeholder="you@example.com" 
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            
            <div className="auth-input-group">
              <label>Password</label>
              <input 
                type="password" 
                required 
                placeholder="••••••••" 
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Swimming...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </button>
          </form>

          <div className="auth-divider">or</div>

          <button type="button" className="google-btn" onClick={handleGoogle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="auth-switch">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </div>
        </div>

        {/* Cat Illustration */}
        <div className="auth-cat">
           <svg viewBox="0 0 120 100">
              {/* Cat Body */}
              <path d="M20,100 Q60,30 100,100 Z" fill="#ffdbbb" />
              {/* Ears */}
              <path d="M35,60 L30,30 L50,55" fill="#ffdbbb" />
              <path d="M85,60 L90,30 L70,55" fill="#ffdbbb" />
              {/* Ear inners */}
              <path d="M38,55 L35,40 L45,52 Z" fill="#ffb6c1" opacity="0.6"/>
              <path d="M82,55 L85,40 L75,52 Z" fill="#ffb6c1" opacity="0.6"/>
              {/* Eyes */}
              <circle cx="45" cy="65" r="6" fill="#3d1f2e" />
              <circle cx="75" cy="65" r="6" fill="#3d1f2e" />
              {/* Eye Catchlights */}
              <circle cx="43" cy="63" r="2" fill="white" />
              <circle cx="73" cy="63" r="2" fill="white" />
              {/* Nose */}
              <path d="M58,75 L62,75 L60,78 Z" fill="#ff8c9d" />
           </svg>
        </div>
      </div>
    </div>
  );
}
