import React, { useState, useEffect, useRef, useMemo } from 'react';
import Header from './components/Header';
import Viewport3D from './components/Viewport3D';
import ParameterPanel from './components/ParameterPanel';
import InfoModal from './components/InfoModal';
import SupportModal from './components/SupportModal';
import { generateTestModelGeometry } from './services/geometryGenerator';
import { exportTo3MF } from './services/threeMfExporter';
import { exportToSTL } from './services/stlExporter';
import { detectInitialLang, getTranslation } from './i18n/translations';

export default function App() {
  // Auto-detect browser locale on startup, with manual selector in Header
  const [lang, setLang] = useState(() => detectInitialLang());
  const t = useMemo(() => getTranslation(lang), [lang]);

  const [presetId, setPresetId] = useState('swatch');
  const [supportModalOpen, setSupportModalOpen] = useState(false);

  // Form input parameters currently being edited by the user
  const [params, setParams] = useState({
    brand: 'Bambu Lab',
    material: 'PLA Basic',
    color: '#00AE42',
    finish: 'glossy',
    nozzleTemp: 220,
    bedTemp: 55,
    bridgeSpeed: 50,
    bridgeFlow: 0.95,
    flowRatio: 0.98,
    kFactor: 0.020,
    includeHole: true,

    // Swatch specific
    translucentSteps: [0.2, 0.4, 0.6, 0.8, 1.0],

    // Bridge specific
    bridgeMinSpan: 10,
    bridgeMaxSpan: 50,
    bridgePillarHeight: 7.0,

    // Ironing 4x5 matrix specific
    ironingMinSpacing: 0.10,
    ironingMaxSpacing: 0.20,
    ironingMinFlow: 10,
    ironingMaxFlow: 25,
    enableIroning: false,
    ironingFlow: 15,
    ironingSpacing: 0.15,
    ironingSpeed: 30,

    // Fuzzy skin specific (4x4 standalone vertical)
    fuzzyNoiseType: 'classic',
    fuzzyMinThickness: 0.1,
    fuzzyMaxThickness: 0.4,
    fuzzyMinDistance: 0.2,
    fuzzyMaxDistance: 0.8,
    enableFuzzy: false,
    fuzzyPointDistance: 0.5,
    fuzzyThickness: 0.3,

    // Tolerance specific (4 rows)
    clearances: [0.10, 0.15, 0.20, 0.25, 0.30],
    toleranceDia1: 3.0,
    toleranceDia2: 4.5,
    toleranceDia3: 6.0,
    toleranceDia4: 7.5
  });

  // Ref to track geometry-affecting parameter signature to avoid re-rendering on appearance changes
  const prevGeoSigRef = useRef('');

  const [geometry, setGeometry] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [triCount, setTriCount] = useState(0);
  const [infoOpen, setInfoOpen] = useState(false);

  const viewportRef = useRef(null);

  const updateParam = (key, value) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const applyMaterialProfile = (profile) => {
    setParams(prev => ({
      ...prev,
      material: profile.name,
      nozzleTemp: profile.nozzleTemp,
      bedTemp: profile.bedTemp,
      bridgeSpeed: profile.bridgeSpeed,
      bridgeFlow: profile.bridgeFlow,
      flowRatio: profile.flowRatio,
      kFactor: profile.kFactor,
      finish: profile.finish
    }));
  };

  // Re-generate geometry in REAL-TIME immediately whenever presetId or geometric parameters change
  useEffect(() => {
    // Generate signature of parameters that physically alter 3D topology
    const geoSig = [
      presetId,
      params.brand,
      params.material,
      params.nozzleTemp,
      params.bedTemp,
      params.kFactor,
      params.includeHole !== false,
      (params.translucentSteps || []).join(','),
      params.bridgeMinSpan,
      params.bridgeMaxSpan,
      params.bridgePillarHeight,
      params.bridgeSpeed,
      params.bridgeFlow,
      params.ironingMinSpacing,
      params.ironingMaxSpacing,
      params.ironingMinFlow,
      params.ironingMaxFlow,
      params.fuzzyNoiseType,
      params.fuzzyMinDistance,
      params.fuzzyMaxDistance,
      params.fuzzyMinThickness,
      params.fuzzyMaxThickness,
      params.toleranceDia1,
      params.toleranceDia2,
      params.toleranceDia3,
      params.toleranceDia4,
      (params.clearances || []).join(',')
    ].join('|');

    let cancelled = false;

    // Small 25ms debounce to ensure buttery 60fps sliding while giving instant visual feedback
    const timer = setTimeout(() => {
      setIsGenerating(true);
      generateTestModelGeometry(presetId, params)
        .then(geo => {
          if (cancelled) return;
          setGeometry(geo);
          const nonIndexed = geo.toNonIndexed();
          setTriCount(nonIndexed.attributes.position.count / 3);
          prevGeoSigRef.current = geoSig;
        })
        .catch(err => {
          if (!cancelled) console.error('Failed to generate test geometry:', err);
        })
        .finally(() => {
          if (!cancelled) setIsGenerating(false);
        });
    }, 25);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [
    presetId,
    params.brand,
    params.material,
    params.nozzleTemp,
    params.bedTemp,
    params.flowRatio,
    params.includeHole,
    params.translucentSteps,
    params.bridgeMinSpan,
    params.bridgeMaxSpan,
    params.bridgePillarHeight,
    params.bridgeSpeed,
    params.bridgeFlow,
    params.ironingMinSpacing,
    params.ironingMaxSpacing,
    params.ironingMinFlow,
    params.ironingMaxFlow,
    params.fuzzyNoiseType,
    params.fuzzyMinDistance,
    params.fuzzyMaxDistance,
    params.fuzzyMinThickness,
    params.fuzzyMaxThickness,
    params.toleranceDia1,
    params.toleranceDia2,
    params.toleranceDia3,
    params.toleranceDia4,
    params.clearances
  ]);

  // Export 3MF Action
  const handleExport3MF = async () => {
    if (!geometry) return;
    try {
      setIsGenerating(true);
      const thumbBlob = viewportRef.current
        ? await viewportRef.current.captureThumbnailBlob()
        : null;

      const blob = await exportTo3MF(geometry, params, thumbBlob);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const filename = `Bambu_${params.brand}_${params.material}_${presetId}_128x75.3mf`.replace(/\s+/g, '_');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Trigger playful MakerWorld support modal if user hasn't opted out
      const hideModal = localStorage.getItem('hideMakerWorldSupportModal') === 'true';
      if (!hideModal) {
        setTimeout(() => {
          setSupportModalOpen(true);
        }, 400);
      }
    } catch (err) {
      console.error('Export 3MF Error:', err);
      alert('3MF 匯出失敗: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // Export STL Action
  const handleExportSTL = () => {
    if (!geometry) return;
    try {
      const blob = exportToSTL(geometry);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const filename = `Bambu_${params.brand}_${params.material}_${presetId}_128x75.stl`.replace(/\s+/g, '_');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export STL Error:', err);
      alert('STL 匯出失敗: ' + err.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>
      <Header
        presetId={presetId}
        onExport3MF={handleExport3MF}
        onExportSTL={handleExportSTL}
        isGenerating={isGenerating}
        onOpenInfo={() => setInfoOpen(true)}
        lang={lang}
        setLang={setLang}
        t={t}
      />

      <div style={{ display: 'flex', flex: 1, position: 'relative', overflow: 'hidden' }}>
        <main style={{ flex: 1, position: 'relative', background: '#EAE6DF' }}>
          <Viewport3D
            ref={viewportRef}
            geometry={geometry}
            params={params}
            isGenerating={isGenerating}
            t={t}
          />
        </main>

        <ParameterPanel
          presetId={presetId}
          setPresetId={setPresetId}
          params={params}
          updateParam={updateParam}
          applyMaterialProfile={applyMaterialProfile}
          triCount={triCount}
          isGenerating={isGenerating}
          t={t}
        />
      </div>

      <InfoModal isOpen={infoOpen} onClose={() => setInfoOpen(false)} t={t} />
      <SupportModal
        isOpen={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
        t={t}
      />
    </div>
  );
}
