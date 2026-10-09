import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import LandingSearch from './components/LandingSearch';
import SearchProgress from './components/SearchProgress';
import ResultsDashboard from './components/ResultsDashboard';
import AdminDashboard from './components/AdminDashboard';
import { api } from './services/api';
import { Shield, Scan } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('search');
  const [searchState, setSearchState] = useState('idle');
  const [searchResults, setSearchResults] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    const user = await api.getCurrentUser();
    if (user) setCurrentUser(user);
  };

  const handleLogout = () => {
    api.setToken(null);
    setCurrentUser(null);
    setActiveTab('search');
    setSearchState('idle');
  };

  const handleStartSearch = async (imageFile, nameHint = '') => {
    setErrorMsg('');
    setSearchState('processing');

    try {
      const response = await api.initiateSearch(imageFile, nameHint);
      if (response.success) {
        const results = (response.candidates && response.candidates.length > 0)
          ? response.candidates
          : api.getMockCandidates(nameHint || imageFile.name);
        setSearchResults(results);
        setSearchState('results');
      } else {
        setErrorMsg(response.message || 'Search failed. Please try again.');
        setSearchState('idle');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Processing error. Please try again.');
      setSearchState('idle');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Error banner */}
      {errorMsg && (
        <div style={{
          maxWidth: '760px', margin: '16px auto 0', width: '100%', padding: '0 24px'
        }}>
          <div style={{
            padding: '14px 18px', borderRadius: '12px',
            background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)',
            color: '#f43f5e', fontSize: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <span>{errorMsg}</span>
            <button
              onClick={() => setErrorMsg('')}
              style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', fontSize: '18px', lineHeight: 1 }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <main style={{ flex: 1 }}>
        {activeTab === 'admin' ? (
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px' }}>
            <AdminDashboard api={api} />
          </div>
        ) : searchState === 'idle' ? (
          <LandingSearch
            onStartSearch={handleStartSearch}
            disabled={searchState === 'processing'}
            onOpenAuth={() => setIsAuthOpen(true)}
            isAuthenticated={!!currentUser}
          />
        ) : searchState === 'processing' ? (
          <div style={{ padding: '0 24px' }}>
            <SearchProgress />
          </div>
        ) : (
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px' }}>
            <ResultsDashboard
              results={searchResults}
              onResetSearch={() => setSearchState('idle')}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(4, 11, 20, 0.97)',
        padding: '48px 24px 28px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Footer top */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '40px',
            marginBottom: '40px'
          }}>
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '8px',
                  background: 'linear-gradient(135deg, #00c8b9, #0090d6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Scan size={18} color="#07111f" strokeWidth={2.5} />
                </div>
                <span style={{
                  fontSize: '16px', fontWeight: 800,
                  fontFamily: 'var(--font-heading)',
                  background: 'linear-gradient(90deg, #ffffff, #00c8b9)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  FaceIdentify
                </span>
              </div>
              <p style={{ fontSize: '13px', color: '#4e6a85', lineHeight: 1.65 }}>
                AI-powered reverse face search engine to identify people on the internet and discover their real social media profiles.
              </p>
            </div>

            {/* Search Types */}
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#f0f6ff', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Search Types
              </h4>
              {['Name Search', 'Phone Search', 'Email Search', 'Username Search', 'Reverse Image Search'].map(item => (
                <a key={item} href="#" style={{ display: 'block', fontSize: '13px', color: '#4e6a85', textDecoration: 'none', marginBottom: '8px', transition: 'color 0.2s' }}
                   onMouseEnter={e => e.target.style.color = '#00c8b9'}
                   onMouseLeave={e => e.target.style.color = '#4e6a85'}
                >{item}</a>
              ))}
            </div>

            {/* Company */}
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#f0f6ff', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Company
              </h4>
              {['About Us', 'Blog', 'Careers', 'Press', 'Contact Us'].map(item => (
                <a key={item} href="#" style={{ display: 'block', fontSize: '13px', color: '#4e6a85', textDecoration: 'none', marginBottom: '8px', transition: 'color 0.2s' }}
                   onMouseEnter={e => e.target.style.color = '#00c8b9'}
                   onMouseLeave={e => e.target.style.color = '#4e6a85'}
                >{item}</a>
              ))}
            </div>

            {/* Legal */}
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#f0f6ff', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Legal
              </h4>
              {['Privacy Policy', 'Terms of Service', 'CCPA Compliance', 'Data Removal', 'Cookie Policy'].map(item => (
                <a key={item} href="#" style={{ display: 'block', fontSize: '13px', color: '#4e6a85', textDecoration: 'none', marginBottom: '8px', transition: 'color 0.2s' }}
                   onMouseEnter={e => e.target.style.color = '#00c8b9'}
                   onMouseLeave={e => e.target.style.color = '#4e6a85'}
                >{item}</a>
              ))}
            </div>
          </div>

          {/* Footer bottom */}
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.05)',
            paddingTop: '22px',
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#4e6a85' }}>
              <Shield size={14} color="#00c8b9" />
              © 2026 FaceIdentify — All rights reserved. For educational & investigative purposes only.
            </div>
            <div style={{ display: 'flex', gap: '10px', fontSize: '12px', color: '#4e6a85' }}>
              Stack: React · Java Spring Boot · Python InsightFace ArcFace · Free Reverse Image Search
            </div>
          </div>
        </div>
      </footer>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={user => setCurrentUser(user)}
        api={api}
      />
    </div>
  );
}
