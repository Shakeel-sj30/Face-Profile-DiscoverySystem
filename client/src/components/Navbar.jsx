import React from 'react';
import { Camera, Shield, LogIn, LogOut, UserCheck, ShieldAlert, Cpu } from 'lucide-react';

export default function Navbar({ currentUser, onOpenAuth, onLogout, activeTab, setActiveTab }) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(7, 9, 14, 0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand logo & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('search')}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
          }}>
            <Camera size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '18px', fontWeight: 700, background: 'linear-gradient(90deg, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                FACE DISCOVERY
              </h1>
              <span style={{
                fontSize: '10px',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '12px',
                background: 'rgba(6, 182, 212, 0.15)',
                color: '#06b6d4',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                ArcFace AI v1.0
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#64748b' }}>Public Profile Matcher & Verification Engine</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('search')}
            className={activeTab === 'search' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '14px', padding: '8px 16px' }}
          >
            <Cpu size={16} />
            Face Search
          </button>

          {currentUser && currentUser.role === 'ADMIN' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={activeTab === 'admin' ? 'btn-primary' : 'btn-secondary'}
              style={{ fontSize: '14px', padding: '8px 16px' }}
            >
              <ShieldAlert size={16} />
              Admin Audit Panel
            </button>
          )}

          {/* User auth state */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '12px', paddingLeft: '12px', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: 'rgba(99, 102, 241, 0.2)',
                  border: '1px solid rgba(99, 102, 241, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#8b5cf6',
                  fontWeight: 700
                }}>
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc' }}>{currentUser.name}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>{currentUser.role}</div>
                </div>
              </div>

              <button onClick={onLogout} className="btn-secondary" title="Logout" style={{ padding: '8px 12px' }}>
                <LogOut size={16} color="#f43f5e" />
              </button>
            </div>
          ) : (
            <button onClick={onOpenAuth} className="btn-primary" style={{ fontSize: '14px', padding: '8px 18px', marginLeft: '12px' }}>
              <LogIn size={16} />
              Sign In / Register
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
