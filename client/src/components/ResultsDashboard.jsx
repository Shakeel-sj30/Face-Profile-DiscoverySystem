import React, { useState } from 'react';
import {
  ExternalLink, CheckCircle, RefreshCw, Lock, Unlock,
  Copy, Check, Shield, AlertCircle, Star
} from 'lucide-react';

const PLATFORM_COLORS = {
  instagram: { bg: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)', label: 'Instagram', emoji: '📸' },
  linkedin:  { bg: '#0077b5', label: 'LinkedIn',  emoji: '💼' },
  twitter:   { bg: '#1da1f2', label: 'Twitter/X', emoji: '🐦' },
  x:         { bg: '#000000', label: 'X',         emoji: '✖' },
  github:    { bg: '#24292e', label: 'GitHub',    emoji: '💻' },
  facebook:  { bg: '#1877f2', label: 'Facebook',  emoji: '👥' },
  tiktok:    { bg: '#000000', label: 'TikTok',    emoji: '🎵' },
  youtube:   { bg: '#ff0000', label: 'YouTube',   emoji: '▶️' },
};

function getPlatformStyle(platform) {
  const key = Object.keys(PLATFORM_COLORS).find(k => platform.toLowerCase().includes(k));
  return PLATFORM_COLORS[key] || { bg: '#1e3a5f', label: platform, emoji: '🌐' };
}

function getAvatarGradient(username) {
  const gradients = [
    'linear-gradient(135deg, #00c8b9, #0090d6)',
    'linear-gradient(135deg, #7c3aed, #00c8b9)',
    'linear-gradient(135deg, #1a6ef5, #00c8b9)',
    'linear-gradient(135deg, #0090d6, #00c8b9)',
    'linear-gradient(135deg, #00c8b9, #10b981)',
  ];
  return gradients[(username?.length || 0) % gradients.length];
}

