import React, { useState } from 'react';
import { X, Heart, Rocket, ExternalLink } from 'lucide-react';

export const MAKERWORLD_MODEL_URL = 'https://makerworld.com/zh-tw/models/3588451-customizable-open-source-filament-swatch-and-calib#profileId-4109805';

export default function SupportModal({ isOpen, onClose, t }) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('hideMakerWorldSupportModal', 'true');
    }
    onClose();
  };

  const handleGoToMakerWorld = () => {
    if (dontShowAgain) {
      localStorage.setItem('hideMakerWorldSupportModal', 'true');
    }
    window.open(MAKERWORLD_MODEL_URL, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(44, 42, 41, 0.48)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 110,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '480px',
        borderRadius: '16px',
        padding: '28px 24px 22px',
        position: 'relative',
        boxShadow: '0 24px 48px -12px rgba(44, 42, 41, 0.18), 0 0 0 1px rgba(61, 107, 82, 0.18)',
        textAlign: 'center',
        border: '1px solid var(--border)',
        background: 'linear-gradient(180deg, #FAF8F5 0%, #F2EFE9 100%)'
      }}>
        {/* Close Button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(44, 42, 41, 0.06)',
            border: 'none',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
          title="Close"
        >
          <X size={16} />
        </button>

        {/* Fun Animated / Highlighted Icon Header */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'rgba(61, 107, 82, 0.1)',
          border: '1px solid rgba(61, 107, 82, 0.25)',
          marginBottom: '16px',
          boxShadow: '0 4px 12px rgba(61, 107, 82, 0.12)'
        }}>
          <Rocket size={26} color="var(--bambu-green)" />
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '18px',
          fontWeight: 800,
          marginBottom: '6px',
          color: 'var(--text-main)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <span>{t.supportModalTitle || '🎉 3MF 檔案下載完成囉！'}</span>
        </h3>

        <div style={{
          fontSize: '12px',
          fontWeight: 600,
          color: 'var(--bambu-green)',
          marginBottom: '14px',
          letterSpacing: '0.3px'
        }}>
          {t.supportModalSubtitle || '喜歡這個開源色票與校準小工具嗎？'}
        </div>

        {/* Playful description */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          padding: '14px 16px',
          fontSize: '13px',
          color: '#4A4642',
          lineHeight: '1.6',
          marginBottom: '20px',
          textAlign: 'left',
          whiteSpace: 'pre-line'
        }}>
          {t.supportModalMsg || '這是花了好幾個夜晚精心調校的拓竹專屬開源作品～(｡•̀ᴗ-)✧\n如果它幫你省下了線材、印出了漂亮的卡片，求求到 MakerWorld 幫我點個「❤️ 喜歡」或投一張「🚀 Boost 助力票」支持一下作者吧！每一個小愛心都是我繼續維護的滿滿動力！(๑•̀ㅂ•́)و✧'}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
          <button
            onClick={handleGoToMakerWorld}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #3D6B52 0%, #2F5640 100%)',
              color: '#FAF8F5',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(61, 107, 82, 0.28)',
              transition: 'all 0.2s ease'
            }}
          >
            <Heart size={16} fill="#FAF8F5" />
            <span>{t.supportModalBoostBtn || '🚀 前往 MakerWorld 點讚 & Boost！'}</span>
            <ExternalLink size={14} style={{ opacity: 0.85 }} />
          </button>

          <button
            onClick={handleClose}
            style={{
              width: '100%',
              padding: '9px 16px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: '#FFFFFF',
              color: 'var(--text-muted)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {t.supportModalLaterBtn || '好啦～先去列印！'}
          </button>
        </div>

        {/* Don't show again checkbox */}
        <label style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '7px',
          fontSize: '11px',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          userSelect: 'none'
        }}>
          <input
            type="checkbox"
            checked={dontShowAgain}
            onChange={e => setDontShowAgain(e.target.checked)}
            style={{ accentColor: '#3D6B52', cursor: 'pointer' }}
          />
          <span>{t.supportModalDontShow || '不再顯示此提示'}</span>
        </label>
      </div>
    </div>
  );
}
