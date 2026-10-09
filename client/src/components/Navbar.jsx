import React, { useState } from 'react';
import { Sparkles, LogIn, LogOut, ShieldAlert, Menu, X, Shield, Scan } from 'lucide-react';

export default function Navbar({ currentUser, onOpenAuth, onLogout, activeTab, setActiveTab }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(7, 17, 31, 0.92)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.07)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px',
        height: '66px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Logo */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          onClick={() => { setActiveTab('search'); setMobileOpen(false); }}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #00c8b9 0%, #0090d6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 18px rgba(0,200,185,0.4)',
            flexShrink: 0
          }}>
            <Scan size={20} color="#07111f" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{
              fontSize: '18px',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              letterSpacing: '-0.02em',
              background: 'linear-gradient(90deg, #ffffff 0%, #00c8b9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1
            }}>
              FACE<span style={{ WebkitTextFillColor: '#00c8b9' }}>IDENTIFY</span>
            </div>
            <div style={{ fontSize: '10px', color: '#4e6a85', letterSpacing: '0.06em', fontWeight: 500, marginTop: '2px' }}>
              AI FACE SEARCH & REVERSE PROFILE DISCOVERY
            </div>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="desktop-nav">
          {['How It Works', 'Features', 'Pricing'].map(item => (
            <a
              key={item}
              href="#"
              style={{
                fontSize: '14px',
                fontWeight: 500,
                color: '#8faac0',
                textDecoration: 'none',
                padding: '8px 14px',
                borderRadius: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => { e.target.style.color = '#ffffff'; e.target.style.background = 'rgba(255,255,255,0.06)'; }}
              onMouseLeave={e => { e.target.style.color = '#8faac0'; e.target.style.background = 'transparent'; }}
            >
              {item}
            </a>
          ))}

          {currentUser?.role === 'ADMIN' && (
            <button
              onClick={() => setActiveTab('admin')}
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: activeTab === 'admin' ? '#00c8b9' : '#8faac0',
                background: activeTab === 'admin' ? 'rgba(0,200,185,0.1)' : 'transparent',
                border: '1px solid',
                borderColor: activeTab === 'admin' ? 'rgba(0,200,185,0.3)' : 'transparent',
                borderRadius: '8px',
                padding: '7px 14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              <ShieldAlert size={14} /> Admin
            </button>
          )}
        </nav>

        {/* Auth Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {currentUser ? (
            <>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 12px 5px 5px',
                borderRadius: '24px',
                background: 'rgba(0,200,185,0.08)',
                border: '1px solid rgba(0,200,185,0.2)'
              }}>
                <div style={{
                  width: '30px', height: '30px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00c8b9, #0090d6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', fontWeight: 700, color: '#07111f'
                }}>
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#f0f6ff' }}>
                  {currentUser.name?.split(' ')[0] || 'User'}
                </span>
              </div>
              <button
                onClick={onLogout}
                title="Logout"
                style={{
                  background: 'rgba(244,63,94,0.1)',
                  border: '1px solid rgba(244,63,94,0.2)',
                  borderRadius: '8px',
                  padding: '8px 10px',
                  cursor: 'pointer',
                  color: '#f43f5e',
                  display: 'flex', alignItems: 'center'
                }}
              >
                <LogOut size={15} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onOpenAuth}
                style={{
                  fontSize: '13px', fontWeight: 600,
                  color: '#8faac0', background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '8px', padding: '8px 16px',
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.target.style.borderColor = 'rgba(255,255,255,0.25)'}
                onMouseLeave={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
              >
                Log In
              </button>
              <button
                onClick={onOpenAuth}
                className="btn-primary"
                style={{ padding: '8px 18px', fontSize: '13px' }}
              >
                Sign Up Free
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
