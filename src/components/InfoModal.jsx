import React from 'react';
import { X, CheckCircle, ShieldCheck, Terminal } from 'lucide-react';

export default function InfoModal({ isOpen, onClose, t }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(44, 42, 41, 0.45)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '640px',
        maxHeight: '85vh',
        overflowY: 'auto',
        borderRadius: '12px',
        padding: '24px',
        position: 'relative',
        background: '#F7F5F0',
        boxShadow: '0 20px 40px rgba(44, 42, 41, 0.16)'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
          <ShieldCheck size={20} color="#3D6B52" />
          {t.infoTitle}
        </h2>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '18px', lineHeight: '1.5' }}>
          {t.infoSubtitle}
        </p>

        {/* Features list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
          <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#3D6B52', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={15} />
              {t.infoFeature1Title}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              {t.infoFeature1Desc}
            </div>
          </div>

          <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#3B6275', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={15} />
              {t.infoFeature2Title}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              {t.infoFeature2Desc}
            </div>
          </div>

          <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#9E6240', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={15} />
              {t.infoFeature3Title}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              {t.infoFeature3Desc}
            </div>
          </div>
        </div>

        {/* Verification Command Info */}
        <div style={{ background: '#2C2A29', padding: '12px', borderRadius: '8px', border: '1px solid #44403C' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#D6D3CD', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Terminal size={13} />
            {t.cliVerifyTitle}
          </div>
          <pre className="code-font" style={{ fontSize: '11px', color: '#A7D7BC', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            /Applications/BambuStudio.app/Contents/MacOS/BambuStudio --slice 0 --outputdir /tmp/verify your_model.3mf
          </pre>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-primary" onClick={onClose}>
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
