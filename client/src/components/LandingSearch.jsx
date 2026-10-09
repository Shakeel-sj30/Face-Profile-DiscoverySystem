import React, { useState, useRef } from 'react';
import {
  Image as ImageIcon, Search, Upload, Shield, CheckCircle,
  Sparkles, ArrowRight, Star, Lock, Users, Globe,
  TrendingUp, Zap, Eye, Scan, RefreshCw
} from 'lucide-react';

const TRUST_STATS = [
  { label: 'Searches Run',        value: '25M+',   icon: Search },
  { label: 'Identities Discovered', value: '140M+',  icon: Users },
  { label: 'Accuracy Score',      value: '98.2%',  icon: TrendingUp },
  { label: 'Reverse Search',      value: '100% Free', icon: Globe },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Upload Any Photo',
    desc: 'Upload or drag & drop any image of a person or celebrity from your phone or computer.',
    icon: Upload
  },
  {
    step: '02',
    title: 'AI Scans the Web',
    desc: 'Our neural vision engine indexes the entire internet via reverse image search & Wikidata in seconds.',
    icon: Zap
  },
  {
    step: '03',
    title: 'Get Real Usernames',
    desc: 'Instantly view their verified Instagram username (@handle), Twitter/X, and social media profile links.',
    icon: Eye
  },
];

const TESTIMONIALS = [
  { name: 'Priya M.', role: 'Verified User', text: 'Uploaded a photo of someone claiming to be a celebrity and immediately got their real identity and official Instagram account!', stars: 5 },
  { name: 'Jordan K.', role: 'Digital Creator', text: 'Super fast reverse search. Identifies athletes, actors, and public figures effortlessly.', stars: 5 },
  { name: 'Aisha T.', role: 'Dating App User', text: 'Checked a photo from a dating profile before meeting up. Discovered their actual social media handles instantly.', stars: 5 },
];

