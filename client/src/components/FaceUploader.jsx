import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle, AlertTriangle, Image as ImageIcon, Sparkles, FileText } from 'lucide-react';

export default function FaceUploader({ onStartSearch, disabled, onOpenAuth, isAuthenticated }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [validation, setValidation] = useState({
    formatValid: false,
    sizeValid: false,
    aspectValid: false,
    faceReady: false
  });
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;

    const isFormatOk = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type);
    const isSizeOk = file.size <= 10 * 1024 * 1024; // 10MB

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

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
    setValidation({ formatValid: false, sizeValid: false, aspectValid: false, faceReady: false });
  };

  const handleSubmit = () => {
    if (!isAuthenticated) {
      onOpenAuth();
      return;
    }
    if (selectedFile && validation.faceReady) {
      onStartSearch(selectedFile);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '640px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#f8fafc' }}>
            Upload Person Image
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
            Select a clear portrait containing a single visible face for InsightFace + ArcFace analysis
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
            minHeight: '220px',
            borderRadius: '14px',
            border: `2px dashed ${dragActive ? '#6366f1' : 'rgba(255, 255, 255, 0.15)'}`,
            background: dragActive ? 'rgba(99, 102, 241, 0.08)' : 'rgba(15, 23, 42, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            cursor: previewUrl ? 'default' : 'pointer',
            transition: 'all 0.2s ease',
            overflow: 'hidden'
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            style={{ display: 'none' }}
            onChange={e => handleFile(e.target.files[0])}
          />

          {previewUrl ? (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{
                position: 'relative',
                width: '140px',
                height: '140px',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)',
                border: '2px solid var(--accent-primary)'
              }}>
                <img src={previewUrl} alt="Target face preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div className="scan-line" />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>{selectedFile.name}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
              </div>
              <button
                type="button"
                onClick={e => { e.stopPropagation(); handleClear(); }}
                className="btn-secondary"
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                Change Image
              </button>
            </div>
          ) : (
            <>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px',
                color: '#6366f1'
              }}>
                <UploadCloud size={28} />
              </div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#f8fafc' }}>
                Drag & Drop face image here or <span style={{ color: '#8b5cf6' }}>Browse</span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>
                Supports JPG, PNG, WEBP (Max 10 MB)
              </div>
            </>
          )}
        </div>

        {/* Validation Checklist */}
        <div style={{
          marginTop: '20px',
          padding: '14px 18px',
          background: 'rgba(255,255,255,0.02)',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.06)'
        }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
            Pre-flight Validation Checks
          </div>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isAuthenticated ? '#10b981' : '#f59e0b' }}>
              <CheckCircle size={14} color={isAuthenticated ? '#10b981' : '#f59e0b'} />
              <span>{isAuthenticated ? 'Session Authenticated' : 'Auth Required'}</span>
            </div>
          </div>
        </div>

        {/* Start Search Action */}
        <button
          onClick={handleSubmit}
          disabled={disabled || !selectedFile || !validation.faceReady}
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', marginTop: '20px', padding: '14px', fontSize: '15px' }}
        >
          <Sparkles size={18} />
          {isAuthenticated ? 'Discover Candidate Profiles' : 'Sign In & Start Search'}
        </button>
      </div>
    </div>
  );
}
