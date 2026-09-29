import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, ArrowRight, KeyRound } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, api }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let res;
      if (isRegister) {
        res = await api.register(name, email, password);
      } else {
        res = await api.login(email, password);
      }

      if (res.success) {
        onAuthSuccess(res.user);
        onClose();
      } else {
        setError(res.message || 'Authentication failed');
      }
    } catch (err) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickAccount = async (accountType) => {
    setLoading(true);
    setError('');
    try {
      let res;
      if (accountType === 'admin') {
        res = await api.login('admin@facediscovery.org', 'admin123');
      } else {
        res = await api.login('demo@facediscovery.org', 'demo123');
      }
      if (res.success) {
        onAuthSuccess(res.user);
        onClose();
      }
    } catch (err) {
      setError('Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel glass-panel-glow" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '32px',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '16px',
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            color: '#8b5cf6'
          }}>
            <Lock size={24} />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f8fafc' }}>
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
            {isRegister ? 'Sign up to start face search operations' : 'Sign in to access protected face search & discovery'}
          </p>
        </div>

        {error && (
          <div style={{
            padding: '10px 14px',
            borderRadius: '8px',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: '#f43f5e',
            fontSize: '13px',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Quick Demo Login Preset Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
          <button
            type="button"
            onClick={() => fillQuickAccount('demo')}
            className="btn-secondary"
            style={{ fontSize: '12px', padding: '8px', justifyContent: 'center' }}
          >
            <User size={14} color="#06b6d4" /> Quick User
          </button>
          <button
            type="button"
            onClick={() => fillQuickAccount('admin')}
            className="btn-secondary"
            style={{ fontSize: '12px', padding: '8px', justifyContent: 'center' }}
          >
            <ShieldCheck size={14} color="#8b5cf6" /> Quick Admin
          </button>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          margin: '16px 0',
          color: '#64748b',
          fontSize: '12px'
        }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
          <span>or sign in with email</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {isRegister && (
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#94a3b8', marginBottom: '6px' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="John Doe"
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#94a3b8', marginBottom: '6px' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="researcher@example.com"
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 38px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#94a3b8', marginBottom: '6px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 38px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '10px', padding: '12px' }}
          >
            {loading ? 'Processing...' : (isRegister ? 'Register Account' : 'Sign In')}
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#94a3b8' }}>
          {isRegister ? 'Already have an account? ' : "Don't have an account? "}
          <button
            type="button"
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            style={{ background: 'none', border: 'none', color: '#8b5cf6', fontWeight: 600, cursor: 'pointer' }}
          >
            {isRegister ? 'Sign In' : 'Create One'}
          </button>
        </div>
      </div>
    </div>
  );
}
