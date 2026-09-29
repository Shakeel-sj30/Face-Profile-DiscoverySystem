import React, { useEffect, useState } from 'react';
import { Cpu, CheckCircle2, Loader2, Sparkles, Database, Search as SearchIcon, ShieldCheck } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Server Validation', detail: 'Verifying MIME header, file size limits & session token', icon: ShieldCheck },
  { id: 2, label: 'Face Detection & Landmark Alignment', detail: 'OpenCV Haar cascade multi-scale detection & eye position normalization', icon: Cpu },
  { id: 3, label: 'ArcFace 512d Embedding', detail: 'PyTorch deep ResNet feature extraction with L2 normalization', icon: Sparkles },
  { id: 4, label: 'Permitted Source Candidate Discovery', detail: 'Querying public profile directories (Instagram, LinkedIn, X, GitHub)', icon: Database },
  { id: 5, label: 'Cosine Similarity & Ranking', detail: 'Comparing 512d query embedding against candidate embeddings', icon: SearchIcon }
];

export default function SearchProgress() {
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep(prev => (prev < 5 ? prev + 1 : prev));
    }, 450);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: '640px', margin: '0 auto' }}>
      <div className="glass-panel glass-panel-glow" style={{ padding: '32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: 'rgba(99, 102, 241, 0.2)',
            border: '1px solid rgba(99, 102, 241, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            color: '#6366f1'
          }}>
            <Loader2 size={26} className="spin" style={{ animation: 'spin 1.5s linear infinite' }} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#f8fafc' }}>
            Processing Face Profile Search
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
            Running multi-layer InsightFace + ArcFace discovery workflow...
          </p>
        </div>

        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;

            return (
              <div
                key={step.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: isCurrent ? 'rgba(99, 102, 241, 0.12)' : (isCompleted ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255, 255, 255, 0.02)'),
                  border: `1px solid ${isCurrent ? 'rgba(99, 102, 241, 0.4)' : (isCompleted ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)')}`,
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ marginTop: '2px' }}>
                  {isCompleted ? (
                    <CheckCircle2 size={20} color="#10b981" />
                  ) : isCurrent ? (
                    <Loader2 size={20} color="#6366f1" style={{ animation: 'spin 1.2s linear infinite' }} />
                  ) : (
                    <Icon size={20} color="#475569" />
                  )}
                </div>
                <div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: isCompleted ? '#10b981' : (isCurrent ? '#f8fafc' : '#64748b')
                  }}>
                    {step.label}
                  </div>
                  <div style={{ fontSize: '12px', color: isCurrent ? '#94a3b8' : '#475569', marginTop: '2px' }}>
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
