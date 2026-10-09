import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle, Sparkles, User, Tag, HelpCircle } from 'lucide-react';

export default function FaceUploader({ onStartSearch, disabled }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [nameHint, setNameHint] = useState('');
  const [validation, setValidation] = useState({
    formatValid: false,
    sizeValid: false,
    aspectValid: false,
    faceReady: false
  });
  const fileInputRef = useRef(null);

  const cleanFilenameToName = (filename) => {
    if (!filename) return '';
    const base = filename.replace(/\.[^/.]+$/, '');
    const generic = /^(?:img|dsc|dcm|screenshot|whatsapp|unnamed|download|image|photo|face|pic|frame)[\s_\-\d\(\)\.]*$/i;
    if (generic.test(base)) return '';
    const splitCamel = base.replace(/([a-z])([A-Z])/g, '$1 $2');
    const cleaned = splitCamel.replace(/[_\-+.]+/g, ' ')
      .replace(/\b(?:photo|pic|image|screenshot|wallpaper|hd|4k|1080p|1080x1080|crop|thumb|profile)\b/gi, '')
      .replace(/\d{4}/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    return cleaned.length >= 2 ? cleaned.replace(/\b\w/g, c => c.toUpperCase()) : '';
  };

  const handleFile = (file) => {
    if (!file) return;

    const isFormatOk = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type);
    const isSizeOk = file.size <= 10 * 1024 * 1024; // 10MB

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Auto-populate name hint if filename has a detectable person name
    const detectedName = cleanFilenameToName(file.name);
    if (detectedName && !nameHint) {
      setNameHint(detectedName);
    }

    setValidation({
      formatValid: isFormatOk,
      sizeValid: isSizeOk,
      aspectValid: true,
      faceReady: isFormatOk && isSizeOk
    });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setNameHint('');
    setValidation({ formatValid: false, sizeValid: false, aspectValid: false, faceReady: false });
  };

  const handleSubmit = () => {
    if (selectedFile && validation.faceReady) {
      onStartSearch(selectedFile, nameHint);
    }
  };

  const quickSamples = ['Sachin Tendulkar', 'Sundar Pichai', 'Elon Musk', 'Cristiano Ronaldo', 'Taylor Swift', 'Sam Altman'];

  return (
    <div style={{ width: '100%', maxWidth: '640px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#f8fafc' }}>
            Upload Person Image
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
            Upload any face portrait to discover real social profiles across Instagram, LinkedIn, X, and GitHub
          </p>
        </div>

        {/* Dropzone container */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => !previewUrl && fileInputRef.current.click()}
          style={{
            position: 'relative',
            minHeight: '200px',
            borderRadius: '14px',
            border: `2px dashed ${dragActive ? '#6366f1' : 'rgba(255, 255, 255, 0.15)'}`,
            background: dragActive ? 'rgba(99, 102, 241, 0.08)' : 'rgba(15, 23, 42, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            cursor: previewUrl ? 'default' : 'pointer',
            transition: 'all 0.2s ease',
            overflow: 'hidden'
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            style={{ display: 'none' }}
            onChange={e => handleFile(e.target.files[0])}
          />

          {previewUrl ? (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
              <div style={{
                position: 'relative',
                width: '130px',
                height: '130px',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)',
                border: '2px solid var(--accent-primary)'
              }}>
                <img src={previewUrl} alt="Target face preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div className="scan-line" />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc' }}>{selectedFile.name}</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
              </div>
              <button
                type="button"
                onClick={e => { e.stopPropagation(); handleClear(); }}
                className="btn-secondary"
                style={{ fontSize: '12px', padding: '5px 12px' }}
              >
                Change Image
              </button>
            </div>
          ) : (
            <>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px',
                color: '#6366f1'
              }}>
                <UploadCloud size={26} />
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>
                Drag & Drop face image here or <span style={{ color: '#8b5cf6' }}>Browse</span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                Supports JPG, PNG, WEBP (Max 10 MB)
              </div>
            </>
          )}
        </div>

        {/* Optional Person Name / Search Clue Input */}
        <div style={{ marginTop: '18px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
            fontWeight: 600,
            color: '#94a3b8',
            marginBottom: '6px'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={14} color="#a5b4fc" />
              Person Name / Search Clue <span style={{ color: '#64748b', fontWeight: 400 }}>(Optional)</span>
            </span>
          </label>
          <input
            type="text"
            value={nameHint}
            onChange={e => setNameHint(e.target.value)}
            placeholder="e.g. Sundar Pichai, Elon Musk, Taylor Swift..."
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              background: 'rgba(15, 23, 42, 0.6)',
              color: '#f8fafc',
              fontSize: '13px',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = '#6366f1'}
            onBlur={e => e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)'}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Tag size={11} /> Quick suggestions:
            </span>
            {quickSamples.map(sample => (
              <button
                key={sample}
                type="button"
                onClick={() => setNameHint(sample)}
                style={{
                  background: nameHint === sample ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${nameHint === sample ? 'rgba(99, 102, 241, 0.5)' : 'rgba(255, 255, 255, 0.08)'}`,
                  color: nameHint === sample ? '#a5b4fc' : '#94a3b8',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        {/* Validation Checklist */}
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          background: 'rgba(255,255,255,0.02)',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.06)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: validation.formatValid ? '#10b981' : '#64748b' }}>
              <CheckCircle size={14} color={validation.formatValid ? '#10b981' : '#475569'} />
              <span>Valid Image Format</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: validation.sizeValid ? '#10b981' : '#64748b' }}>
              <CheckCircle size={14} color={validation.sizeValid ? '#10b981' : '#475569'} />
              <span>Size Under 10 MB</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: validation.faceReady ? '#10b981' : '#64748b' }}>
              <CheckCircle size={14} color={validation.faceReady ? '#10b981' : '#475569'} />
              <span>InsightFace Ready</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981' }}>
              <CheckCircle size={14} color="#10b981" />
              <span>Free — Live Indexing</span>
            </div>
          </div>
        </div>

        {/* Start Search Action */}
        <button
          onClick={handleSubmit}
          disabled={disabled || !selectedFile || !validation.faceReady}
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', marginTop: '18px', padding: '13px', fontSize: '14px' }}
        >
          <Sparkles size={17} />
          Discover Real Profiles
        </button>
      </div>
    </div>
  );
}