// Mini blurred placeholder card
function LockedCard({ rank, onUnlock }) {
  return (
    <div className="glass-panel" style={{
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
      minHeight: '220px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Blurred content */}
      <div style={{ filter: 'blur(6px)', flex: 1 }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg, #1e3a5f, #00c8b9)' }} />
          <div>
            <div style={{ height: '14px', width: '120px', background: '#1e3a5f', borderRadius: '6px', marginBottom: '8px' }} />
            <div style={{ height: '10px', width: '80px', background: '#0d2e5c', borderRadius: '4px' }} />
          </div>
        </div>
        <div style={{ height: '12px', width: '100%', background: '#0d2e5c', borderRadius: '4px', marginBottom: '8px' }} />
        <div style={{ height: '12px', width: '80%', background: '#0d2e5c', borderRadius: '4px', marginBottom: '8px' }} />
        <div style={{ height: '12px', width: '60%', background: '#0d2e5c', borderRadius: '4px' }} />
      </div>

      {/* Lock overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'rgba(7, 17, 31, 0.75)',
        backdropFilter: 'blur(2px)',
        gap: '10px'
      }}>
        <div style={{
          width: '42px', height: '42px', borderRadius: '50%',
          background: 'rgba(0,200,185,0.12)',
          border: '1px solid rgba(0,200,185,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#00c8b9'
        }}>
          <Lock size={18} />
        </div>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#f0f6ff' }}>Profile #{rank} Found</div>
        <div style={{ fontSize: '11px', color: '#4e6a85', textAlign: 'center', maxWidth: '140px' }}>
          Click to reveal full username
        </div>
        <button onClick={onUnlock} className="btn-primary" style={{ padding: '7px 16px', fontSize: '12px', cursor: 'pointer' }}>
          Unlock Profile
        </button>
      </div>
    </div>
  );
}

export default function ResultsDashboard({ results, onResetSearch }) {
  const [platformFilter, setPlatformFilter] = useState('ALL');
  const [copiedId, setCopiedId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  // All profiles are unlocked so the user can see all discovered social handles & usernames
  const [unlockedIds, setUnlockedIds] = useState(new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]));

  const platforms = ['ALL', ...new Set(results.map(r => r.platform))];

  const filtered = platformFilter === 'ALL'
    ? results
    : results.filter(r => r.platform.toLowerCase().includes(platformFilter.toLowerCase()));

  const topResult = filtered[0];

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleUnlock = (idx) => {
    setUnlockedIds(prev => new Set([...prev, idx]));
  };

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 0 60px' }}>

      {/* ===== RESULTS HEADER ===== */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '28px', flexWrap: 'wrap', gap: '12px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#f0f6ff' }}>
              Search Results
            </h2>
            <span style={{
              background: 'rgba(0,200,185,0.12)', border: '1px solid rgba(0,200,185,0.3)',
              color: '#00c8b9', fontSize: '13px', fontWeight: 700,
              padding: '3px 12px', borderRadius: '20px'
            }}>
              {results.length} Profiles Found
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#4e6a85' }}>
            Profiles discovered via AI face matching + reverse image search
          </p>
        </div>

        <button onClick={onResetSearch} className="btn-teal-outline" style={{ padding: '9px 18px', fontSize: '13px' }}>
          <RefreshCw size={15} /> New Search
        </button>
      </div>

      {/* ===== TOP MATCH CARD ===== */}
      {topResult && (
        <div style={{
          padding: '24px 28px',
          borderRadius: '18px',
          background: 'linear-gradient(135deg, rgba(0,200,185,0.10) 0%, rgba(0,144,214,0.08) 100%)',
          border: '1px solid rgba(0,200,185,0.3)',
          boxShadow: '0 0 40px rgba(0,200,185,0.1), 0 8px 32px rgba(0,0,0,0.3)',
          marginBottom: '24px',
          display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap'
        }}>
          {/* Avatar */}
          <div style={{
            width: '76px', height: '76px', borderRadius: '50%',
            overflow: 'hidden', border: '3px solid rgba(0,200,185,0.6)',
            boxShadow: '0 0 24px rgba(0,200,185,0.35)', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: getAvatarGradient(topResult.username),
            fontSize: '30px'
          }}>
            {topResult.profileImageUrl
              ? <img src={topResult.profileImageUrl} alt={topResult.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
              : getPlatformStyle(topResult.platform).emoji
            }
          </div>

          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#00c8b9', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
              🏆 Top Match
            </div>
            <div style={{
              fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-mono)',
              color: '#f0f6ff', letterSpacing: '-0.02em', marginBottom: '8px'
            }}>
              @{topResult.username}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{
                background: getPlatformStyle(topResult.platform).bg,
                color: 'white', fontSize: '11px', fontWeight: 700,
                padding: '3px 10px', borderRadius: '20px'
              }}>
                {getPlatformStyle(topResult.platform).emoji} {topResult.platform}
              </span>
              {topResult.name && (
                <span style={{ fontSize: '14px', color: '#8faac0' }}>{topResult.name}</span>
              )}
              {topResult.verified && <CheckCircle size={15} color="#00c8b9" />}
            </div>
          </div>

          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{
              fontSize: '44px', fontWeight: 900, fontFamily: 'var(--font-mono)',
              color: topResult.similarityPercentage >= 80 ? '#00c8b9' : '#f59e0b',
              lineHeight: 1
            }}>
              {topResult.similarityPercentage}%
            </div>
            <div style={{ fontSize: '11px', color: '#4e6a85', marginBottom: '14px' }}>confidence match</div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button
                onClick={() => handleCopy(topResult.username, 'top')}
                className="btn-secondary"
                style={{ padding: '7px 14px', fontSize: '12px' }}
              >
                {copiedId === 'top' ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy</>}
              </button>
              <a
                href={topResult.publicProfileUrl}
                target="_blank" rel="noopener noreferrer"
                className="btn-primary"
                style={{ padding: '7px 14px', fontSize: '12px', textDecoration: 'none' }}
              >
                View Profile <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ===== DISCLAIMER ===== */}
      <div style={{
        padding: '12px 16px', borderRadius: '10px',
        background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.18)',
        color: '#f59e0b', fontSize: '12px',
        display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px'
      }}>
        <AlertCircle size={15} style={{ flexShrink: 0 }} />
        <span>
          <strong>Disclaimer:</strong> Results are based on visual similarity via AI face matching and reverse image search.
          Always verify directly on the platform. For educational and investigative purposes only.
        </span>
      </div>

      {/* ===== PLATFORM FILTERS ===== */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '22px', overflowX: 'auto', paddingBottom: '4px' }}>
        {platforms.map(plat => (
          <button
            key={plat}
            onClick={() => setPlatformFilter(plat)}
            style={{
              padding: '7px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
              cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s',
              background: platformFilter === plat ? 'rgba(0,200,185,0.15)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${platformFilter === plat ? 'rgba(0,200,185,0.4)' : 'rgba(255,255,255,0.08)'}`,
              color: platformFilter === plat ? '#00c8b9' : '#8faac0',
              fontFamily: 'var(--font-body)'
            }}
          >
            {plat === 'ALL' ? 'All Platforms' : plat}
          </button>
        ))}
      </div>

      {/* ===== RESULTS GRID ===== */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '18px' }}>
        {filtered.map((candidate, idx) => {
          const cid = candidate.resultId || candidate.id || `res_${idx}`;
          const isUnlocked = unlockedIds.has(idx) || idx === 0;
          const platStyle = getPlatformStyle(candidate.platform);

          if (!isUnlocked) {
            return (
              <div key={cid} style={{ position: 'relative' }}>
                <LockedCard rank={idx + 1} onUnlock={() => handleUnlock(idx)} />
              </div>
            );
          }

          const rawUser = candidate.username || '';
          const displayUser = rawUser.startsWith('@') ? rawUser : `@${rawUser}`;

          return (
            <div
              key={cid}
              className="glass-panel"
              style={{
                padding: '20px',
                display: 'flex', flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative', overflow: 'hidden',
                animation: `fadeInUp 0.4s ${idx * 0.06}s both`
              }}
            >
              {/* Top match badge */}
              {idx === 0 && platformFilter === 'ALL' && (
                <div style={{
                  position: 'absolute', top: '14px', right: '14px',
                  fontSize: '10px', fontWeight: 700, padding: '3px 10px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #00c8b9, #0090d6)',
                  color: '#07111f'
                }}>
                  #1 MATCH
                </div>
              )}

              {/* Platform badge */}
              <div style={{ marginBottom: '14px' }}>
                <span style={{
                  background: platStyle.bg, color: 'white',
                  fontSize: '11px', fontWeight: 700,
                  padding: '3px 10px', borderRadius: '20px',
                  display: 'inline-flex', alignItems: 'center', gap: '4px'
                }}>
                  {platStyle.emoji} {candidate.platform}
                </span>
              </div>

              {/* Avatar + Name */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid rgba(0,200,185,0.3)', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: getAvatarGradient(candidate.username),
                  fontSize: '20px'
                }}>
                  {candidate.profileImageUrl
                    ? <img src={candidate.profileImageUrl} alt={candidate.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
                    : platStyle.emoji
                  }
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#f0f6ff' }}>
                      {candidate.name || candidate.username}
                    </span>
                    {candidate.verified && <CheckCircle size={14} color="#00c8b9" />}
                  </div>
                  <div style={{ fontSize: '12px', color: '#4e6a85', marginTop: '2px' }}>
                    {candidate.source || 'Reverse image match'}
                  </div>
                </div>
              </div>

              {/* Username box */}
              <div style={{
                background: 'rgba(0,200,185,0.06)', border: '1px solid rgba(0,200,185,0.18)',
                borderRadius: '10px', padding: '10px 14px', marginBottom: '14px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '10px', color: '#4e6a85', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>
                    Discovered Username
                  </div>
                  <div style={{ fontSize: '17px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#00c8b9', letterSpacing: '-0.01em' }}>
                    {displayUser}
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(displayUser, cid)}
                  style={{
                    background: 'none', border: 'none', color: '#00c8b9',
                    cursor: 'pointer', padding: '6px', borderRadius: '8px',
                    display: 'flex', alignItems: 'center',
                    transition: 'all 0.2s'
                  }}
                  title="Copy username"
                >
                  {copiedId === cid ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                </button>
              </div>

              {/* Bio */}
              {candidate.bio && (
                <p style={{
                  fontSize: '12px', color: '#8faac0',
                  fontStyle: 'italic', marginBottom: '14px', lineHeight: 1.55
                }}>
                  "{candidate.bio}"
                </p>
              )}

              {/* Similarity Bar */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '6px' }}>
                  <span style={{ color: '#8faac0' }}>Confidence Match</span>
                  <span style={{
                    color: candidate.similarityPercentage >= 80 ? '#00c8b9' : '#f59e0b',
                    fontWeight: 700, fontFamily: 'var(--font-mono)'
                  }}>
                    {candidate.similarityPercentage}% · {candidate.confidenceLevel}
                  </span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${candidate.similarityPercentage}%`, height: '100%',
                    background: candidate.similarityPercentage >= 80
                      ? 'linear-gradient(90deg, #00c8b9, #0090d6)'
                      : 'linear-gradient(90deg, #f59e0b, #f97316)',
                    borderRadius: '3px', transition: 'width 1s ease-in-out'
                  }} />
                </div>
              </div>

              {/* Action button */}
              <a
                href={candidate.publicProfileUrl}
                target="_blank" rel="noopener noreferrer"
                className="btn-primary"
                style={{
                  width: '100%', justifyContent: 'center',
                  fontSize: '13px', padding: '10px', textDecoration: 'none',
                  borderRadius: '10px'
                }}
              >
                Open {candidate.platform} Profile <ExternalLink size={13} />
              </a>
            </div>
          );
        })}
      </div>

      {/* ===== UPSELL BANNER ===== */}
      {filtered.length > 1 && (
        <div style={{
          marginTop: '32px',
          padding: '28px 32px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(0,200,185,0.08) 0%, rgba(26,110,245,0.08) 100%)',
          border: '1px solid rgba(0,200,185,0.2)',
          textAlign: 'center'
        }}>
          <Lock size={28} color="#00c8b9" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#f0f6ff', marginBottom: '8px' }}>
            {filtered.length - 1} More Profile{filtered.length - 1 !== 1 ? 's' : ''} Found
          </h3>
          <p style={{ fontSize: '14px', color: '#8faac0', marginBottom: '20px' }}>
            Unlock full contact info, social accounts, photos, and public records for all matches.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" style={{ padding: '12px 28px', fontSize: '14px' }}>
              <Unlock size={16} /> Unlock All Results
            </button>
            <button className="btn-secondary" style={{ padding: '12px 20px', fontSize: '14px' }}>
              Learn More
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
