import React, { useState } from 'react';
import { ExternalLink, ShieldAlert, CheckCircle, Award, Sparkles, Filter, RefreshCw, AlertCircle } from 'lucide-react';

export default function ResultsDashboard({ results, onResetSearch }) {
  const [platformFilter, setPlatformFilter] = useState('ALL');

  const filteredResults = platformFilter === 'ALL'
    ? results
    : results.filter(r => r.platform.toLowerCase().includes(platformFilter.toLowerCase()));

  const getPlatformClass = (platform) => {
    const p = platform.toLowerCase();
    if (p.includes('instagram')) return 'badge-instagram';
    if (p.includes('linkedin')) return 'badge-linkedin';
    if (p.includes('twitter') || p.includes('x')) return 'badge-twitter';
    if (p.includes('github')) return 'badge-github';
    return 'btn-secondary';
  };

  return (
    <div style={{ width: '100%', maxWidth: '1024px', margin: '0 auto' }}>
      {/* Top Header & Reset */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#f8fafc' }}>
              Candidate Profile Results
            </h2>
            <span style={{
              fontSize: '12px',
              fontWeight: 600,
              padding: '3px 10px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10b981',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              {results.length} Matches Found
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
            Candidate profiles discovered via permitted public-source connectors
          </p>
        </div>

        <button onClick={onResetSearch} className="btn-secondary" style={{ fontSize: '13px' }}>
          <RefreshCw size={15} /> Start New Search
        </button>
      </div>

      {/* SYSTEM DISCLAIMER BANNER */}
      <div style={{
        padding: '14px 18px',
        borderRadius: '12px',
        background: 'rgba(245, 158, 11, 0.10)',
        border: '1px solid rgba(245, 158, 11, 0.25)',
        color: '#f59e0b',
        fontSize: '13px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong style={{ display: 'block', marginBottom: '2px', fontWeight: 700 }}>System Disclaimer: Possible Matches Only</strong>
          Facial similarity scores represent algorithmic visual proximity and do not constitute legal proof of personal identity. Please verify profile metadata directly on permitted public platforms.
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
        {['ALL', 'Instagram', 'LinkedIn', 'Twitter', 'GitHub'].map((plat) => (
          <button
            key={plat}
            onClick={() => setPlatformFilter(plat)}
            className={platformFilter === plat ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '12px', padding: '6px 14px', borderRadius: '20px' }}
          >
            {plat === 'ALL' ? 'All Platforms' : plat}
          </button>
        ))}
      </div>

      {/* Candidate Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {filteredResults.map((candidate) => (
          <div key={candidate.id || candidate.resultId} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              {/* Header: Platform & Confidence */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span className={getPlatformClass(candidate.platform)} style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '12px',
                  letterSpacing: '0.03em'
                }}>
                  {candidate.platform}
                </span>

                <span style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '3px 8px',
                  borderRadius: '10px',
                  background: candidate.similarityPercentage >= 85 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  color: candidate.similarityPercentage >= 85 ? '#10b981' : '#f59e0b',
                  border: `1px solid ${candidate.similarityPercentage >= 85 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
                }}>
                  {candidate.confidenceLevel || 'High'} Match
                </span>
              </div>

              {/* Profile Avatar & Info */}
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{
                  position: 'relative',
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid rgba(99, 102, 241, 0.5)',
                  boxShadow: '0 0 15px rgba(99, 102, 241, 0.2)'
                }}>
                  <img
                    src={candidate.profileImageUrl}
                    alt={candidate.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'; }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc' }}>{candidate.name}</h3>
                    {candidate.verified && <CheckCircle size={14} color="#06b6d4" />}
                  </div>
                  <div style={{ fontSize: '13px', color: '#8b5cf6', fontFamily: 'var(--font-mono)' }}>
                    {candidate.username}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                    Source: {candidate.source}
                  </div>
                </div>
              </div>

              {/* Bio snippet */}
              {candidate.bio && (
                <p style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic', marginBottom: '16px', lineHeight: 1.4 }}>
                  "{candidate.bio}"
                </p>
              )}

              {/* Similarity Bar */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                  <span style={{ color: '#94a3b8', fontWeight: 500 }}>ArcFace Facial Similarity</span>
                  <span style={{ color: '#f8fafc', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    {candidate.similarityPercentage}% Score
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${candidate.similarityPercentage}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #6366f1, #06b6d4, #10b981)',
                    borderRadius: '4px',
                    transition: 'width 1s ease-in-out'
                  }} />
                </div>
              </div>
            </div>

            {/* Action link */}
            <a
              href={candidate.publicProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{
                width: '100%',
                justify: 'center',
                fontSize: '13px',
                padding: '10px',
                textDecoration: 'none'
              }}
            >
              View Public Profile <ExternalLink size={14} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
