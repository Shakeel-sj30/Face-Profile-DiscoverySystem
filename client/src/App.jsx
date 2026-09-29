import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import FaceUploader from './components/FaceUploader';
import SearchProgress from './components/SearchProgress';
import ResultsDashboard from './components/ResultsDashboard';
import AdminDashboard from './components/AdminDashboard';
import { api } from './services/api';
import { ShieldCheck, Info, Sparkles, Lock, Globe } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('search'); // 'search' | 'admin'
  const [searchState, setSearchState] = useState('idle'); // 'idle' | 'processing' | 'results'
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

  const handleStartSearch = async (imageFile) => {
    setErrorMsg('');
    setSearchState('processing');

    try {
      const response = await api.initiateSearch(imageFile);
      if (response.success) {
        setSearchResults(response.candidates || api.getMockCandidates());
        setSearchState('results');
      } else {
        setErrorMsg(response.message || 'Face search failed');
        setSearchState('idle');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Processing error');
      setSearchState('idle');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Container */}
      <main style={{ flex: 1, maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '40px 24px' }}>
        {errorMsg && (
          <div style={{
            maxWidth: '640px',
            margin: '0 auto 24px',
            padding: '14px 18px',
            borderRadius: '12px',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: '#f43f5e',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg('')} style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer' }}>✕</button>
          </div>
        )}

        {/* Hero Header for Search View */}
        {activeTab === 'search' && searchState === 'idle' && (
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '20px',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              color: '#8b5cf6',
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '16px'
            }}>
              <Sparkles size={16} /> InsightFace + ArcFace Permitted Profile Finder
            </div>
            <h1 style={{
              fontSize: '42px',
              fontWeight: 800,
              lineHeight: 1.15,
              background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #94a3b8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              maxWidth: '800px',
              margin: '0 auto 16px'
            }}>
              Discover Candidate Social Profiles Using Deep Face Matching
            </h1>
            <p style={{ fontSize: '16px', color: '#94a3b8', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
              Upload a person's photo to generate 512-dimensional ArcFace embeddings, query permitted public sources, and review candidate profile matches ranked by similarity.
            </p>
          </div>
        )}

        {/* View Switcher */}
        {activeTab === 'admin' ? (
          <AdminDashboard api={api} />
        ) : searchState === 'idle' ? (
          <FaceUploader
            onStartSearch={handleStartSearch}
            disabled={searchState === 'processing'}
            onOpenAuth={() => setIsAuthOpen(true)}
            isAuthenticated={!!currentUser}
          />
        ) : searchState === 'processing' ? (
          <SearchProgress />
        ) : (
          <ResultsDashboard
            results={searchResults}
            onResetSearch={() => setSearchState('idle')}
          />
        )}
      </main>

      {/* Security & Retention Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(7, 9, 14, 0.95)',
        padding: '24px',
        fontSize: '12px',
        color: '#64748b'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={16} color="#10b981" />
            <span>Privacy Control Enforced — Automatic 7-Day Search Retention Expiry & Controlled Audit Logging</span>
          </div>

          <div>
            Stack: React | Java + Spring Boot | Python + InsightFace + ArcFace | H2 Database
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(user) => setCurrentUser(user)}
        api={api}
      />
    </div>
  );
}
