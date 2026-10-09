import React, { useEffect, useState } from 'react';
import { Cpu, CheckCircle2, Loader2, Sparkles, Database, Search, ShieldCheck, Globe } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Validating Request',         detail: 'Verifying file integrity, session & security tokens',         icon: ShieldCheck },
  { id: 2, label: 'Face Detection & Alignment',  detail: 'OpenCV multi-scale detection + eye landmark normalization',   icon: Cpu },
  { id: 3, label: 'ArcFace 512-D Embedding',     detail: 'Deep ResNet feature extraction with L2 normalization',       icon: Sparkles },
  { id: 4, label: 'Cross-Platform Discovery',    detail: 'Querying Instagram, LinkedIn, X, GitHub, Facebook & more',   icon: Globe },
  { id: 5, label: 'Ranking & Confidence Scoring',detail: 'Cosine similarity comparison + confidence level assignment', icon: Search },
];

export default function SearchProgress() {
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep(prev => (prev < 5 ? prev + 1 : prev));
    }, 500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setProgress(Math.min(((currentStep - 1) / 4) * 100, 100));
  }, [currentStep]);

  return (
    <div style={{ width: '100%', maxWidth: '680px', margin: '60px auto 0' }}>
      <div className="glass-panel glass-panel-glow" style={{ padding: '36px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '60px', height: '60px', borderRadius: '50%',
            background: 'rgba(0,200,185,0.12)',
            border: '1px solid rgba(0,200,185,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            color: '#00c8b9',
            animation: 'pulse-glow 2s infinite'
          }}>
            <style>{`
              @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
              @keyframes pulse-glow {
                0%, 100% { box-shadow: 0 0 20px rgba(0,200,185,0.2); }
                50% { box-shadow: 0 0 40px rgba(0,200,185,0.5); }
              }
            `}</style>
            <Loader2 size={28} style={{ animation: 'spin 1.4s linear infinite' }} />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#f0f6ff', marginBottom: '6px' }}>
            Scanning the Web...
          </h2>
          <p style={{ fontSize: '14px', color: '#8faac0' }}>
            Our AI is searching 120+ platforms for matching profiles
          </p>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#4e6a85', marginBottom: '8px' }}>
            <span>Search Progress</span>
            <span style={{ color: '#00c8b9', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
              {Math.round(progress)}%
            </span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              width: `${progress}%`, height: '100%',
              background: 'linear-gradient(90deg, #00c8b9, #0090d6)',
              borderRadius: '3px',
              transition: 'width 0.5s ease',
              boxShadow: '0 0 8px rgba(0,200,185,0.5)'
            }} />
          </div>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {STEPS.map(step => {
            const Icon = step.icon;
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;

            return (
              <div
                key={step.id}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '14px',
                  padding: '12px 16px', borderRadius: '12px',
                  background: isCurrent
                    ? 'rgba(0,200,185,0.08)'
                    : isCompleted
                      ? 'rgba(16,185,129,0.04)'
                      : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${
                    isCurrent ? 'rgba(0,200,185,0.3)' :
                    isCompleted ? 'rgba(16,185,129,0.15)' :
                    'rgba(255,255,255,0.05)'
                  }`,
                  transition: 'all 0.35s ease'
                }}
              >
                <div style={{ marginTop: '2px', flexShrink: 0 }}>
                  {isCompleted
                    ? <CheckCircle2 size={20} color="#10b981" />
                    : isCurrent
                      ? <Loader2 size={20} color="#00c8b9" style={{ animation: 'spin 1.2s linear infinite' }} />
                      : <Icon size={20} color="#1e3a5f" />
                  }
                </div>
                <div>
                  <div style={{
                    fontSize: '14px', fontWeight: 600,
                    color: isCompleted ? '#10b981' : isCurrent ? '#f0f6ff' : '#4e6a85'
                  }}>
                    {step.label}
                  </div>
                  <div style={{ fontSize: '12px', color: isCurrent ? '#8faac0' : '#1e3a5f', marginTop: '2px' }}>
                    {step.detail}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