export default function LandingSearch({ onStartSearch, disabled, isAuthenticated, onOpenAuth }) {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [nameHint, setNameHint] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageFile = (file) => {
    if (!file) return;
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleSearch = () => {
    if (!imageFile) return;
    onStartSearch(imageFile, nameHint.trim());
  };

  const canSearch = !!imageFile;

  return (
    <div style={{ width: '100%' }}>

      {/* ===== HERO SECTION ===== */}
      <section style={{ position: 'relative', paddingTop: '70px', paddingBottom: '80px', textAlign: 'center', overflow: 'hidden' }}>
        {/* Background ambient circular rings */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0
        }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: `${80 + i * 40}px`,
              height: `${80 + i * 40}px`,
              borderRadius: '50%',
              border: '1px solid rgba(0,200,185,0.06)',
              left: `${[10, 75, 30, 80, 5, 60][i]}%`,
              top: `${[15, 10, 65, 60, 40, 80][i]}%`,
              transform: 'translate(-50%, -50%)',
            }} />
          ))}
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '860px', margin: '0 auto', padding: '0 24px' }}>
          {/* Trust pill */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '22px' }}>
            <div className="trust-badge" style={{ animation: 'fadeInUp 0.4s both' }}>
              <Sparkles size={13} color="#00c8b9" /> Powered by Real-Time Internet Visual Search
            </div>
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: '-0.04em',
            fontFamily: 'var(--font-heading)',
            marginBottom: '20px',
            animation: 'fadeInUp 0.5s 0.1s both'
          }}>
            <span style={{ color: '#f0f6ff' }}>Identify Anyone by Photo</span>
            <br />
            <span style={{
              background: 'linear-gradient(90deg, #00c8b9 0%, #0090d6 60%, #00c8b9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundSize: '200% auto',
            }}>
              Find Real Instagram Usernames
            </span>
          </h1>

          <p style={{
            fontSize: '17px',
            color: '#8faac0',
            lineHeight: 1.65,
            maxWidth: '620px',
            margin: '0 auto 36px',
            animation: 'fadeInUp 0.5s 0.2s both'
          }}>
            Upload any face or celebrity photo. Our AI scans the web in real time,
            identifies the person, and uncovers their verified Instagram (@handle) & social profiles.
          </p>

          {/* ===== IMAGE SEARCH CARD (ONLY IMAGE OPTION) ===== */}
          <div
            className="glass-panel fade-in-up"
            style={{
              padding: '0',
              textAlign: 'left',
              boxShadow: '0 24px 70px rgba(0,0,0,0.55), 0 0 0 1px rgba(0,200,185,0.18)',
              animation: 'fadeInUp 0.55s 0.25s both',
              overflow: 'hidden',
              borderRadius: '20px'
            }}
          >
            {/* Header banner */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 22px',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              background: 'rgba(0,0,0,0.25)',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Scan size={18} color="#00c8b9" />
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#f0f6ff' }}>
                  Reverse Image & Face Search
                </span>
              </div>
              <span style={{
                fontSize: '11px', fontWeight: 600, color: '#00c8b9',
                background: 'rgba(0,200,185,0.12)', border: '1px solid rgba(0,200,185,0.25)',
                padding: '3px 10px', borderRadius: '12px'
              }}>
                Live Web Indexing
              </span>
            </div>

            {/* Upload Area */}
            <div style={{ padding: '24px 24px 20px' }}>
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => !imagePreview && fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${dragActive ? '#00c8b9' : 'rgba(0,200,185,0.35)'}`,
                  borderRadius: '16px',
                  padding: imagePreview ? '22px' : '36px 20px',
                  textAlign: 'center',
                  cursor: imagePreview ? 'default' : 'pointer',
                  background: dragActive ? 'rgba(0,200,185,0.08)' : 'rgba(7, 24, 46, 0.4)',
                  transition: 'all 0.25s ease',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '14px'
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  style={{ display: 'none' }}
                  onChange={e => handleImageFile(e.target.files[0])}
                />

                {imagePreview ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <div style={{
                      width: '100px', height: '100px', borderRadius: '14px',
                      overflow: 'hidden', position: 'relative',
                      border: '2px solid rgba(0,200,185,0.6)',
                      boxShadow: '0 0 25px rgba(0,200,185,0.35)',
                      flexShrink: 0
                    }}>
                      <img src={imagePreview} alt="Uploaded face" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div className="scan-line" />
                    </div>
                    <div style={{ textAlign: 'left', minWidth: '200px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '15px', fontWeight: 700, color: '#f0f6ff' }}>
                          {imageFile?.name}
                        </span>
                        <CheckCircle size={15} color="#00c8b9" />
                      </div>
                      <div style={{ fontSize: '12px', color: '#8faac0', marginBottom: '10px' }}>
                        {imageFile && (imageFile.size / 1024 / 1024).toFixed(2)} MB · Ready for web reverse search
                      </div>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setImageFile(null);
                          setImagePreview(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.15)',
                          color: '#f0f6ff', borderRadius: '8px', padding: '5px 12px',
                          fontSize: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px'
                        }}
                      >
                        <RefreshCw size={12} /> Choose Different Photo
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{
                      width: '56px', height: '56px', borderRadius: '16px',
                      background: 'rgba(0,200,185,0.12)', border: '1px solid rgba(0,200,185,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00c8b9',
                      boxShadow: '0 0 20px rgba(0,200,185,0.15)'
                    }}>
                      <Upload size={26} />
                    </div>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: '#f0f6ff', marginBottom: '6px' }}>
                        Drop any photo here, or <span style={{ color: '#00c8b9', textDecoration: 'underline' }}>browse</span>
                      </div>
                      <div style={{ fontSize: '13px', color: '#8faac0' }}>
                        Supports JPG, PNG, WEBP · Max 15MB
                      </div>
                    </div>
                    <div style={{
                      display: 'flex', gap: '8px', marginTop: '4px', flexWrap: 'wrap', justifyContent: 'center'
                    }}>
                      <span style={{ fontSize: '11px', color: '#4e6a85', background: 'rgba(255,255,255,0.04)', padding: '2px 8px', borderRadius: '6px' }}>
                        Celebrity Photos
                      </span>
                      <span style={{ fontSize: '11px', color: '#4e6a85', background: 'rgba(255,255,255,0.04)', padding: '2px 8px', borderRadius: '6px' }}>
                        Social Media Pictures
                      </span>
                      <span style={{ fontSize: '11px', color: '#4e6a85', background: 'rgba(255,255,255,0.04)', padding: '2px 8px', borderRadius: '6px' }}>
                        Screenshots & Crops
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Optional Name/Hint input */}
              <div style={{ marginTop: '16px' }}>
                <input
                  type="text"
                  value={nameHint}
                  onChange={e => setNameHint(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && canSearch && handleSearch()}
                  placeholder="Optional: Name hint or context (leave blank to search photo directly)"
                  className="search-box"
                  style={{
                    fontSize: '14px',
                    padding: '12px 16px',
                    borderRadius: '10px'
                  }}
                />
              </div>

              {/* Primary Search Button */}
              <button
                onClick={handleSearch}
                disabled={disabled || !canSearch}
                className="btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  marginTop: '16px',
                  padding: '16px',
                  fontSize: '16px',
                  fontWeight: 700,
                  letterSpacing: '0.01em',
                  borderRadius: '12px',
                  boxShadow: canSearch ? '0 10px 30px rgba(0,200,185,0.35)' : 'none',
                  cursor: canSearch ? 'pointer' : 'not-allowed',
                  opacity: canSearch ? 1 : 0.6
                }}
              >
                <Search size={19} />
                {canSearch ? 'Search the Internet & Find Usernames' : 'Upload a Photo to Start'}
              </button>
            </div>

            {/* Bottom trust strip */}
            <div style={{
              borderTop: '1px solid rgba(255,255,255,0.05)',
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '24px',
              flexWrap: 'wrap',
              background: 'rgba(0,0,0,0.2)'
            }}>
              {[
                { icon: Shield, text: 'Secure & Encrypted' },
                { icon: Lock,   text: '100% Private' },
                { icon: CheckCircle, text: 'No Account Required' },
                { icon: Globe,  text: 'Global Web Search' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#4e6a85' }}>
                  <Icon size={13} color="#00c8b9" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST STATS BAR ===== */}
      <section style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(4, 13, 26, 0.7)',
        padding: '36px 24px'
      }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px', textAlign: 'center'
        }}>
          {TRUST_STATS.map(({ label, value, icon: Icon }) => (
            <div key={label} style={{ padding: '12px' }}>
              <div style={{
                fontSize: 'clamp(28px, 4vw, 38px)',
                fontWeight: 900,
                color: '#f0f6ff',
                fontFamily: 'var(--font-heading)',
                letterSpacing: '-0.03em',
                marginBottom: '4px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}>
                <Icon size={22} color="#00c8b9" />
                <span style={{
                  background: 'linear-gradient(90deg, #ffffff, #00c8b9)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  {value}
                </span>
              </div>
              <div style={{ fontSize: '13px', color: '#4e6a85', fontWeight: 500 }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section style={{ padding: '80px 24px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div className="trust-badge" style={{ marginBottom: '14px' }}>
            SIMPLE 3-STEP PROCESS
          </div>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 800, color: '#f0f6ff', letterSpacing: '-0.03em' }}>
            How FaceIdentify Works
          </h2>
          <p style={{ fontSize: '15px', color: '#8faac0', marginTop: '10px', maxWidth: '520px', margin: '10px auto 0' }}>
            From an unknown image to full public social profiles in under 5 seconds.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {HOW_IT_WORKS.map(({ step, title, desc, icon: Icon }, idx) => (
            <div
              key={step}
              className="glass-panel"
              style={{
                padding: '32px 28px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: 'rgba(0,200,185,0.1)', border: '1px solid rgba(0,200,185,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#00c8b9'
                }}>
                  <Icon size={22} />
                </div>
                <span style={{
                  fontSize: '28px', fontWeight: 900,
                  color: 'rgba(255,255,255,0.08)',
                  fontFamily: 'var(--font-heading)'
                }}>
                  {step}
                </span>
              </div>

              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#f0f6ff', marginBottom: '8px' }}>
                  {title}
                </h3>
                <p style={{ fontSize: '13px', color: '#8faac0', lineHeight: 1.65 }}>
                  {desc}
                </p>
              </div>

              {idx < 2 && (
                <div style={{
                  display: 'none', position: 'absolute', right: '-14px', top: '50%',
                  transform: 'translateY(-50%)', zIndex: 10, color: '#00c8b9'
                }}>
                  <ArrowRight size={20} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section style={{
        padding: '60px 24px 80px',
        background: 'rgba(0,0,0,0.15)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 800, color: '#f0f6ff', letterSpacing: '-0.03em' }}>
              Trusted Worldwide
            </h2>
            <p style={{ fontSize: '15px', color: '#8faac0', marginTop: '10px' }}>
              See why people rely on FaceIdentify every day
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {TESTIMONIALS.map(({ name, role, text, stars }) => (
              <div key={name} className="glass-panel" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', gap: '2px', marginBottom: '14px' }}>
                  {[...Array(stars)].map((_, i) => (
                    <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <p style={{ fontSize: '14px', color: '#8faac0', lineHeight: 1.65, fontStyle: 'italic', marginBottom: '16px' }}>
                  "{text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #00c8b9, #0090d6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '14px', fontWeight: 700, color: '#07111f'
                  }}>
                    {name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#f0f6ff' }}>{name}</div>
                    <div style={{ fontSize: '11px', color: '#4e6a85' }}>{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
