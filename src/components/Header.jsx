import React from 'react';
import { Download, Box, Info, Sparkles, Globe } from 'lucide-react';
import { LANGUAGES } from '../i18n/translations';

export default function Header({
  presetId,
  onExport3MF,
  onExportSTL,
  isGenerating,
  onOpenInfo,
  lang,
  setLang,
  t
}) {
  const requires3MF = presetId === 'ironing' || presetId === 'fuzzy';

  const handleSTLClick = () => {
    if (requires3MF) {
      alert(t.stlModifierDisabledHint);
      return;
    }
    onExportSTL();
  };
  return (
    <header className="glass-panel" style={{
      height: '56px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      borderBottom: '1px solid var(--border)',
      zIndex: 20
    }}>
      {/* Left: Branding */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #00ae42 0%, #06b6d4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(0, 174, 66, 0.4)'
        }}>
          <Box size={20} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 700, fontSize: '15px', letterSpacing: '-0.2px' }}>
              {t.appTitle}
            </span>
            <span style={{
              fontSize: '10px',
              fontWeight: 600,
              background: 'rgba(0, 174, 66, 0.15)',
              color: 'var(--bambu-green)',
              padding: '2px 6px',
              borderRadius: '4px',
              border: '1px solid rgba(0, 174, 66, 0.3)'
            }}>
              {t.bblTag}
            </span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {t.appSubtitle}
          </div>
        </div>
      </div>

      {/* Right: Language Selector & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Language Selector Dropdown */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'var(--bg-secondary)',
          padding: '4px 8px',
          borderRadius: '6px',
          border: '1px solid var(--border)'
        }}>
          <Globe size={14} color="#00ae42" />
          <select
            value={lang}
            onChange={e => setLang(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-main)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            {LANGUAGES.map(l => (
              <option key={l.code} value={l.code} style={{ background: '#161922', color: '#ffffff' }}>
                {l.flag} {l.name}
              </option>
            ))}
          </select>
        </div>

        <button
          className="btn-secondary"
          onClick={handleSTLClick}
          disabled={isGenerating}
          aria-disabled={isGenerating || requires3MF}
          style={requires3MF ? { opacity: 0.45, cursor: 'not-allowed' } : undefined}
          title={requires3MF ? t.stlModifierDisabledHint : t.exportSTL}
        >
          <Download size={14} />
          <span>{t.exportSTL}</span>
        </button>

        <button
          className="btn-primary"
          onClick={onExport3MF}
          disabled={isGenerating}
          style={{ minWidth: '150px', justifyContent: 'center' }}
          title={t.export3MF}
        >
          {isGenerating ? (
            <span>{t.generating}</span>
          ) : (
            <>
              <Sparkles size={15} />
              <span>{t.export3MF}</span>
            </>
          )}
        </button>

        <button
          className="btn-secondary"
          onClick={onOpenInfo}
          style={{ padding: '8px 10px' }}
          title={t.guideSpecs}
        >
          <Info size={16} />
        </button>
      </div>
    </header>
  );
}
