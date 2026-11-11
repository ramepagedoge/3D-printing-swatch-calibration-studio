import React from 'react';
import {
  MODEL_PRESETS,
  FILAMENT_BRANDS,
  MATERIAL_PROFILES,
  POPULAR_COLORS
} from '../constants/presets';
import {
  Sliders,
  Palette,
  Thermometer,
  Layers,
  Clock,
  Grid,
  CheckSquare,
  Square
} from 'lucide-react';

export default function ParameterPanel({
  presetId,
  setPresetId,
  params,
  updateParam,
  applyMaterialProfile,
  triCount,
  t
}) {
  return (
    <aside className="glass-panel" style={{
      width: '390px',
      height: 'calc(100vh - 56px)',
      borderLeft: '1px solid var(--border)',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      padding: '16px',
      zIndex: 10
    }}>
      {/* 1. Model Preset Selector */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '8px',
          color: 'var(--text-muted)',
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          <Layers size={13} color="#00ae42" />
          <span>{t.modelSelectTitle}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {MODEL_PRESETS.map(p => {
            const isSelected = p.id === presetId;
            const pInfo = t.presets?.[p.id] || p;
            return (
              <div
                key={p.id}
                onClick={() => setPresetId(p.id)}
                style={{
                  padding: '8px 10px',
                  borderRadius: '7px',
                  cursor: 'pointer',
                  border: isSelected ? '1px solid var(--bambu-green)' : '1px solid var(--border)',
                  background: isSelected ? 'rgba(0, 174, 66, 0.12)' : 'var(--bg-secondary)',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '2px'
                }}>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: isSelected ? 700 : 500,
                    color: isSelected ? '#ffffff' : 'var(--text-main)'
                  }}>
                    {pInfo.name}
                  </span>
                  {isSelected && (
                    <span style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      background: 'var(--bambu-green)'
                    }} />
                  )}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', lineHeight: '1.35' }}>
                  {pInfo.desc || p.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <hr style={{ borderColor: 'var(--border)', margin: '0' }} />

      {/* 2. Model-Specific Customizable Parameters (Dynamic per Preset) */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '10px',
          color: 'var(--text-muted)',
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          <Sliders size={13} color="#a855f7" />
          <span>{t.matrixParamsTitle} ({presetId.toUpperCase()})</span>
        </div>

        {/* --- SPECIFIC TO IRONING 4x5 MATRIX --- */}
        {presetId === 'ironing' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ background: 'var(--bg-secondary)', padding: '10px', borderRadius: '7px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#38bdf8', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Grid size={13} />
                <span>{t.ironingXTitle}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="slider-container">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: 'var(--text-muted)' }}>
                    <span>{t.minSpacing}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
                      <input
                        type="number" step="0.01" min="0.01" max="0.60"
                        value={params.ironingMinSpacing ?? 0.10}
                        onChange={e => updateParam('ironingMinSpacing', Number(e.target.value))}
                        className="input-field code-font"
                        style={{ width: '48px', padding: '1px 3px', fontSize: '11px', textAlign: 'right', height: '20px' }}
                      />
                      <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>mm</span>
                    </div>
                  </div>
                  <input
                    type="range" min="0.02" max="0.30" step="0.01"
                    value={params.ironingMinSpacing ?? 0.10}
                    onChange={e => updateParam('ironingMinSpacing', Number(e.target.value))}
                  />
                </div>
                <div className="slider-container">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: 'var(--text-muted)' }}>
                    <span>{t.maxSpacing}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
                      <input
                        type="number" step="0.01" min="0.05" max="1.00"
                        value={params.ironingMaxSpacing ?? 0.20}
                        onChange={e => updateParam('ironingMaxSpacing', Number(e.target.value))}
                        className="input-field code-font"
                        style={{ width: '48px', padding: '1px 3px', fontSize: '11px', textAlign: 'right', height: '20px' }}
                      />
                      <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>mm</span>
                    </div>
                  </div>
                  <input
                    type="range" min="0.10" max="0.60" step="0.01"
                    value={params.ironingMaxSpacing ?? 0.20}
                    onChange={e => updateParam('ironingMaxSpacing', Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '10px', borderRadius: '7px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#f59e0b', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Grid size={13} />
                <span>{t.ironingYTitle}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="slider-container">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: 'var(--text-muted)' }}>
                    <span>{t.minFlow}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
                      <input
                        type="number" step="1" min="0" max="80"
                        value={params.ironingMinFlow ?? 10}
                        onChange={e => updateParam('ironingMinFlow', Number(e.target.value))}
                        className="input-field code-font"
                        style={{ width: '44px', padding: '1px 3px', fontSize: '11px', textAlign: 'right', height: '20px' }}
                      />
                      <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>%</span>
                    </div>
                  </div>
                  <input
                    type="range" min="1" max="30" step="1"
                    value={params.ironingMinFlow ?? 10}
                    onChange={e => updateParam('ironingMinFlow', Number(e.target.value))}
                  />
                </div>
                <div className="slider-container">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: 'var(--text-muted)' }}>
                    <span>{t.maxFlow}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
                      <input
                        type="number" step="1" min="5" max="120"
                        value={params.ironingMaxFlow ?? 25}
                        onChange={e => updateParam('ironingMaxFlow', Number(e.target.value))}
                        className="input-field code-font"
                        style={{ width: '44px', padding: '1px 3px', fontSize: '11px', textAlign: 'right', height: '20px' }}
                      />
                      <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>%</span>
                    </div>
                  </div>
                  <input
                    type="range" min="10" max="80" step="1"
                    value={params.ironingMaxFlow ?? 25}
                    onChange={e => updateParam('ironingMaxFlow', Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            {/* Extrusion Flow Ratio for Ironing Calibration */}
            <div style={{ background: 'var(--bg-secondary)', padding: '10px', borderRadius: '7px', border: '1px solid var(--border)' }}>
              <div className="slider-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{t.flowRatio}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
                    <input
                      type="number" step="0.01" min="0.40" max="2.00"
                      value={params.flowRatio ?? 0.98}
                      onChange={e => updateParam('flowRatio', Number(e.target.value))}
                      className="input-field code-font"
                      style={{ width: '48px', padding: '1px 3px', fontSize: '11px', textAlign: 'right', height: '20px' }}
                    />
                  </div>
                </div>
                <input
                  type="range" min="0.60" max="1.40" step="0.01"
                  value={params.flowRatio ?? 0.98}
                  onChange={e => updateParam('flowRatio', Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        )}

        {/* --- SPECIFIC TO FUZZY SKIN VERTICAL MATRIX --- */}
        {presetId === 'fuzzy' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Noise Type Selector */}
            <div style={{ background: 'var(--bg-secondary)', padding: '10px', borderRadius: '7px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#10b981' }}>
                  {t.fuzzyNoiseTypeTitle}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                  5 Types
                </span>
              </div>
              <select
                value={params.fuzzyNoiseType ?? 'classic'}
                onChange={e => updateParam('fuzzyNoiseType', e.target.value)}
                className="select-field"
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  fontSize: '11px',
                  borderRadius: '5px',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer'
                }}
              >
                <option value="classic">{t.fuzzyNoiseClassic}</option>
                <option value="perlin">{t.fuzzyNoisePerlin}</option>
                <option value="billow">{t.fuzzyNoiseBillow}</option>
                <option value="ridgedmulti">{t.fuzzyNoiseRidged}</option>
                <option value="voronoi">{t.fuzzyNoiseVoronoi}</option>
              </select>

              {/* Informative description for selected noise type */}
              <div style={{
                marginTop: '8px',
                padding: '6px 8px',
                borderRadius: '4px',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                fontSize: '10px',
                lineHeight: '1.4',
                color: '#d1fae5'
              }}>
                {(params.fuzzyNoiseType === 'perlin') && t.fuzzyNoiseDescPerlin}
                {(params.fuzzyNoiseType === 'billow') && t.fuzzyNoiseDescBillow}
                {(params.fuzzyNoiseType === 'ridgedmulti') && t.fuzzyNoiseDescRidged}
                {(params.fuzzyNoiseType === 'voronoi') && t.fuzzyNoiseDescVoronoi}
                {(!params.fuzzyNoiseType || params.fuzzyNoiseType === 'classic') && t.fuzzyNoiseDescClassic}
              </div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '10px', borderRadius: '7px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#a855f7', marginBottom: '8px' }}>
                {t.fuzzyXTitle}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="slider-container">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: 'var(--text-muted)' }}>
                    <span>{t.minDistance}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
                      <input
                        type="number" step="0.05" min="0.01" max="3.00"
                        value={params.fuzzyMinDistance ?? 0.2}
                        onChange={e => updateParam('fuzzyMinDistance', Number(e.target.value))}
                        className="input-field code-font"
                        style={{ width: '48px', padding: '1px 3px', fontSize: '11px', textAlign: 'right', height: '20px' }}
                      />
                      <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>mm</span>
                    </div>
                  </div>
                  <input
                    type="range" min="0.05" max="1.50" step="0.05"
                    value={params.fuzzyMinDistance ?? 0.2}
                    onChange={e => updateParam('fuzzyMinDistance', Number(e.target.value))}
                  />
                </div>
                <div className="slider-container">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: 'var(--text-muted)' }}>
                    <span>{t.maxDistance}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
                      <input
                        type="number" step="0.05" min="0.10" max="5.00"
                        value={params.fuzzyMaxDistance ?? 0.8}
                        onChange={e => updateParam('fuzzyMaxDistance', Number(e.target.value))}
                        className="input-field code-font"
                        style={{ width: '48px', padding: '1px 3px', fontSize: '11px', textAlign: 'right', height: '20px' }}
                      />
                      <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>mm</span>
                    </div>
                  </div>
                  <input
                    type="range" min="0.20" max="3.00" step="0.05"
                    value={params.fuzzyMaxDistance ?? 0.8}
                    onChange={e => updateParam('fuzzyMaxDistance', Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '10px', borderRadius: '7px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#3b82f6', marginBottom: '8px' }}>
                {t.fuzzyYTitle}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="slider-container">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: 'var(--text-muted)' }}>
                    <span>{t.minThickness}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
                      <input
                        type="number" step="0.02" min="0.01" max="1.50"
                        value={params.fuzzyMinThickness ?? 0.1}
                        onChange={e => updateParam('fuzzyMinThickness', Number(e.target.value))}
                        className="input-field code-font"
                        style={{ width: '48px', padding: '1px 3px', fontSize: '11px', textAlign: 'right', height: '20px' }}
                      />
                      <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>mm</span>
                    </div>
                  </div>
                  <input
                    type="range" min="0.02" max="0.60" step="0.02"
                    value={params.fuzzyMinThickness ?? 0.1}
                    onChange={e => updateParam('fuzzyMinThickness', Number(e.target.value))}
                  />
                </div>
                <div className="slider-container">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: 'var(--text-muted)' }}>
                    <span>{t.maxThickness}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
                      <input
                        type="number" step="0.05" min="0.05" max="3.00"
                        value={params.fuzzyMaxThickness ?? 0.4}
                        onChange={e => updateParam('fuzzyMaxThickness', Number(e.target.value))}
                        className="input-field code-font"
                        style={{ width: '48px', padding: '1px 3px', fontSize: '11px', textAlign: 'right', height: '20px' }}
                      />
                      <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>mm</span>
                    </div>
                  </div>
                  <input
                    type="range" min="0.10" max="1.50" step="0.05"
                    value={params.fuzzyMaxThickness ?? 0.4}
                    onChange={e => updateParam('fuzzyMaxThickness', Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- SPECIFIC TO TOLERANCE CLEARANCE MATRIX --- */}
        {presetId === 'tolerance' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ background: 'var(--bg-secondary)', padding: '10px', borderRadius: '7px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#10b981', marginBottom: '8px' }}>
                {t.toleranceYTitle}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div className="slider-container">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '9px', color: 'var(--text-muted)' }}>
                    <span>{t.row1Small}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
                      <span style={{ fontSize: '9px' }}>Ø</span>
                      <input
                        type="number" step="0.1" min="0.5" max="6.0"
                        value={params.toleranceDia1 ?? 3.0}
                        onChange={e => updateParam('toleranceDia1', Number(e.target.value))}
                        className="input-field code-font"
                        style={{ width: '42px', padding: '1px 2px', fontSize: '10px', textAlign: 'right', height: '18px' }}
                      />
                      <span style={{ fontSize: '9px' }}>mm</span>
                    </div>
                  </div>
                  <input
                    type="range" min="1.0" max="4.0" step="0.2"
                    value={params.toleranceDia1 ?? 3.0}
                    onChange={e => updateParam('toleranceDia1', Number(e.target.value))}
                  />
                </div>
                <div className="slider-container">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '9px', color: 'var(--text-muted)' }}>
                    <span>{t.row2MedSm}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
                      <span style={{ fontSize: '9px' }}>Ø</span>
                      <input
                        type="number" step="0.1" min="1.0" max="8.0"
                        value={params.toleranceDia2 ?? 4.5}
                        onChange={e => updateParam('toleranceDia2', Number(e.target.value))}
                        className="input-field code-font"
                        style={{ width: '42px', padding: '1px 2px', fontSize: '10px', textAlign: 'right', height: '18px' }}
                      />
                      <span style={{ fontSize: '9px' }}>mm</span>
                    </div>
                  </div>
                  <input
                    type="range" min="2.0" max="6.0" step="0.2"
                    value={params.toleranceDia2 ?? 4.5}
                    onChange={e => updateParam('toleranceDia2', Number(e.target.value))}
                  />
                </div>
                <div className="slider-container">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '9px', color: 'var(--text-muted)' }}>
                    <span>{t.row3MedLg}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
                      <span style={{ fontSize: '9px' }}>Ø</span>
                      <input
                        type="number" step="0.1" min="2.0" max="10.0"
                        value={params.toleranceDia3 ?? 6.0}
                        onChange={e => updateParam('toleranceDia3', Number(e.target.value))}
                        className="input-field code-font"
                        style={{ width: '42px', padding: '1px 2px', fontSize: '10px', textAlign: 'right', height: '18px' }}
                      />
                      <span style={{ fontSize: '9px' }}>mm</span>
                    </div>
                  </div>
                  <input
                    type="range" min="4.0" max="8.0" step="0.2"
                    value={params.toleranceDia3 ?? 6.0}
                    onChange={e => updateParam('toleranceDia3', Number(e.target.value))}
                  />
                </div>
                <div className="slider-container">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '9px', color: 'var(--text-muted)' }}>
                    <span>{t.row4Large}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
                      <span style={{ fontSize: '9px' }}>Ø</span>
                      <input
                        type="number" step="0.1" min="3.0" max="12.0"
                        value={params.toleranceDia4 ?? 7.5}
                        onChange={e => updateParam('toleranceDia4', Number(e.target.value))}
                        className="input-field code-font"
                        style={{ width: '42px', padding: '1px 2px', fontSize: '10px', textAlign: 'right', height: '18px' }}
                      />
                      <span style={{ fontSize: '9px' }}>mm</span>
                    </div>
                  </div>
                  <input
                    type="range" min="5.0" max="10.0" step="0.2"
                    value={params.toleranceDia4 ?? 7.5}
                    onChange={e => updateParam('toleranceDia4', Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                {t.toleranceXTitle}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
                {(params.clearances || [0.10, 0.15, 0.20, 0.25, 0.30]).map((c, idx) => (
                  <div key={idx} style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'block' }}>{t.colLabel} {idx + 1}</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0.00"
                      max="0.80"
                      className="input-field code-font"
                      style={{ padding: '4px 2px', fontSize: '11px', textAlign: 'center' }}
                      value={c}
                      onChange={e => {
                        const newCl = [...(params.clearances || [0.10, 0.15, 0.20, 0.25, 0.30])];
                        newCl[idx] = Number(e.target.value);
                        updateParam('clearances', newCl);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- SPECIFIC TO BRIDGE CARD --- */}
        {presetId === 'bridge' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="slider-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: 'var(--text-muted)' }}>
                  <span>{t.minSpan}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
                    <input
                      type="number" step="1" min="1" max="40"
                      value={params.bridgeMinSpan ?? 10}
                      onChange={e => updateParam('bridgeMinSpan', Number(e.target.value))}
                      className="input-field code-font"
                      style={{ width: '44px', padding: '1px 3px', fontSize: '11px', textAlign: 'right', height: '20px' }}
                    />
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>mm</span>
                  </div>
                </div>
                <input
                  type="range" min="2" max="35" step="1"
                  value={params.bridgeMinSpan ?? 10}
                  onChange={e => updateParam('bridgeMinSpan', Number(e.target.value))}
                />
              </div>

              <div className="slider-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: 'var(--text-muted)' }}>
                  <span>{t.maxSpan}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
                    <input
                      type="number" step="1" min="10" max="70"
                      value={params.bridgeMaxSpan ?? 50}
                      onChange={e => updateParam('bridgeMaxSpan', Number(e.target.value))}
                      className="input-field code-font"
                      style={{ width: '44px', padding: '1px 3px', fontSize: '11px', textAlign: 'right', height: '20px' }}
                    />
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>mm</span>
                  </div>
                </div>
                <input
                  type="range" min="15" max="65" step="1"
                  value={params.bridgeMaxSpan ?? 50}
                  onChange={e => updateParam('bridgeMaxSpan', Number(e.target.value))}
                />
              </div>
            </div>

            <div className="slider-container">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: 'var(--text-muted)' }}>
                <span>{t.pillarHeight}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
                  <input
                    type="number" step="0.5" min="1" max="25"
                    value={params.bridgePillarHeight ?? 7}
                    onChange={e => updateParam('bridgePillarHeight', Number(e.target.value))}
                    className="input-field code-font"
                    style={{ width: '44px', padding: '1px 3px', fontSize: '11px', textAlign: 'right', height: '20px' }}
                  />
                  <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>mm</span>
                </div>
              </div>
              <input
                type="range" min="2" max="18" step="0.5"
                value={params.bridgePillarHeight ?? 7}
                onChange={e => updateParam('bridgePillarHeight', Number(e.target.value))}
              />
            </div>

            {/* Bridge Speed & Bridge Flow Ratio for Bridge Calibration */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="slider-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{t.bridgeSpeed}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
                    <input
                      type="number" step="5" min="5" max="350"
                      value={params.bridgeSpeed ?? 50}
                      onChange={e => updateParam('bridgeSpeed', Number(e.target.value))}
                      className="input-field code-font"
                      style={{ width: '44px', padding: '1px 3px', fontSize: '11px', textAlign: 'right', height: '20px' }}
                    />
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>mm/s</span>
                  </div>
                </div>
                <input
                  type="range" min="10" max="250" step="5"
                  value={params.bridgeSpeed ?? 50}
                  onChange={e => updateParam('bridgeSpeed', Number(e.target.value))}
                />
              </div>

              <div className="slider-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{t.bridgeFlow}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
                    <input
                      type="number" step="0.01" min="0.20" max="2.00"
                      value={params.bridgeFlow ?? 0.95}
                      onChange={e => updateParam('bridgeFlow', Number(e.target.value))}
                      className="input-field code-font"
                      style={{ width: '48px', padding: '1px 3px', fontSize: '11px', textAlign: 'right', height: '20px' }}
                    />
                  </div>
                </div>
                <input
                  type="range" min="0.50" max="1.50" step="0.01"
                  value={params.bridgeFlow ?? 0.95}
                  onChange={e => updateParam('bridgeFlow', Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        )}

        {/* --- SPECIFIC TO SWATCH CARD --- */}
        {presetId === 'swatch' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t.translucentSteps}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
              {(params.translucentSteps || [0.2, 0.4, 0.6, 0.8, 1.0]).map((stepVal, idx) => (
                <div key={idx} style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'block' }}>{t.stepLabel} {idx + 1}</span>
                  <input
                    type="number"
                    step="0.02"
                    min="0.04"
                    max="2.40"
                    className="input-field code-font"
                    style={{ padding: '4px 2px', fontSize: '11px', textAlign: 'center' }}
                    value={stepVal}
                    onChange={e => {
                      const newSt = [...(params.translucentSteps || [0.2, 0.4, 0.6, 0.8, 1.0])];
                      newSt[idx] = Number(e.target.value);
                      updateParam('translucentSteps', newSt);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hanging Hole Toggle */}
        <div
          onClick={() => updateParam('includeHole', params.includeHole === false ? true : false)}
          style={{
            marginTop: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '11px',
            cursor: 'pointer',
            color: 'var(--text-muted)'
          }}
        >
          {params.includeHole !== false ? (
            <CheckSquare size={15} color="var(--bambu-green)" />
          ) : (
            <Square size={15} />
          )}
          <span>{t.includeHole}</span>
        </div>
      </div>

      <hr style={{ borderColor: 'var(--border)', margin: '0' }} />

      {/* 3. Filament & Material Information */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '8px',
          color: 'var(--text-muted)',
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          <Palette size={13} color="#06b6d4" />
          <span>{t.filamentSection}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
          <div>
            <label style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
              {t.brand}
            </label>
            <select
              className="input-field"
              value={params.brand}
              onChange={e => updateParam('brand', e.target.value)}
            >
              {FILAMENT_BRANDS.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
              {t.materialProfile}
            </label>
            <select
              className="input-field"
              value={params.material}
              onChange={e => {
                const mat = MATERIAL_PROFILES.find(m => m.name === e.target.value);
                if (mat) applyMaterialProfile(mat);
                else updateParam('material', e.target.value);
              }}
            >
              {MATERIAL_PROFILES.map(m => (
                <option key={m.name} value={m.name}>{m.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Color Palette & Custom Hex */}
        <div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '6px' }}>
            {POPULAR_COLORS.map(c => (
              <button
                key={c.name}
                onClick={() => updateParam('color', c.hex)}
                title={c.name}
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: c.hex,
                  border: params.color === c.hex ? '2px solid #ffffff' : '1px solid rgba(255,255,255,0.2)',
                  cursor: 'pointer',
                  transform: params.color === c.hex ? 'scale(1.15)' : 'scale(1)',
                  transition: 'transform 0.1s ease'
                }}
              />
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input
              type="color"
              value={params.color}
              onChange={e => updateParam('color', e.target.value)}
              style={{
                width: '28px',
                height: '28px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                background: 'transparent'
              }}
            />
            <input
              type="text"
              className="input-field code-font"
              value={params.color}
              onChange={e => updateParam('color', e.target.value)}
              style={{ flex: 1, padding: '4px 6px', fontSize: '11px' }}
            />
            <select
              className="input-field"
              value={params.finish}
              onChange={e => updateParam('finish', e.target.value)}
              style={{ width: '90px', padding: '4px 6px', fontSize: '11px' }}
            >
              <option value="glossy">{t.finishGlossy}</option>
              <option value="matte">{t.finishMatte}</option>
              <option value="silk">{t.finishSilk}</option>
              <option value="cf">{t.finishCF}</option>
            </select>
          </div>
        </div>
      </div>

      <hr style={{ borderColor: 'var(--border)', margin: '0' }} />

      {/* 4. Custom Notes Input */}
      <div>
        <label style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
          {t.customNotes}
        </label>
        <input
          type="text"
          className="input-field"
          value={params.notes}
          onChange={e => updateParam('notes', e.target.value)}
          placeholder={t.customNotesPlaceholder}
        />
      </div>

      {/* 6. Real-time Print Info Card */}
      <div style={{
        marginTop: 'auto',
        background: 'rgba(0, 0, 0, 0.4)',
        border: '1px solid var(--border)',
        borderRadius: '7px',
        padding: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Clock size={12} />
            {t.dimensions}
          </span>
          <span style={{
            fontSize: '10px',
            color: 'var(--bambu-green)',
            background: 'rgba(0, 174, 66, 0.1)',
            padding: '2px 5px',
            borderRadius: '4px'
          }}>
            {t.standardCard}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
          <span style={{ color: 'var(--text-muted)' }}>{t.triangles}</span>
          <span className="code-font" style={{ fontWeight: 600, color: '#38bdf8' }}>{triCount.toLocaleString()}</span>
        </div>
      </div>
    </aside>
  );
}
